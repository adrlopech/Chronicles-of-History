"""Visual looks of the Motion videos: which one a video gets.

A look (remotion_studio/src/motion/looks.ts) is a whole visual identity: palette, background, headline typeface, alignment, HUD, camera, transitions and caption style.
The audit of Nov 2026 found every video drawn with the same codex-and-gold look, centred, with the same icons: they read as one video. Now each video gets one of fourteen looks,
chosen by the format's affinities, never one of the last few used, and varied by a hash of the topic. All are warm and historical (gold, bronze, parchment, crimson, deep teal, royal purple).
"""
import hashlib
from typing import List, Optional

LOOKS = ("codex", "mariner", "royal", "lapis", "marble", "parchment", "ivory", "cartograph", "crimson", "nocturne", "bronze", "ember", "dusk", "oasis")  # all warm: the channel palette in fourteen tonalities

# what each format looks best in (most fitting first); every look is allowed for the classic explainer
AFFINITY = {
    "fix": ("marble", "parchment", "bronze", "codex", "mariner"),
    "decode": ("cartograph", "bronze", "ivory", "dusk", "royal", "parchment"),
    "whatif": ("royal", "nocturne", "mariner", "oasis", "ivory", "marble"),
    "versus": ("lapis", "crimson", "royal", "ember", "codex", "mariner"),
    "evolution": ("mariner", "oasis", "ivory", "nocturne", "cartograph", "lapis"),
    "myth": ("lapis", "crimson", "codex", "dusk", "marble", "ivory"),
    "tier": ("mariner", "ember", "royal", "crimson", "lapis", "parchment"),
    "hardware": ("cartograph", "bronze", "codex", "marble", "mariner"),
    "simple": ("parchment", "mariner", "marble", "ivory"),
    "easter": ("royal", "nocturne", "lapis", "mariner", "codex"),
    "top5": ("lapis", "crimson", "ember", "royal", "mariner", "codex"),
    "eli5": ("parchment", "marble", "mariner", "ivory"),
    "fails": ("codex", "crimson", "royal", "lapis", "cartograph"),
    "numbers": ("cartograph", "bronze", "ivory", "lapis", "mariner"),
    "quiz": ("royal", "crimson", "ember", "lapis", "marble", "mariner"),
    "stop": ("lapis", "codex", "marble", "parchment"),
    "rumor": ("marble", "nocturne", "ivory", "dusk", "royal", "codex"),
    "review": ("parchment", "codex", "mariner", "marble"),
    "news": ("mariner", "dusk", "ivory", "cartograph", "marble"),
    "priced": ("lapis", "crimson", "codex", "ember", "royal", "mariner"),
    None: LOOKS,
}
AVOID_LAST = 3  # a look is not used again until three other videos have been made


def recent_looks(limit: int = AVOID_LAST) -> List[str]:
    """Looks of the last videos, newest first (best effort: empty on any error). They are stored in shorts_history.preset as 'remotion_motion:<look>'."""
    try:
        from services.history import get_db_connection, init_db

        init_db()
        with get_db_connection() as conn:
            rows = conn.execute("SELECT preset FROM shorts_history WHERE preset LIKE 'remotion_motion:%' ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
        return [r["preset"].split(":", 1)[1] for r in rows]
    except Exception:
        return []


def choose_look(fmt: Optional[str], topic: str = "", recent: Optional[List[str]] = None) -> str:
    """The look of a video: from the format's affinities, skipping the recent ones, starting at a point set by the topic so the same format varies from video to video."""
    recent = recent_looks() if recent is None else recent
    pool = list(AFFINITY.get(fmt, LOOKS))
    fresh = [x for x in pool if x not in recent[:AVOID_LAST]] or [x for x in LOOKS if x not in recent[:AVOID_LAST]] or pool
    start = int(hashlib.sha256((topic or "").lower().encode()).hexdigest(), 16)
    return fresh[start % len(fresh)]
