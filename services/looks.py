"""Visual looks of the videos: which era a video is drawn in.

A look (remotion_studio/src/chronicle/looks.ts) is the paper, ink, typefaces and frame of one period of history. The topic decides the era; when it names none,
the look is rotated so two videos in a row never share one, and varied by a hash of the topic.
"""
import hashlib
import re
from typing import List, Optional

LOOKS = ("antiquity", "manuscript", "seachart", "empire", "industrial", "wartime")

# keywords of the topic -> era (first match wins)
ERA_KEYWORDS = (
    ("wartime", r"\b(world war|ww[12]|wwii|nazi|hitler|cold war|soviet|stalin|d-day|trench\w*|holocaust|vietnam|korean war|cuban missile)\b"),
    ("industrial", r"\b(industrial|steam|railway|railroad|factory|victorian|titanic|telegraph|gold rush|civil war|18[0-9]{2}|19[01][0-9])\b"),
    ("empire", r"\b(napoleon|louis xiv|french revolution|tsar|romanov|tudor|henry viii|elizabeth|dynasty|ottoman|habsburg|versailles|monarch\w*|empress|king|queen)\b"),
    ("seachart", r"\b(pirate\w*|armada|columbus|magellan|explor\w*|voyage|navigat\w*|conquistador\w*|age of sail|spice|silk road|colonial\w*|trade route)\b"),
    ("manuscript", r"\b(medieval|middle ages|viking\w*|crusade\w*|knight\w*|plague|black death|feudal|charlemagne|joan of arc|castle\w*|monk\w*|mongol\w*|genghis)\b"),
    ("antiquity", r"\b(rome|roman|greek|greece|egypt\w*|pharaoh\w*|sparta\w*|athens|persia\w*|babylon\w*|alexander|alexandria|caesar|cleopatra|trojan|troy|gladiator\w*|colosseum|parthenon|pyramid\w*|carthage|mesopotamia\w*|bronze age|ancient)\b"),
)
AVOID_LAST = 3  # a look is not used again until three other videos have been made


def era_look(topic: str) -> Optional[str]:
    """The look the topic's words point to, or None when they point to no era."""
    for name, pattern in ERA_KEYWORDS:
        if re.search(pattern, topic or "", re.I):
            return name
    return None


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
    """The look of a video: the topic's era when it has one (an era may repeat: a Rome video is always antique), otherwise a rotation that skips the recent ones.
    `fmt` is kept for the pipeline's signature; history formats do not pick looks."""
    era = era_look(topic)
    if era:
        return era
    recent = recent_looks() if recent is None else recent
    fresh = [x for x in LOOKS if x not in recent[:AVOID_LAST]] or list(LOOKS)
    start = int(hashlib.sha256((topic or "").lower().encode()).hexdigest(), 16)
    return fresh[start % len(fresh)]
