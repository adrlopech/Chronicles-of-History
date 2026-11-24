# Content formats

Every video follows one of eight formats (`FORMATS` in `services/motion_generator.py`). A format fixes the **structure** of the story, the scene types it needs and the rules the validator enforces; `FORMAT_RULES` holds the prompt,
`FORMAT_NEEDS` the checks, `TOPIC_HINTS` the subject hints, `services/series.py` the series name and hashtag. Make one with `.venv/bin/python main.py --motion-format <format> [--topic "..."]`; `any` draws a weighted random one.

| Format | Series (title prefix) | What it is | Needs |
|---|---|---|---|
| `mystery` | Unsolved #n | One real unsolved or disputed mystery: what we know, two leading theories, what is missing. Vote: which theory | a `date`; a `timeline`, `list` or `map` |
| `dayinlife` | A Day In #n | The day of an ordinary person at a precise place and year, told in the second person. Vote: would you survive it? | one `timeline` of 4-5 hours; a `date` |
| `turning` | Turning Point #n | The decision or moment that changed history: stakes, options, the decision, consequences. Vote: genius or mistake? | a `date`; a `timeline` |
| `lies` | History Lies #n | A theme and 4-6 popular beliefs, each stamped myth, fact or partly with the one-line truth | 4-6 `verdict` scenes: 3+ myth/partly, 1+ fact |
| `whatif` | What If History #n | A counterfactual built on a real, documented hinge; consequences always hedged | hook starts "What if"; a `date`; hedged language |
| `duel` | History Duel #n | Two real contenders over 3-5 rounds, one measurable figure each. Vote: who wins? | 3-5 `versus`, the same two names |
| `journey` | The Route #n | An expedition, campaign, migration or trade route inked on a hand-drawn map | a `map` with 3+ places; a `date` |
| `portrait` | Life in Dates #n | One well documented life told through its key dates, at most one real quote | 2+ `date`; a `timeline` |

## Rules that apply to all of them

- 11-19 scenes (duel: 9-19), 150-190 words of narration, 62-90 s. First scene a `statement` (cold open, at most 14 words), last scene the `outro` with a two-option vote that names this video's own two options.
- An open loop in scene 2-5 ("Stay to the end, the catch comes last."), no more than two `statement` scenes in a row, no same scene type twice in a row (except `versus` and `verdict`).
- Figures in `ledger` and `versus` scenes are whole numbers and must be said in the narration. A `quote` names its author in the narration. `image` scenes are not available yet.
- **Facts come first.** Every date, name and figure must be real and well documented; where historians disagree the script says so; a quotation is allowed only if it is famous and documented. A second model fact-checks every script
  (dates, figures, quotes, stamps, hedging) and rewrites the lines it finds wrong.

## Adding or changing a format

1. Add the name to `FORMATS`, a weight to `FORMAT_WEIGHTS`, a block to `FORMAT_RULES`, a hint to `TOPIC_HINTS` and a check to `FORMAT_NEEDS`.
2. Add its series to `services/series.py`, a narrator to `VOICE_BY_FORMAT` and two music beds to `MUSIC_BY_FORMAT` (`services/motion_pipeline.py`), and the name to `MOTION_FORMATS` in `main.py` and the help text.
3. Add a valid script shape to `SHAPES` in `tests/test_motion_validators.py`: the tests check that every format is registered everywhere.

Hand-written scripts go in `data/scripts/*.json` (a `MotionProject`); render one silently with `scripts/render_silent_preview.py`.
