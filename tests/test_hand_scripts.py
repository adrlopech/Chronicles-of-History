"""Every hand-written script in data/scripts/ passes the generator's own validator and lasts at least the one-minute floor (CLAUDE.md: hand-made scripts go through the validator too)."""
from pathlib import Path

import pytest

from services.motion_generator import MotionProject, estimated_seconds, make_validator, FLOOR_SECONDS

SCRIPTS = sorted((Path(__file__).resolve().parent.parent / "data" / "scripts").glob("*.json"))


@pytest.mark.parametrize("path", SCRIPTS, ids=[p.stem for p in SCRIPTS])
def test_hand_script_passes_the_validator(path):
    project = MotionProject.model_validate_json(path.read_text(encoding="utf-8"))
    assert make_validator(fmt=project.format, retention=True)(project) == []
    assert estimated_seconds(project) >= FLOOR_SECONDS
