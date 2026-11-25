"""The last door before YouTube: the one-minute floor and the channel check (never the sibling Silicon Verdict channel)."""
import pytest

from config.settings import settings
from services import youtube
from services.youtube import YouTubeService


class _Channels:
    def __init__(self, ids):
        self.ids = ids

    def list(self, **_):
        return self

    def execute(self):
        return {"items": [{"id": i, "snippet": {"title": f"chan {i}"}} for i in self.ids]}


class _Client:
    def __init__(self, ids):
        self._c = _Channels(ids)

    def channels(self):
        return self._c


def _service(ids):
    svc = YouTubeService(token_path="/nonexistent")
    svc._client = _Client(ids)
    return svc


def test_silicon_verdict_token_is_refused(monkeypatch):
    monkeypatch.setattr(settings, "YOUTUBE_CHANNEL_ID", "")
    with pytest.raises(PermissionError, match="Silicon Verdict"):
        _service(["UCm0Xb9KY_Hu12j1CijF2KHQ"]).check_channel()


def test_pinned_channel_must_match(monkeypatch):
    monkeypatch.setattr(settings, "YOUTUBE_CHANNEL_ID", "UCchronicles")
    with pytest.raises(PermissionError, match="not to YOUTUBE_CHANNEL_ID"):
        _service(["UCother"]).check_channel()
    svc = _service(["UCchronicles"])
    svc.check_channel()
    assert svc._channel_ok


def test_short_video_is_never_uploaded(monkeypatch, tmp_path):
    from services import voice
    video = tmp_path / "v.mp4"
    video.write_bytes(b"x")
    monkeypatch.setattr(voice, "ffmpeg_duration", lambda _p: 58.0)
    with pytest.raises(ValueError, match="floor"):
        youtube.check_floor(video)
    monkeypatch.setattr(voice, "ffmpeg_duration", lambda _p: 62.0)
    youtube.check_floor(video)
