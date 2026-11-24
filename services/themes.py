"""Colour themes of the videos: which warm brown-and-gold style a video is dressed in.

A theme (remotion_studio/src/chronicle/palette.ts THEMES) changes the colours but not the era: same typefaces, frames and pictures, different light and mood.
Every theme stays inside the official palette rules (guide/palette.md). The theme rotates so two videos in a row never share one.
"""
import hashlib
from typing import List, Optional

THEMES = ("gilded", "sepia", "ember", "regal", "bronze", "ivory", "smoke")
AVOID_LAST = 3  # a theme is not used again until three other videos have been made

# eras whose mood suggests a theme first (it is only a preference: a recent one is skipped)
ERA_PREFERENCE = {"wartime": "smoke", "frontier": "bronze", "empire": "regal", "spaceage": "sepia", "renaissance": "regal"}


def recent_themes(limit: int = AVOID_LAST) -> List[str]:
    """Themes of the last videos, newest first (best effort). Stored in shorts_history.preset as 'remotion_motion:<look>:<theme>'."""
    try:
        from services.history import get_db_connection, init_db

        init_db()
        with get_db_connection() as conn:
            rows = conn.execute("SELECT preset FROM shorts_history WHERE preset LIKE 'remotion_motion:%' ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
        out = []
        for r in rows:
            parts = r["preset"].split(":")
            out.append(parts[2] if len(parts) > 2 else "gilded")
        return out
    except Exception:
        return []


def choose_theme(look: str = "", topic: str = "", recent: Optional[List[str]] = None) -> str:
    """The colour theme of a video: the era's preferred one unless it was used lately, otherwise a hash-varied rotation that skips the recent ones."""
    recent = recent_themes() if recent is None else recent
    last = recent[:AVOID_LAST]
    pref = ERA_PREFERENCE.get(look)
    if pref and pref not in last:
        return pref
    fresh = [t for t in THEMES if t not in last] or list(THEMES)
    return fresh[int(hashlib.sha256((topic or "").lower().encode()).hexdigest(), 16) % len(fresh)]
