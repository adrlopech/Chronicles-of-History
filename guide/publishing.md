# Publishing

Official channels: YouTube [@chroniclesofhistorytv](https://www.youtube.com/@chroniclesofhistorytv) (channel id `UCgD3S0sVUW-HWYm9b8PiRRA`) and TikTok [@chroniclesofhistorytv](https://www.tiktok.com/@chroniclesofhistorytv).
**Never** publish to the Silicon Verdict channels (YouTube `@SiliconVerdictHQ`, TikTok `@siliconverdict`): the sibling project shares this code and may be authorised with the same Google login, so the uploader checks it (below).

## YouTube

`services/youtube.py` uploads with a resumable chunked upload (retries with backoff) and sets the category (27, Education), `#Shorts` in title or description, `selfDeclaredMadeForKids: false`, and optionally a scheduled time.

```bash
.venv/bin/python scripts/upload_existing.py "<video.mp4>"                       # public now
.venv/bin/python scripts/upload_existing.py "<video.mp4>" --privacy private --publish-at 2026-11-17T13:00:00Z
```

- **Two checks before every upload**, whatever the path (pipeline, `genera`, `upload_existing.py`, retries):
  - **the minute:** a video under `FLOOR_SECONDS` (61 s) is refused. Lengthen the script or remake it;
  - **the channel:** the token must belong to `YOUTUBE_CHANNEL_ID` (the Chronicles channel by default). A Silicon Verdict token is always refused, even with `YOUTUBE_CHANNEL_ID=""`.
- Title, description and hashtags come from the `.txt` next to the TikTok copy. A scheduled upload is always `private` with `publishAt` (RFC 3339, UTC); YouTube publishes it at that time.
- **Thumbnail:** if `<video>.png` exists (the [cover](pipeline.md#7-cover)), `upload_existing.py` sets it with `thumbnails().set` after the upload. A failure is reported, never fatal. The thumbnail is the vertical cover as it is (JPEG, 9:16): Studio crops a 16:9 image to its centre, so never convert it.
- Uploads can be refused for a daily limit (`uploadLimitExceeded`): `scripts/retry_youtube_uploads.py <manifest>` resends the missing ones.
- Delete a video in YouTube Studio (the video's menu, Delete, tick the box, confirm).

### YouTube OAuth

This project needs **its own** OAuth client and token: never copy `token.json` from Silicon Verdict (the channel check would refuse it anyway).
Ask the operator before each authorisation. Steps:

1. In Google Cloud Console, create an OAuth client of type *Desktop app* for this project and save its JSON as `client_secrets.json` in the project root (git-ignored).
   On the consent screen (Google Auth Platform > Información de la marca) use the portal as homepage and its legal pages: `https://adrlopech.github.io/Chronicles-of-History/`, `privacy.html`, `terms.html`, with that domain as an authorized domain.
   Publish the app to **Production** (Público > Publicar app): in Testing a refresh token dies after 7 days. The app may stay "unverified", which only shows a warning at login.
2. Authorise:

   ```bash
   BROWSER=true .venv/bin/python scripts/authenticate_yt.py      # prints the Google URL and listens on localhost:8080
   ```

   Open the URL in a browser signed in to Google, choose the Google account that owns the channel and then the **The Chronicles of History** brand account (not Silicon Verdict),
   press Continuar past "Google no ha verificado esta aplicación" (it is your own app), tick *Seleccionar todo* and press Continuar.
   The scopes are `youtube.upload`, `youtube.readonly` (the channel check and analytics), `yt-analytics.readonly` and `youtube.force-ssl` (comments).
3. The script writes `data/token.json` and `token.json` (and `tokens/token.json` if that folder exists). Check the channel with
   `.venv/bin/python -c "from services.yt_analytics import channel; print(channel())"`: it must print the Chronicles channel.

A token stops working (`invalid_grant`) if the access is revoked, the Google password changes or, for an app still in Testing, after 7 days: run step 2 again.
A refresh must keep the stored scopes: `services/youtube.py` loads the token without passing scopes for that reason.

## TikTok

There is no posting API in use.
Videos are scheduled by hand in **TikTok Studio** (`https://www.tiktok.com/tiktokstudio/upload`), which the assistant drives with Claude in Chrome. Use the **<10 MB copy**
(`output/tiktok_small/`, the upload tool caps one call at 10 MB) and the cover PNG.

### TikTok Studio step by step

Per entry of `data/batches/latest.json` (`caption`, `hashtags`, `tiktok_copy`, `cover`, `madrid` hour). The page-side work is in `scripts/tiktok_studio.js`, which finds every element by class, role or text: no screen coordinates
(they broke whenever the window size changed). Paste that file's body into the page once per load (`javascript_tool`); it defines `tt`.

1. Open `/tiktokstudio/upload`, `find` "file input" and `file_upload` the `tiktok_copy`. Wait about 10 seconds for the form.
2. **Description:** `tt.focusCaption()`, then real keystrokes (`computer`): `cmd+a`, `Delete`, type the `caption`. The editor ignores programmatic edits and **crashes the page** on `execCommand`, so never edit it from JavaScript.
   For **every hashtag**: type ` #tag` with `computer`, wait about 3 s, then `await tt.pickHashtag('#tag')` (it clicks the exact option; it returns `{ok, suggestions}`).
   A hashtag typed but not picked stays plain text: `tt.state().hashtags` must list all of them. If `ok` is false the exact tag is not offered (for example a very rare place name); delete it and use one of the `suggestions`.
3. **Cover:** `find` "Editar portada", click it, `find` "Cargar portada file input" and `file_upload` the cover PNG, then press **Guardar** (`await tt.press('Guardar')`).
4. **Schedule:** `await tt.schedule({date: '2026-11-24', time: '20:00'})` (minutes in steps of 5). It selects "Programación", walks the calendar to the right month, picks the day and the hour and returns `{ok, value}`: check `ok`.
   The time zone shows **Hora local**, the computer's zone: **(GMT+1)** in Madrid in winter and (GMT+2) in summer, so use the Madrid hour of the plan; if the computer is elsewhere (it showed GMT+0 in Lisbon) convert from the UTC hour.
5. `await tt.press('Programar')`. If the dialog "¿Seguir con la publicación?" appears (TikTok is still reviewing the content), `await tt.confirmReview()` ("Publicar ahora" continues the *scheduled* post).
   For a video that must go out right now, leave the radio on "Ahora" and `await tt.press('Publicar')`.
6. Check `/tiktokstudio/content`: the new posts show "16 nov, 20:00 (GMT+1) Madrid" style times (the list can take a few seconds to show the new post: reload).

To throw an upload away: `await tt.press('Descartar')` and confirm the red "Descartar" of the dialog. Delete a published post: the "..." menu of its row, Eliminar, confirm.
If TikTok changes its page, the selectors to fix are the ones at the top of `tiktok_studio.js` (`.Picker__*`, `.TimePicker__*`, `.DatePicker__*`, `.mention`, `[role=option]`); `tt.state()` shows what the page offers.

### TikTok rules

- Hashtags are single joined words, and they must be picked from the dropdown.
- In the caption a series number like `#7` would become a hashtag: `tiktok_caption()` writes it as `7`.
- Before uploading, check that the account open in TikTok Studio is `@chroniclesofhistorytv`. Never publish from a personal account or from `@siliconverdict`.

## Hours

| Slot (UTC) | Madrid winter (UTC+1) | Madrid summer (UTC+2) | New York (winter) |
|---|---|---|---|
| 13:00 | 14:00 | 15:00 | 8 am |
| 16:00 | 17:00 | 18:00 | 11 am |
| 19:00 | 20:00 | 21:00 | 2 pm |
| 22:00 | 23:00 | 00:00 | 5 pm |

The plan prints the Madrid hour for the batch's own date (`Europe/Madrid`, so summer time is handled). If the computer clock is in another zone (for example on a trip), the plan is still in UTC.
Never put two videos on the same hour.

## Hashtags and metadata

- Titles end with joined-word hashtags (`#history #ancientrome`); `joined_hashtag()` removes spaces. Each series adds its own hashtag (`services/series.py`).
- `pinned_comment` is the two-option vote of the outro ("A or B? Reply with one word."). It must be posted by hand; the API flow does not post comments.

## Comments

`python scripts/comments.py` lists the comments of the last days that the channel has not answered, with a suggested reply each (written to `notes/comments_<date>.md`); `--post` asks y / n / your own text for every one and posts only the approved ones.
It needs the `youtube.force-ssl` scope, which `scripts/authenticate_yt.py` already asks for. Without it the script says so and does nothing.
