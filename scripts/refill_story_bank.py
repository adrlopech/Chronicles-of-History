#!/usr/bin/env python3
"""Fills the story bank (data/history.db) with validated, fact-checked history scripts so publishing never depends on a Gemini spike.

Run it off-peak (e.g. nightly via cron/launchd):
  python scripts/refill_story_bank.py                          # top up every format to 4 ready scripts
  python scripts/refill_story_bank.py --format mystery --target 8
Formats: mystery dayinlife turning lies whatif duel journey portrait (see guide/formats.md).
"""
import argparse
import logging
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from services.gemini_client import GeminiUnavailable  # noqa: E402
from services.history import get_recently_used_topics_safe  # noqa: E402
from services.motion_generator import FORMATS  # noqa: E402
from services.story_bank import add_story, count_ready, topics_in_bank  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("refill_story_bank")


def refill_motion(fmt: str, target: int) -> int:
    """History scripts of one format, fact-checked like a live generation."""
    from services.motion_generator import generate_motion_project
    added = 0
    while count_ready("motion", fmt) < target:
        avoid = topics_in_bank("motion") + get_recently_used_topics_safe()
        try:
            project = generate_motion_project(None, avoid_topics=avoid, fmt=fmt)
        except (GeminiUnavailable, RuntimeError) as exc:
            log.warning("Stopping: no script possible right now (%s)", str(exc)[:120])
            break
        add_story("motion", project)
        added += 1
        log.info("Banked %s script: %s (%d ready)", fmt, project.topic, count_ready("motion", fmt))
    return added


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--format", default="all", choices=["all", *FORMATS], help="One format, or all of them")
    ap.add_argument("--target", type=int, default=4, help="Ready scripts to keep per format")
    args = ap.parse_args()
    total = sum(refill_motion(f, args.target) for f in (FORMATS if args.format == "all" else (args.format,)))
    log.info("Done: %d new scripts banked. Ready: %s", total, ", ".join(f"{f}={count_ready('motion', f)}" for f in FORMATS))


if __name__ == "__main__":
    main()
