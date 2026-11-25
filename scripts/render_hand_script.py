"""Renders hand-written scripts (data/scripts/<name>.json) with voice and writes the files under output/ (nothing is uploaded).

    PYTHONPATH=. .venv/bin/python scripts/render_hand_script.py caesar_rubicon roanoke_colony ...
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from services.motion_generator import MotionProject  # noqa: E402
from services.motion_pipeline import run_motion_pipeline  # noqa: E402

for name in sys.argv[1:]:
    project = MotionProject(**json.loads((ROOT / "data" / "scripts" / f"{name}.json").read_text(encoding="utf-8")))
    print(f"=== {name}", flush=True)
    try:
        run_motion_pipeline(topic=project.topic, fmt=project.format, export_only=True, script=project)
        print(f"OK {name}", flush=True)
    except Exception as exc:  # keep going with the next video
        print(f"FAILED {name}: {exc}", flush=True)
