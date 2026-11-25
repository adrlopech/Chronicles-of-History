import http.client
import logging
import random
import time
from pathlib import Path
from typing import List, Optional

import httplib2
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import Resource, build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

from config.settings import settings

logger = logging.getLogger(__name__)

YOUTUBE_SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]

RETRIABLE_STATUS_CODES = [500, 502, 503, 504]
RETRIABLE_EXCEPTIONS = (
    httplib2.HttpLib2Error,
    IOError,
    http.client.NotConnected,
    http.client.IncompleteRead,
    http.client.ImproperConnectionState,
    http.client.CannotSendRequest,
    http.client.CannotSendHeader,
    http.client.ResponseNotReady,
    http.client.BadStatusLine,
)
MAX_RETRIES = 10
DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024  # 5MB chunks for resumable upload
FORBIDDEN_CHANNELS = {"UCm0Xb9KY_Hu12j1CijF2KHQ"}  # Silicon Verdict (@SiliconVerdictHQ): the sibling project, never a target from here


def check_floor(video_path: Path) -> None:
    """The one-minute rule at the last door: no upload path (pipeline, batch, upload_existing, retries) can publish a video under FLOOR_SECONDS."""
    from services.motion_generator import FLOOR_SECONDS
    from services.voice import ffmpeg_duration
    seconds = ffmpeg_duration(video_path)
    if seconds is None:
        logger.warning("Could not read the length of %s before uploading", video_path)
    elif seconds < FLOOR_SECONDS:
        raise ValueError(f"{video_path.name} lasts {seconds:.1f} s, under the {FLOOR_SECONDS:.0f} s floor: it is not published (lengthen the script or remake it)")


class YouTubeService:
    """Manages YouTube Data API v3 authentication, automatic token refresh, and resumable video uploads."""

    def __init__(self, token_path: Optional[str] = None):
        if token_path:
            self.token_file = Path(token_path)
        else:
            self.token_file = settings.resolve_token_path()

        self._client: Optional[Resource] = None
        self._channel_ok = False

    def get_authenticated_client(self) -> Resource:
        """Loads credentials from token.json, auto-refreshes expired tokens, and builds the YouTube client."""
        if self._client is not None:
            return self._client

        if not self.token_file.is_file():
            raise FileNotFoundError(
                f"YouTube token file not found at: {self.token_file.resolve()}.\n"
                "Execute 'python scripts/authenticate_yt.py' on your local workstation to generate token.json."
            )

        logger.info("Loading YouTube OAuth credentials from: %s", self.token_file)
        # Keep the scopes stored in the file: passing YOUTUBE_SCOPES here would narrow them and the
        # refresh below would rewrite token.json without the analytics scopes.
        credentials = Credentials.from_authorized_user_file(str(self.token_file))

        # Refresh token automatically if expired
        if not credentials or not credentials.valid:
            if credentials and credentials.expired and credentials.refresh_token:
                logger.info("Access token has expired. Initiating automatic refresh with Google OAuth server...")
                try:
                    credentials.refresh(Request())
                    # Persist refreshed token back to disk
                    with open(self.token_file, "w", encoding="utf-8") as f:
                        f.write(credentials.to_json())
                    logger.info("YouTube OAuth token successfully refreshed and saved to disk.")
                except Exception as exc:
                    logger.error("Failed to automatically refresh OAuth token: %s", exc)
                    raise PermissionError(f"OAuth token refresh failed: {exc}") from exc
            else:
                raise PermissionError(
                    "YouTube credentials are invalid or lack a refresh token. "
                    "Re-run 'python scripts/authenticate_yt.py' with prompt='consent'."
                )

        self._client = build("youtube", "v3", credentials=credentials)
        return self._client

    def check_channel(self) -> None:
        """Refuses to upload with the token of the wrong channel (the sibling project uses the same code and the same Google login).
        Blocked: the Silicon Verdict channel always; with YOUTUBE_CHANNEL_ID set, any channel but that one."""
        if self._channel_ok:
            return
        expected = settings.YOUTUBE_CHANNEL_ID.strip()
        try:
            items = self.get_authenticated_client().channels().list(part="id,snippet", mine=True).execute().get("items", [])
        except Exception as exc:  # a token without youtube.readonly cannot tell which channel it is
            if expected:
                raise PermissionError(f"cannot confirm the token's channel ({exc}); YOUTUBE_CHANNEL_ID is set, so nothing is uploaded") from exc
            logger.warning("Could not confirm which channel the token belongs to (%s). Set YOUTUBE_CHANNEL_ID to make this check strict.", exc)
            return
        ids = [c["id"] for c in items]
        names = ", ".join(c.get("snippet", {}).get("title", c["id"]) for c in items) or "none"
        if FORBIDDEN_CHANNELS & set(ids):
            raise PermissionError(f"the YouTube token belongs to Silicon Verdict ({names}): never upload Chronicles videos there. Run scripts/authenticate_yt.py with the Chronicles channel.")
        if expected and expected not in ids:
            raise PermissionError(f"the YouTube token belongs to {names} ({', '.join(ids)}), not to YOUTUBE_CHANNEL_ID {expected}")
        if not expected:
            logger.warning("Uploading to %s; set YOUTUBE_CHANNEL_ID=%s in .env to pin it.", names, ids[0] if ids else "UC...")
        self._channel_ok = True

    def upload_video(
        self,
        file_path: str,
        title: str,
        description: str,
        tags: List[str],
        privacy_status: str = "private",
        is_short: bool = False,
        chunk_size: int = DEFAULT_CHUNK_SIZE,
        publish_at: Optional[str] = None,
    ) -> str:
        """Uploads a video to YouTube using chunked resumable upload with exponential backoff.

        Args:
            file_path: Local path to the .mp4 video file.
            title: Video title (max 100 characters).
            description: Video description (max 5000 characters).
            tags: SEO keyword tags.
            privacy_status: 'private', 'unlisted', or 'public'.
            is_short: If True, validates/appends #Shorts tag in title/description.
            chunk_size: Byte size per upload chunk (default 5MB).

        Returns:
            str: Direct YouTube video URL (https://youtu.be/{video_id}).
        """
        video_path = Path(file_path)
        if not video_path.is_file():
            raise FileNotFoundError(f"Video file to upload does not exist: {file_path}")
        check_floor(video_path)

        youtube = self.get_authenticated_client()
        self.check_channel()

        # Format title & description for Shorts compliance
        final_title = title.strip()
        final_description = description.strip()

        if is_short:
            if "#Shorts" not in final_title and "#shorts" not in final_title:
                if len(final_title) <= 92:
                    final_title = f"{final_title} #Shorts"
            if "#Shorts" not in final_description and "#shorts" not in final_description:
                final_description = f"{final_description}\n\n#Shorts #History"

        # Apply YouTube character limits
        safe_title = final_title[:100]
        safe_description = final_description[:5000]
        safe_tags = tags[:50]

        body = {
            "snippet": {
                "title": safe_title,
                "description": safe_description,
                "tags": safe_tags,
                "categoryId": settings.YOUTUBE_CATEGORY_ID,  # 27: Education
            },
            "status": {
                "privacyStatus": privacy_status,
                "selfDeclaredMadeForKids": False,
            },
        }

        if publish_at:  # RFC 3339 UTC; YouTube requires private + publishAt
            body["status"]["privacyStatus"] = "private"
            body["status"]["publishAt"] = publish_at

        media = MediaFileUpload(
            str(video_path),
            mimetype="video/*",
            chunksize=chunk_size,
            resumable=True,
        )

        insert_request = youtube.videos().insert(
            part=",".join(body.keys()),
            body=body,
            media_body=media,
        )

        logger.info(
            "Starting resumable upload: '%s' | Size: %.2f MB | Privacy: %s",
            safe_title,
            video_path.stat().st_size / (1024 * 1024),
            privacy_status,
        )

        response = None
        retry_count = 0

        while response is None:
            try:
                status, response = insert_request.next_chunk()
                if status:
                    progress = int(status.progress() * 100)
                    logger.info("Upload progress for '%s': %d%%", safe_title, progress)
            except HttpError as exc:
                status_code = exc.resp.status
                error_details = exc._get_reason()
                if status_code in RETRIABLE_STATUS_CODES:
                    retry_count += 1
                    if retry_count > MAX_RETRIES:
                        logger.error("Max HTTP retries exceeded uploading video. Status: %d", status_code)
                        raise RuntimeError(f"Max retries reached: {status_code} - {error_details}") from exc
                    sleep_seconds = (2 ** retry_count) + random.uniform(0.5, 1.5)
                    logger.warning(
                        "Retriable HTTP error %d: '%s'. Retrying in %.1fs (attempt %d/%d)...",
                        status_code, error_details, sleep_seconds, retry_count, MAX_RETRIES
                    )
                    time.sleep(sleep_seconds)
                else:
                    logger.error("Fatal non-retriable YouTube API error (status %d): %s", status_code, error_details)
                    raise
            except RETRIABLE_EXCEPTIONS as exc:
                retry_count += 1
                if retry_count > MAX_RETRIES:
                    logger.error("Max network retries exceeded uploading video.")
                    raise RuntimeError(f"Max network retries reached: {exc}") from exc
                sleep_seconds = (2 ** retry_count) + random.uniform(0.5, 1.5)
                logger.warning(
                    "Network connection issue: '%s'. Retrying in %.1fs (attempt %d/%d)...",
                    exc, sleep_seconds, retry_count, MAX_RETRIES
                )
                time.sleep(sleep_seconds)

        video_id = response.get("id")
        video_url = f"https://youtu.be/{video_id}"
        logger.info("SUCCESS: Video uploaded to YouTube! Video ID: %s | URL: %s", video_id, video_url)
        return video_url


    @staticmethod
    def make_thumbnail(image_path: str, out_path: Optional[str] = None) -> Path:
        """The thumbnail of a Short is its own vertical cover (9:16, 1080x1920) as a JPEG under 2 MB. Do not turn it into 16:9: YouTube Studio and the Shorts shelves show a vertical
        slot, and a 16:9 image is cropped to its centre there (checked in Studio on 2026-11-23: "EVERY RADEON" became "ADEON E AT S PRICE"). Where a 16:9 slot is needed YouTube pads the vertical image itself."""
        from PIL import Image
        out = Path(out_path) if out_path else Path(image_path).with_name(Path(image_path).stem + "_thumb.jpg")
        Image.open(image_path).convert("RGB").save(out, quality=90)
        return out

    def set_thumbnail(self, video_id: str, image_path: str) -> None:
        """Sets the custom thumbnail of an uploaded video: its vertical cover (see make_thumbnail)."""
        img = Path(image_path)
        if not img.is_file():
            raise FileNotFoundError(f"Cover image does not exist: {image_path}")
        thumb = self.make_thumbnail(str(img))
        self.get_authenticated_client().thumbnails().set(videoId=video_id, media_body=MediaFileUpload(str(thumb), mimetype="image/jpeg")).execute()
        logger.info("Thumbnail set for %s", video_id)


# Global service instance and backward-compatibility wrapper
youtube_service = YouTubeService()


def upload_video_resumable(
    file_path: str,
    title: str,
    description: str,
    tags: List[str],
    privacy_status: Optional[str] = None,
    is_short: bool = False,
    publish_at: Optional[str] = None,
) -> str:
    """Convenience functional wrapper around YouTubeService.upload_video."""
    privacy = privacy_status or settings.YOUTUBE_PRIVACY_STATUS
    return youtube_service.upload_video(
        file_path=file_path,
        title=title,
        description=description,
        tags=tags,
        privacy_status=privacy,
        is_short=is_short,
        publish_at=publish_at,
    )
