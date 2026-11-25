"""Named, numbered series for the Motion formats ("Turning Point #7", "Unsolved #12").

Numbered series work on short video: the title, the first frame and the hashtag repeat, so a viewer who liked one video recognises the next. Each format has a series name and a one-word hashtag; the number is how many different topics of that format
the history already holds, plus one.
"""
import re
from typing import Any, Dict, Optional, Tuple

from services.history import get_db_connection, init_db

# format -> (series name shown in the title and on the first frame, one-word hashtag without the #)
SERIES: Dict[str, Tuple[str, str]] = {
    "mystery": ("Unsolved", "unsolvedhistory"),
    "dayinlife": ("A Day In", "adayinhistory"),
    "turning": ("Turning Point", "turningpoint"),
    "lies": ("History Lies", "historylies"),
    "whatif": ("What If History", "whatifhistory"),
    "duel": ("History Duel", "historyduel"),
    "journey": ("The Route", "historyroute"),
    "portrait": ("Life in Dates", "lifeindates"),
}
MAX_TITLE = 100  # MotionProject.title limit
_HASHTAGS = re.compile(r"\s*#\w+")


def next_number(fmt: str) -> int:
    """How many different topics of this format are in shorts_history, plus one."""
    init_db()
    with get_db_connection() as conn:
        row = conn.execute("SELECT COUNT(DISTINCT topic) FROM shorts_history WHERE category = ?", (f"MOTION GRAPHICS {fmt.upper()}",)).fetchone()
    return int(row[0]) + 1


def joined_hashtag(text: str) -> str:
    """'#' plus the text with every space and symbol removed: hashtags are always one joined word."""
    return "#" + re.sub(r"[^0-9A-Za-z]", "", text)


def apply_series(project: Any, number: Optional[int] = None) -> Optional[str]:
    """Adds the series label AFTER the hook ("Caesar Crosses the Rubicon | Turning Point #7"): the Shorts feed cuts long titles, so the subject and the hook come first.
    Also puts the label on the first scene's kicker (the cover frame), adds the series hashtag to the tags and a line to the description.
    Returns the label, or None when the format has no series or the project already carries it."""
    entry = SERIES.get(project.format or "")
    if not entry:
        return None
    name, tag = entry
    if f"{name.lower()} #" in project.title.lower() or project.title.lower().startswith(name.lower()):
        return None
    n = number if number is not None else next_number(project.format)
    label = f"{name} #{n}"
    hashtags = "".join(_HASHTAGS.findall(project.title))
    text = _HASHTAGS.sub("", project.title).strip()
    room = MAX_TITLE - len(label) - 2 - len(hashtags)
    if len(text) > room:
        text = text[: max(10, room - 1)].rstrip(" ,:;-") + "…"
    project.title = f"{text} | {label}{hashtags}"
    if project.scenes:
        project.scenes[0].kicker = label.lower()
    if tag not in [t.lstrip("#").lower() for t in project.tags]:
        project.tags = list(project.tags) + [tag]
    project.description = project.description.rstrip() + f" Part of the {name} series."
    return label
