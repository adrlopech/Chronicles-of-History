---
description: Genera 2 vídeos de Motion elegidos con los datos de YouTube/TikTok y los programa (por defecto para mañana; "de hoy" = fecha de hoy) en las mejores horas, con portada, en YouTube y TikTok
---

Ejecuta el flujo `genera` completo SIN preguntar nada (el usuario ya autorizó publicar). Explicación de cada paso: `guide/daily-workflow.md`; clics de TikTok Studio: `guide/publishing.md`.
Si el usuario pide "los de hoy", usa `--date` con la fecha UTC de hoy; si no, el lote es para mañana. Si pide analizar antes, lee los últimos 10 vídeos de YouTube (`scripts/report_retention.py` y `videos().list(part="statistics")`)
y de TikTok (`tiktokstudio/content`) y resume qué funciona.

0. Si la API de YouTube falla con `invalid_grant`, el token caducó o se revocó: pide permiso y renuévalo (`guide/publishing.md#youtube-oauth`).
1. Plan: `PYTHONPATH=. .venv/bin/python scripts/genera_batch.py --plan [--date AAAA-MM-DD] [--avoid formatos-de-ayer]`. Enséñalo en una tabla (hora UTC y Madrid, formato, motivo). Sale de YouTube Analytics + `data/batches/log.json`.
2. Produce y programa YouTube: `PYTHONPATH=. .venv/bin/python scripts/genera_batch.py [--date ...] [--avoid ...]` en segundo plano (5-10 min; no sondees). Renderiza 2 formatos distintos, sube cada uno a YouTube (The Chronicles of History, `@chroniclesofhistorytv`, privado + `publishAt`; la subida se niega si el token es de otro canal) con su portada como miniatura y escribe `data/batches/latest.json` (título, `caption`, `hashtags`, `tiktok_copy`, `cover`, hora).
   Si un hueco falla (`FAILED (nothing uploaded for this slot)`), relánzalo con `--topics` y `"slot"` fijo, `--out data/batches/retry.json`, usando otro de los ocho formatos (mystery, turning, whatif, duel, lies, journey, portrait, dayinlife) o un guion a mano de `data/scripts/` (`"script"`). Un vídeo que no pasa el QA (por ejemplo, menos de 61 s) no se sube: alarga el guion o rehazlo.
3. Verifica en YouTube (API): `privacyStatus` private y `publishAt` correcto en los 2.
4. TikTok (`@chroniclesofhistorytv`, Claude in Chrome; comprueba arriba a la derecha que la cuenta abierta es esa antes de subir nada): por cada entrada, sigue los pasos de `guide/publishing.md#tiktok-studio-step-by-step` con el ayudante `scripts/tiktok_studio.js` (objeto `tt`, sin coordenadas de pantalla): subir `tiktok_copy`; descripción = `caption` tecleada con `computer` (nunca por JavaScript: el editor se rompe) + CADA hashtag tecleado y elegido con `tt.pickHashtag` (`tt.state().hashtags` debe listarlos todos); subir `cover` en "Editar portada" y Guardar; `tt.schedule({date, time})` con la hora de Madrid del plan (columna "Madrid"; ya tiene en cuenta el horario de verano); `tt.press('Programar')` ("¿Seguir con la publicación?" → `tt.confirmReview()`).
   Comprueba en `tiktokstudio/content` que los 2 salen con su hora.
5. Informa al final: tabla con vídeo, formato, hora Madrid y enlace de YouTube, y avisa de lo que no se pudo comprobar (por ejemplo, que las miniaturas de YouTube no se vieron en Studio). Si ya hay un vídeo programado a la misma hora, mueve el nuevo.

Reglas fijas: hashtags de una sola palabra pegada; nunca los canales de Silicon Verdict (`@SiliconVerdictHQ`, `@siliconverdict`) ni "Frame Floor"; los vídeos duran al menos 61 s; commit y push directos a `main` si cambias código.
