import re
from pathlib import Path
from types import SimpleNamespace

import pytest

from services.motion_generator import ACTIONS, ACTORS, ANIMALS, ERA_ONLY, PEOPLE, EFFECTS, PLACES, PROPS, STRUCTURES, SUBJECTS, TIMES, WEATHERS, ArtShot, fix_art_for_era
from services.looks import AVOID_LAST, LOOKS, choose_look, era_look
from services.motion_generator import (FORMAT_NEEDS, FORMAT_RULES, FORMAT_WEIGHTS, FORMATS, SCENE_TYPES, TOPIC_HINTS, CaptionWord, MotionProject, MotionSceneModel, add_vote_items,
                                       fix_duplicate_accents, looks_english, make_validator, retention_problems, vote_options)
from services.motion_pipeline import MIN_VIDEO_SECONDS, MUSIC_BY_FORMAT, RISER_TYPES, VOICE_BY_FORMAT, WHOOSHES, music_bed, narrator_voice, rehook_index, scene_audio_info, sound_cues
from services.series import SERIES, apply_series, joined_hashtag, next_number

LOOKS_TS = Path(__file__).resolve().parent.parent / "remotion_studio" / "src" / "chronicle" / "looks.ts"

# ------------------------------------------------------------------------------------------------------------------------------------ builders
NARR = "And that one choice quietly changed the whole story for everyone who lived through it."
LOOP = "Stay to the end, the catch comes last, because nobody expected this part of the story."
VOTE = "So was it betrayal or bad luck?"


_SHOT = iter(range(10**6))


def next_shot():
    """A different illustration shot every call (a video may not repeat one)."""
    i = next(_SHOT)
    other = SUBJECTS[(i * 7 + 11) % len(SUBJECTS)]
    # a protagonist on the stage in every shot, doing something different each time, with a different second subject
    return ArtShot(place=PLACES[i % len(PLACES)], time=TIMES[(i // 3) % 4], subjects=["legionary", other] if other != "legionary" else ["legionary"], action=ACTIONS[i % len(ACTIONS)])


def sc(kind, **kw):
    base = dict(narration=NARR, durationInFrames=90, art=None if kind in ("flash", "map", "outro") else [next_shot()])
    extra = {
        "statement": dict(text="Rome fell quietly", accentText="Nobody noticed"),
        "date": dict(text="476", value=476, unit="AD", kicker="Rome, Italy", accentText="The last emperor falls"),
        "timeline": dict(text="The long fall", items=["410|Rome is sacked", "455|Sacked again", "476|Last emperor falls"]),
        "map": dict(text="The route", items=["Rome|41.9|12.5", "Carthage|36.85|10.3", "Alexandria|31.2|29.9"], accentText="Three cities, one road"),
        "quote": dict(text="The fall of Rome is the greatest scene in history", accentText="Edward Gibbon", narration="Edward Gibbon wrote that the fall of Rome was the greatest scene in history."),
        "ledger": dict(text="Years the empire lasted", value=500, unit="years", narration="It lasted five hundred years, and nobody planned for the end of it."),
        "versus": dict(text="Soldiers", left="Rome", right="Carthage", leftValue=450000, rightValue=120000, unit="soldiers", narration="Rome fielded four hundred thousand soldiers against a much smaller army."),
        "list": dict(text="Why it fell", items=["Civil wars", "Broken economy", "Border pressure"]),
        "verdict": dict(text="Rome fell in one day", verdict="myth", accentText="It took centuries"),
        "flash": dict(text="Gone", narration="Gone, and almost nobody noticed."),
        "outro": dict(text="x", accentText="y", narration=VOTE),
        "chapter": dict(text="The end", value=3, accentText="Begins"),
    }[kind]
    return MotionSceneModel(type=kind, **{**base, **extra, **kw})


HOOK = "Rome's last emperor was a teenager, and nobody noticed he was gone."
SHAPES = {  # one valid run of scene types per format
    "mystery": ["statement", "date", "statement", "timeline", "list", "statement", "ledger", "statement", "list", "statement", "date", "statement", "list", "outro"],
    "dayinlife": ["statement", "date", "statement", "timeline", "statement", "list", "statement", "ledger", "statement", "list", "statement", "list", "statement", "outro"],
    "turning": ["statement", "date", "statement", "list", "statement", "timeline", "statement", "ledger", "statement", "list", "statement", "list", "statement", "outro"],
    "lies": ["statement", "verdict", "date", "verdict", "ledger", "verdict", "list", "verdict", "statement", "list", "verdict", "statement", "list", "outro"],
    "whatif": ["statement", "date", "statement", "list", "statement", "map", "statement", "ledger", "statement", "timeline", "statement", "list", "statement", "outro"],
    "duel": ["statement", "date", "statement", "versus", "statement", "versus", "date", "versus", "statement", "versus", "statement", "outro"],
    "journey": ["statement", "date", "map", "statement", "ledger", "statement", "timeline", "statement", "list", "statement", "map", "statement", "ledger", "outro"],
    "portrait": ["statement", "date", "statement", "timeline", "statement", "date", "statement", "ledger", "statement", "date", "statement", "list", "statement", "outro"],
}


def script(fmt, shape=None, **over):
    kinds = shape or SHAPES[fmt]
    scenes = []
    verdicts = iter(["myth", "fact", "partly", "myth", "myth"])
    for i, k in enumerate(kinds):
        kw = {}
        if i == 0:
            kw["narration"] = ("What if " + HOOK.lower()) if fmt == "whatif" else HOOK
        elif i == 2:
            kw["narration"] = LOOP
        elif k == "verdict":
            kw["verdict"] = next(verdicts)
        if fmt == "whatif" and k == "statement" and i == 4:
            kw["narration"] = "Historians think the empire might have lasted a little longer, though nobody can know."
        scenes.append(sc(k, **kw))
    if fmt == "dayinlife":
        scenes[3] = sc("timeline", items=["5 AM|Wake before dawn", "7 AM|Knead the dough", "12 PM|Sell at the market", "6 PM|Count the coins"])
    data = dict(topic="Rome", screen_title="The fall", title="How Rome fell #history #rome", description="One. Two.", tags=["history"] * 6, pinned_comment="Betrayal or bad luck? Reply with one word.", scenes=scenes, format=fmt)
    data.update(over)
    return MotionProject(**data)


# ------------------------------------------------------------------------------------------------------------------------------------ the eight formats
def test_there_are_eight_history_formats_and_each_is_fully_registered():
    assert len(FORMATS) == 8 and set(FORMATS) == {"mystery", "dayinlife", "turning", "lies", "whatif", "duel", "journey", "portrait"}
    for f in FORMATS:
        assert f in FORMAT_RULES and f in TOPIC_HINTS and f in FORMAT_NEEDS and f in FORMAT_WEIGHTS and f in SERIES and f in VOICE_BY_FORMAT and f in MUSIC_BY_FORMAT
    assert set(SHAPES) == set(FORMATS)


def test_no_scene_type_of_the_old_tech_channel_is_left():
    assert set(SCENE_TYPES) <= {"statement", "chapter", "date", "timeline", "map", "quote", "ledger", "versus", "list", "verdict", "flash", "outro"}
    assert not any(w in " ".join(FORMAT_RULES.values()).lower() for w in ("gpu", "ssd", "benchmark", "silicon verdict"))


@pytest.mark.parametrize("fmt", FORMATS)
def test_a_well_formed_script_of_every_format_passes_the_validator(fmt):
    assert make_validator(None, fmt, retention=True)(script(fmt)) == []


def test_mystery_needs_a_date():
    shape = ["statement", "timeline", "statement", "list", "statement", "ledger", "statement", "list", "statement", "list", "statement", "list", "statement", "outro"]
    assert any("date" in p for p in make_validator(None, "mystery")(script("mystery", shape)))


def test_dayinlife_needs_exactly_one_timeline_with_the_hours():
    two = list(SHAPES["dayinlife"])
    two[6] = "timeline"
    assert any("ONE timeline" in p for p in make_validator(None, "dayinlife")(script("dayinlife", two)))
    p = script("dayinlife")
    p.scenes[3].items = ["5 AM|Wake before dawn", "7 AM|Knead the dough", "12 PM|Sell at the market"]
    assert any("4-5 hours" in x for x in make_validator(None, "dayinlife")(p))


def test_lies_needs_four_to_six_verdicts_mostly_myths_with_at_least_one_fact():
    p = script("lies")
    for s in p.scenes:
        if s.type == "verdict":
            s.verdict = "myth"
    assert any("fact" in x for x in make_validator(None, "lies")(p))
    few = script("lies", ["statement", "verdict", "date", "verdict", "ledger", "list", "statement", "list", "statement", "list", "statement", "list", "statement", "outro"])
    assert any("4-6 verdict" in x for x in make_validator(None, "lies")(few))


def test_whatif_starts_with_what_if_and_hedges_the_consequences():
    p = script("whatif")
    p.scenes[0].narration = HOOK
    assert any("What if" in x for x in make_validator(None, "whatif")(p))
    q = script("whatif")
    q.scenes[4].narration = NARR
    assert any("hedged" in x for x in make_validator(None, "whatif")(q))


def test_duel_needs_three_to_five_rounds_with_the_same_two_names():
    p = script("duel")
    p.scenes[5].left = "Athens"
    assert any("same" in x for x in make_validator(None, "duel")(p))
    two = script("duel", ["statement", "date", "statement", "versus", "statement", "versus", "statement", "date", "statement", "list", "statement", "outro"])
    assert any("3-5 versus" in x for x in make_validator(None, "duel")(two))


def test_journey_needs_a_map_with_three_places():
    p = script("journey")
    for s in p.scenes:
        if s.type == "map":
            s.items = s.items[:2]
    assert any("at least 3 places" in x for x in make_validator(None, "journey")(p))


def test_portrait_needs_two_dates_a_timeline_and_at_most_one_quote():
    shape = ["statement", "date", "statement", "timeline", "statement", "list", "statement", "ledger", "statement", "list", "statement", "list", "statement", "outro"]
    assert any("two `date`" in x for x in make_validator(None, "portrait")(script("portrait", shape)))


# ------------------------------------------------------------------------------------------------------------------------------------ scene rules
def problems_of(p, fmt=None):
    return make_validator(None, fmt)(p)


def test_a_date_scene_needs_a_year_a_place_and_an_event():
    p = script("turning")
    p.scenes[1].kicker = None
    assert any("kicker" in x for x in problems_of(p))
    p = script("turning")
    p.scenes[1].value, p.scenes[1].unit = 476, None
    assert any("AD or BC" in x for x in problems_of(p))


def test_timeline_years_must_be_in_order_and_short():
    p = script("turning")
    p.scenes[5].items = ["476|Last emperor falls", "455|Sacked again", "410|Rome is sacked"]
    assert any("chronological" in x for x in problems_of(p))


def test_map_places_need_coordinates_in_range_and_no_duplicates():
    p = script("journey")
    p.scenes[2].items = ["Town A|50|50", "Town B|140|80", "Town C|20|90"]
    assert any("latitude must be between" in x for x in problems_of(p))
    p.scenes[2].items = ["Town A|50.5|9.5", "Town B|50.5|9.5", "Town C|20.5|9.5"]
    assert any("same spot" in x for x in problems_of(p))


def test_ledger_figures_are_whole_numbers_that_are_said_aloud():
    p = script("mystery")
    s = next(x for x in p.scenes if x.type == "ledger")
    s.value = 499.6
    assert make_validator()(p) is not None and s.value == 500.0  # repaired to a whole number
    s.narration = "It lasted a very long time, and nobody planned for the end."
    assert any("must be said" in x for x in problems_of(p))


def test_a_quote_needs_its_author_in_the_narration():
    p = script("portrait")
    q = sc("quote", narration=NARR)
    p.scenes[4] = q
    assert any("who said it" in x for x in problems_of(p))


def test_statements_need_an_accent():
    p = script("turning")
    p.scenes[0].accentText = None
    assert any("accentText" in x for x in problems_of(p))


def test_the_first_scene_is_a_statement_and_the_last_an_outro_and_types_do_not_repeat():
    p = script("turning")
    p.scenes[0] = sc("date", narration=HOOK)
    assert any("first scene must be a statement" in x for x in problems_of(p))
    p = script("turning")
    p.scenes[4] = sc("list")
    assert any("same type" in x for x in problems_of(p))


# ------------------------------------------------------------------------------------------------------------------------------------ retention, vote, accents
def test_retention_rejects_a_greeting_hook_a_long_hook_and_a_missing_open_loop():
    p = script("turning")
    p.scenes[0].narration = "So today we are going to talk about Rome."
    assert any("cold open" in x for x in retention_problems(p))
    p = script("turning")
    p.scenes[0].narration = "Rome's last emperor was a teenager and absolutely nobody in the whole empire noticed that he was gone."
    assert any("cold open is at most 14" in x for x in retention_problems(p))
    p = script("turning")
    p.scenes[2].narration = NARR
    assert any("open loop" in x for x in retention_problems(p))


def test_retention_rejects_three_statements_in_a_row_and_a_generic_vote():
    p = script("turning", ["statement", "date", "statement", "statement", "statement", "list", "statement", "list", "statement", "ledger", "statement", "list", "statement", "outro"])
    assert any("three statement scenes" in x for x in retention_problems(p))
    p = script("turning")
    p.scenes[-1].narration = "So what do you think about all of it, tell me below?"
    assert any("two-option vote" in x or "generic" in x for x in retention_problems(p))


def test_vote_options_come_from_the_pinned_comment():
    assert vote_options("Rome or Carthage? Reply with one word.") == ["Rome", "Carthage"]
    assert vote_options("Reply HERO or VILLAIN.") == ["Hero", "Villain"]
    assert vote_options("Team Rome or team Carthage?") == ["Rome", "Carthage"]
    assert vote_options("What did you think of the video today?") is None


def test_the_vote_outro_asks_for_the_verdict_and_ends_on_the_question():
    p = script("turning")
    p.scenes[-1].narration = "That is the story. Follow for more. So was it betrayal or bad luck?"
    add_vote_items(p)
    out = p.scenes[-1]
    assert out.items == ["Betrayal", "Bad luck"] and out.text == "Your verdict?" and "Follow" not in out.narration and out.narration.endswith("?")


def test_an_accent_that_repeats_the_headline_is_taken_out_of_the_headline():
    s = sc("statement", text="Rome never fell fast", accentText="fell fast")
    fix_duplicate_accents([s])
    assert s.text == "Rome never"


# ------------------------------------------------------------------------------------------------------------------------------------ series, sound, voice, looks, props
def test_series_prefixes_title_kicker_tags_and_description_and_is_idempotent():
    p = script("turning")
    label = apply_series(p, number=7)
    assert label == "Turning Point #7" and " | Turning Point #7" in p.title and not p.title.startswith("Turning Point") and p.scenes[0].kicker == "turning point #7"
    assert "turningpoint" in p.tags and "Part of the Turning Point series" in p.description
    assert apply_series(p, number=8) is None  # already carries it
    long = script("lies", title="History Lies: " + "x" * 80)
    assert apply_series(long, number=1) is None


def test_the_narrator_rotates_by_format_and_can_be_turned_off(monkeypatch):
    from config.settings import settings
    monkeypatch.setattr(settings, "ELEVENLABS_VOICE_1", "v1")
    monkeypatch.setattr(settings, "ELEVENLABS_VOICE_2", "v2")
    monkeypatch.setattr(settings, "ELEVENLABS_VOICE_3", "v3")
    monkeypatch.setattr(settings, "MOTION_VOICE_ROTATION", True)
    voices = {narrator_voice(SimpleNamespace(format=f)) for f in FORMATS}
    assert voices <= {"v1", "v2", "v3"} and len(voices) >= 2
    monkeypatch.setattr(settings, "MOTION_VOICE_ROTATION", False)
    assert {narrator_voice(SimpleNamespace(format=f)) for f in FORMATS} == {"v3"}


def test_every_music_bed_exists_and_is_stable_per_topic():
    audio = Path(__file__).resolve().parent.parent / "assets" / "audio"
    for beds in MUSIC_BY_FORMAT.values():
        assert all((audio / b).is_file() for b in beds)
    assert all((audio / w).is_file() for w in WHOOSHES)
    assert music_bed("mystery", "Roanoke") == music_bed("mystery", "Roanoke")
    assert music_bed("duel", "x") in MUSIC_BY_FORMAT["duel"]


def test_sound_cues_have_a_hit_first_risers_before_reveals_and_a_stamp_for_a_verdict():
    kinds = ["statement", "date", "ledger", "verdict", "outro"]
    starts = [0, 90, 180, 270, 360]
    info = scene_audio_info([SimpleNamespace(durationInFrames=90, verdict=v, callout=None, calloutCue=None) for v in (None, None, None, "myth", None)])
    files = [c[0] for c in sound_cues(starts, kinds, info)]
    assert files[0] == "sfx_hit.wav" and "sfx_riser.wav" in files and "sfx_error.wav" in files and files.count("sfx_chime.wav") == 1


def test_to_props_carries_the_look_captions_and_series_but_no_theme():
    p = script("turning")
    p.look = "antiquity"
    p.captions = [CaptionWord(w="Rome", s=0, e=9)]
    props = p.to_props()
    assert props["look"] == "antiquity" and props["captions"][0]["w"] == "Rome" and "theme" not in props and len(props["scenes"]) == 14


def test_the_python_and_the_remotion_looks_agree():
    ts_names = re.findall(r"^  (\w+): \{ name: '(\w+)'", LOOKS_TS.read_text(encoding="utf-8"), re.M)
    assert {k for k, _ in ts_names} == set(LOOKS) and all(k == n for k, n in ts_names) and len(LOOKS) == 11


def test_the_topic_picks_its_era_and_other_topics_rotate():
    assert era_look("How Rome fell") == "antiquity" and era_look("The Black Death") == "manuscript" and era_look("Pirates of the Caribbean") == "seachart"
    assert era_look("D-Day") == "wartime" and era_look("Louis XIV") == "empire" and era_look("Titanic") == "industrial" and era_look("Something odd") is None
    seen = []
    for i in range(24):
        look = choose_look(None, f"topic {i}", recent=seen)
        assert look not in seen[:AVOID_LAST]
        seen.insert(0, look)
    assert len(set(seen)) >= 4


def test_english_passes_and_spanish_is_rejected():
    assert looks_english("Rome fell slowly over three hundred years and almost nobody alive noticed it.")
    assert not looks_english("Roma cayó lentamente durante trescientos años y casi nadie lo notó.")
    assert not looks_english("¿Qué es esto?")


# ------------------------------------------------------------------------------------------------------------------------------------ pipeline infrastructure kept from the first engine


def test_series_number_counts_different_topics_of_the_format(tmp_db):
    from services.history import record_short_history
    assert next_number("fix") == 1
    for topic in ("a", "a", "b"):  # a repeated topic (re-rendered) is one video of the series
        record_short_history(0, "motion_graphics", "t", "none", topic=topic, title=topic, video_id="x", category="MOTION GRAPHICS FIX")
    record_short_history(0, "motion_graphics", "t", "none", topic="c", title="c", video_id="x", category="MOTION GRAPHICS DECODE")
    assert next_number("fix") == 3 and next_number("decode") == 2


def test_every_series_has_a_one_word_hashtag():
    for name, tag in SERIES.values():
        assert tag.isalnum() and tag == tag.lower() and name


def test_hashtags_are_joined_words():
    assert joined_hashtag("tech explained") == "#techexplained" and joined_hashtag("#3D V-Cache") == "#3DVCache"


def test_sound_cues_cap_the_risers():
    kinds = ["bigText"] + ["verdict"] * 9 + ["outro"]
    cues = sound_cues([i * 100 for i in range(len(kinds))], kinds)
    assert sum(1 for c in cues if c[2] == "riser") == 4 and "verdict" in RISER_TYPES


def test_the_mix_has_music_effects_and_voice_without_clipping(tmp_path):
    import subprocess

    from services.motion_pipeline import add_sound
    from services.voice import get_ffmpeg_bin

    ff = get_ffmpeg_bin()
    raw = tmp_path / "raw.mp4"
    subprocess.run([ff, "-y", "-f", "lavfi", "-i", "color=c=black:s=320x568:d=6:r=30", "-pix_fmt", "yuv420p", str(raw)], check=True, capture_output=True)
    voice = tmp_path / "v.mp3"
    subprocess.run([ff, "-y", "-f", "lavfi", "-i", "sine=frequency=220:duration=2", str(voice)], check=True, capture_output=True)
    sc = [SimpleNamespace(cursor=c, durationInFrames=90, cursorCue=None, verdict=v) for c, v in ((None, None), ("select", None))]
    out = add_sound(raw, tmp_path / "out.mp4", [0, 90], [(0, voice, 2.0)], lead=0.0, kinds=["bigText", "textWithAccent"], music_file="bed_chill.mp3", info=scene_audio_info(sc))
    log = subprocess.run([ff, "-hide_banner", "-i", str(out), "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
    assert "Audio:" in log and float(log.split("max_volume:")[1].split("dB")[0]) < -0.5


def test_the_rehook_scene_is_near_the_middle_and_short_videos_have_none():
    starts = [i * 100 for i in range(12)]
    assert rehook_index(starts, [100] * 12) == 6
    assert rehook_index([0, 100, 200, 300], [100] * 4) == -1
    assert 2 <= rehook_index(starts, [100] * 12) <= 9


def test_sound_gets_a_boom_at_the_rehook_scene():
    kinds = ["bigText"] * 12
    starts = [i * 100 for i in range(12)]
    info = [{"cursor": None, "dur": 100} for _ in range(12)]
    cues = sound_cues(starts, kinds, info)
    assert ("sfx_boom.wav", 600 / 30, "rehook") in cues


def test_scenes_of_17_words_still_reach_the_monetisation_floor():
    # 13 scenes x 12-17 words keeps the narration between 150 and 190 words: more than 60 seconds at the natural pace
    words = 13 * 14
    assert 150 <= words <= 190 and words / 2.5 + 13 * 0.3 > MIN_VIDEO_SECONDS - 1


def test_a_busy_mix_is_brought_under_the_peak_limit(tmp_path):
    import subprocess

    from services.motion_pipeline import PEAK_CEILING_DB, _peak_db, add_sound
    from services.voice import get_ffmpeg_bin

    ff = get_ffmpeg_bin()
    raw = tmp_path / "raw.mp4"
    subprocess.run([ff, "-y", "-f", "lavfi", "-i", "color=c=black:s=320x568:d=14:r=30", "-pix_fmt", "yuv420p", str(raw)], check=True, capture_output=True)
    n = 12
    starts = [i * 35 for i in range(n)]  # a cue on almost every beat: the loudest case
    kinds = ["verdict", "counter", "flash", "versus", "counter", "verdict", "ui", "counter", "flash", "versus", "verdict", "outro"]
    info = [{"cursor": "click" if k == "ui" else None, "dur": 35, "cue": None, "verdict": "myth", "callout_at": 0.2} for k in kinds]
    out = add_sound(raw, tmp_path / "out.mp4", starts, None, kinds=kinds, music_file="bed_drive.mp3", info=info)  # unvoiced: effects at their loudest
    assert _peak_db(out) <= PEAK_CEILING_DB + 0.3


def test_analytics_refuses_a_token_without_the_scopes_and_says_how_to_get_them(tmp_path, monkeypatch):
    import json

    from config.settings import settings
    from services import yt_analytics as ya

    token = tmp_path / "token.json"
    token.write_text(json.dumps({"token": "x", "refresh_token": "y", "client_id": "c", "client_secret": "s", "token_uri": "https://oauth2.googleapis.com/token", "scopes": ["https://www.googleapis.com/auth/youtube.upload"]}))
    monkeypatch.setattr(settings, "YOUTUBE_TOKEN_PATH", str(token))
    try:
        ya._creds()
        raise AssertionError("a token with only the upload scope must be refused")
    except ya.AnalyticsUnavailable as exc:
        assert "yt-analytics.readonly" in str(exc) and "authenticate_yt.py" in str(exc)


def test_retention_reads_the_curve_at_a_point_of_the_video():
    from services.yt_analytics import retention_at

    curve = [1.0 - i / 100 for i in range(101)]
    assert retention_at(curve, 0.2) == curve[20] and retention_at(curve, 0.8) == curve[80] and retention_at([], 0.5) is None


def test_generic_closing_vote_is_rejected_by_the_style_check():
    from services.motion_generator import GENERIC_CLOSER, BAD_OPENER
    assert GENERIC_CLOSER.search("Did that surprise you, or did you know it? Tell me below, and follow for more.")
    assert not GENERIC_CLOSER.search("Follow for more tech. Team DDR4 or team DDR5?")
    assert BAD_OPENER.search("Let us test five beliefs.") and not BAD_OPENER.search("Five beliefs, one is wrong.")


# ------------------------------------------------------------------------------------------------------------------------------------ illustrations
def test_the_python_art_vocabulary_matches_the_remotion_one():
    ts = (Path(__file__).resolve().parent.parent / "remotion_studio" / "src" / "chronicle" / "art" / "vocab.ts").read_text(encoding="utf-8")
    for name, values in (("PLACES", PLACES), ("TIMES", TIMES), ("WEATHERS", WEATHERS), ("STRUCTURES", STRUCTURES), ("ACTORS", ACTORS), ("PEOPLE", PEOPLE), ("ANIMALS", ANIMALS), ("PROPS", PROPS), ("EFFECTS", EFFECTS)):
        m = re.search(rf"export const {name} = \[(.*?)\] as const", ts, re.S)
        assert m and tuple(re.findall(r"'(\w+)'", m.group(1))) == values, name
    assert len(PEOPLE) == 127 and len(ANIMALS) == 25 and len(STRUCTURES) == 71
    assert len(SUBJECTS) == len(set(SUBJECTS)) == 258
    m = re.search(r"export const ACTIONS = \[(.*?)\] as const", ts, re.S)
    assert m and tuple(re.findall(r"'(\w+)'", m.group(1))) == ACTIONS
    from services.motion_generator import CAMERAS
    m = re.search(r"export const CAMERAS = \[(.*?)\] as const", ts, re.S)
    assert m and tuple(re.findall(r"'(\w+)'", m.group(1))) == CAMERAS
    assert len(ACTIONS) == 37


def test_every_subject_has_a_drawing_and_every_era_entry_names_a_real_subject():
    root = Path(__file__).resolve().parent.parent / "remotion_studio" / "src" / "chronicle" / "art"
    costumes = (root / "costumes.tsx").read_text(encoding="utf-8")
    structures = (root / "structures2.tsx").read_text(encoding="utf-8") + (root / "structures3.tsx").read_text(encoding="utf-8")
    animals = (root / "animals.tsx").read_text(encoding="utf-8")
    for who in PEOPLE:
        assert re.search(rf"^  {who}: \(", costumes, re.M), who
    for s in STRUCTURES[11:] + ACTORS[16:]:
        assert re.search(rf"\b{s}: ", structures), s
    for a in ANIMALS:
        assert re.search(rf"\b{a}: ", animals), a
    for name, looks in ERA_ONLY.items():
        assert name in SUBJECTS and looks <= set(LOOKS), name


def test_characters_structures_and_animals_of_the_wrong_era_are_dropped():
    class P:  # the bare minimum fix_art_for_era reads
        look = "antiquity"
        scenes: list = []
    p = P()
    class Sh:  # a minimal stand-in for a shot
        def __init__(self, subjects):
            self.subjects = subjects
    class Sc:
        def __init__(self, shots):
            self.art = shots
    sh = Sh(["samurai", "legionary", "skyscraper", "colosseum", "wolf", "plague_doctor"])
    p.scenes = [Sc([sh])]
    fix_art_for_era(p)
    assert sh.subjects == ["legionary", "colosseum", "wolf"]
    only = Sh(["astronaut"])
    p.scenes = [Sc([only])]
    fix_art_for_era(p)
    assert only.subjects == ["crowd"]


def test_the_new_eras_pick_their_topics_and_draw_only_what_belongs():
    from services.motion_generator import era_allows
    assert era_look("The woolly mammoth hunters") == "prehistory" and era_look("Leonardo da Vinci") == "renaissance" and era_look("The last samurai") == "orient"
    assert era_look("Billy the Kid and the Wild West") == "frontier" and era_look("The Apollo 11 moon landing") == "spaceage" and era_look("The Cuban Missile Crisis") == "spaceage"
    assert era_allows("mammoth", "prehistory") and era_allows("fire", "prehistory") and not era_allows("king", "prehistory") and not era_allows("castle", "prehistory")
    assert era_allows("samurai", "orient") and era_allows("pagoda", "orient") and not era_allows("knight", "orient") and not era_allows("cathedral", "orient")
    assert era_allows("saloon", "frontier") and era_allows("cowboy", "frontier") and not era_allows("samurai", "frontier") and not era_allows("pharaoh", "frontier")
    assert era_allows("lander", "spaceage") and era_allows("astronaut", "spaceage") and not era_allows("knight", "spaceage") and not era_allows("cavalry", "spaceage")
    assert era_allows("duomo", "renaissance") and era_allows("conquistador", "renaissance") and not era_allows("tank", "renaissance")


def test_the_pictures_must_tell_the_story_through_its_people():
    from services.motion_generator import story_problems
    good = script("turning")
    assert story_problems(good) == []
    for s in good.scenes:
        for sh in s.art or []:
            sh.subjects, sh.action = ["castle", "windmill"], None
    msgs = " ".join(story_problems(good))
    assert "show a person" in msgs and "protagonist" in msgs
    some = script("turning")
    for s in some.scenes:
        for sh in s.art or []:
            sh.action = "run"
    assert any("four different" in m for m in story_problems(some))


def test_an_unknown_subject_is_reported_and_the_schema_has_no_huge_enum():
    import json
    from services.motion_generator import MotionProject
    schema = json.dumps(MotionProject.model_json_schema())
    assert '"samurai"' not in schema.split('"subjects"')[1][:600]  # subjects are plain strings: a 258-value enum is refused by Gemini
    p = script("turning")
    p.scenes[1].art[0].subjects = ["legionary", "unicorn"]
    assert any("unknown subject" in x for x in make_validator(None, "turning")(p))


def test_a_shot_can_carry_an_action_and_a_view_but_only_from_the_lists():
    shot = ArtShot(place="plains", time="day", subjects=["soldiers", "banner"], action="surrender", view="back")
    assert shot.action == "surrender" and shot.view == "back"
    assert ArtShot(place="plains", time="day", subjects=["soldiers"]).action is None
    import pytest
    with pytest.raises(Exception):
        ArtShot(place="plains", time="day", subjects=["soldiers"], action="moonwalk")
    with pytest.raises(Exception):
        ArtShot(place="plains", time="day", subjects=["soldiers"], view="up")


def test_every_scene_but_flash_map_and_outro_needs_illustration_shots():
    p = script("turning")
    p.scenes[3].art = None
    assert any("needs `art`" in x for x in problems_of(p))
    p = script("journey")  # map and outro have none and pass
    assert problems_of(p, "journey") == [] or all("art" not in x for x in problems_of(p, "journey"))


def test_a_shot_is_limited_and_never_repeated():
    p = script("turning")
    p.scenes[3].art = [p.scenes[2].art[0]]
    assert any("repeated" in x for x in problems_of(p))
    p = script("turning")
    p.scenes[3].art = [next_shot(), next_shot(), next_shot()]
    assert not any("art" in x for x in problems_of(p)) and len(p.scenes[3].art) == 2  # a third shot is trimmed, not rejected


def test_anachronistic_subjects_are_removed_for_the_era():
    p = script("turning")
    p.look = "antiquity"
    for other in p.scenes[1:]:
        other.art = None
    p.scenes[0].art = [ArtShot(place="plains", time="day", subjects=["tank", "soldiers", "castle"]), ArtShot(place="city", time="night", subjects=["plane"])]
    assert fix_art_for_era(p) == 3
    assert p.scenes[0].art[0].subjects == ["soldiers"] and p.scenes[0].art[1].subjects == ["crowd"]
    p.look = "wartime"
    p.scenes[0].art = [ArtShot(place="battlefield", time="dusk", subjects=["tank", "plane"])]
    assert fix_art_for_era(p) == 0


def test_the_art_travels_to_the_renderer_in_the_props():
    props = script("turning").to_props()
    assert props["scenes"][0]["art"][0]["subjects"] and "place" in props["scenes"][0]["art"][0]


# ------------------------------------------------------------------------------------------------------------------------------------ the one-minute rule
def test_the_one_minute_rule_is_one_constant_used_by_every_stage():
    from services import motion_generator, motion_pipeline
    assert motion_generator.FLOOR_SECONDS > 60 and motion_pipeline.FLOOR_SECONDS == motion_generator.FLOOR_SECONDS
    assert motion_pipeline.MIN_VIDEO_SECONDS >= motion_generator.FLOOR_SECONDS and motion_generator.MIN_SECONDS >= motion_generator.FLOOR_SECONDS


def test_a_script_shorter_than_a_minute_is_rejected_and_the_final_qa_rejects_a_short_video(tmp_path):
    import shutil
    import subprocess
    from services.motion_pipeline import qa_motion
    short = script("turning")
    for s in short.scenes:
        s.narration = "Short."
        s.durationInFrames = 60
    assert any("it must come to" in x for x in make_validator(None, "turning")(short))
    ff = shutil.which("ffmpeg")
    if ff:  # a 30 s clip must fail the duration check
        out = tmp_path / "short.mp4"
        subprocess.run([ff, "-y", "-f", "lavfi", "-i", "color=c=black:s=1080x1920:d=30", "-f", "lavfi", "-i", "sine=d=30", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", str(out)], check=True, capture_output=True)
        assert any("duration" in f for f in qa_motion(out))


# ------------------------------------------------------------------------------------------------------------------------------------ real maps
def test_the_gazetteer_snaps_known_places_and_leaves_unknown_ones():
    from services.gazetteer import fix_map_places, lookup
    p = script("journey")
    m = next(s for s in p.scenes if s.type == "map")
    m.items = ["Rome|50.0|60.0", "Carthago Nova|37.6|-0.98", "Lisbon|38.7|-9.1"]  # Rome is far off, Lisbon right, the third unknown to the table
    assert fix_map_places(p) == 1
    assert m.items[0].startswith("Rome|41.9") and m.items[1].endswith("-0.98") and m.items[2] == "Lisbon|38.7|-9.1"
    assert lookup("Saint Joseph") == lookup("St. Joseph") and lookup("Constantinople") == lookup("Istanbul") and lookup("Nowhereville") is None


def test_map_items_must_be_real_coordinates_not_schematic_x_y():
    from services.motion_generator import _map_problems
    p = script("journey")
    m = next(s for s in p.scenes if s.type == "map")
    m.items = ["Rome|41.9|12.5", "Carthage|36.85|10.3", "Alexandria|31.2|29.9"]
    assert _map_problems(1, m) == []
    m.items = ["Rome|52|55", "Constantinople|82|35", "Carthage|40|78"]
    assert any("schematic" in x for x in _map_problems(1, m))
    m.items = ["Rome|141.9|12.5", "Carthage|36.85|10.3"]
    assert any("latitude" in x for x in _map_problems(1, m))
    m.items = ["Rome|a|b", "Carthage|36.85|10.3"]
    assert any("decimal" in x for x in _map_problems(1, m))


def test_the_land_data_of_the_real_maps_is_there_and_the_sample_uses_real_coordinates():
    import json
    root = Path(__file__).resolve().parent.parent / "remotion_studio" / "src" / "chronicle"
    land = json.loads((root / "geo" / "land.json").read_text(encoding="utf-8"))
    assert len(land) > 300 and all(len(r["p"]) % 2 == 0 for r in land)
    xs = [v for r in land for v in r["p"][0::2]]
    ys = [v for r in land for v in r["p"][1::2]]
    assert -180 <= min(xs) and max(xs) <= 180 and -90 <= min(ys) and max(ys) <= 84
    sample = json.loads((root / "sample.json").read_text(encoding="utf-8"))
    for s in sample["scenes"]:
        if s["type"] == "map":
            assert all(-90 <= float(i.split("|")[1]) <= 90 and abs(float(i.split("|")[2])) <= 180 for i in s["items"])
