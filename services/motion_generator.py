"""Motion Graphics histories for The Chronicles of History: vertical 1080x1920, over 60 s and at most 3 minutes (YouTube monetisation needs MORE than 60 s), always English.

A model writes the scene list as structured JSON; this module validates and repairs it (language, lengths, scene rules, format rules, retention rules, duration), has a second pass
fact-check it, and hands the result to the MotionGraphic Remotion composition (remotion_studio/src/chronicle/).

Eight content formats (FORMATS) decide the structure of a video; guide/formats.md describes them.
"""
import logging
import re
import time
from typing import Any, Callable, Dict, List, Literal, Optional

from pydantic import BaseModel, Field

from config.settings import settings as _settings
from services.gemini_client import GeminiUnavailable, generate_structured

STRONG_REVIEWERS = ["@cf/openai/gpt-oss-120b"]  # history claims are checked first by the strongest reviewer; if it is unavailable a panel of the others takes over

logger = logging.getLogger(__name__)

FPS = 30
MIN_SECONDS, MAX_SECONDS = 62.0, _settings.MAX_VIDEO_SECONDS  # final video: > 60 s for monetisation, never more than the 3-minute ceiling (the script itself aims for 65-80 s)
MIN_FRAMES, MAX_FRAMES = int(MIN_SECONDS * FPS), int(MAX_SECONDS * FPS)
WORDS_PER_SECOND = 2.5  # natural narration pace used to estimate the final length

SceneType = Literal["statement", "chapter", "date", "timeline", "map", "quote", "ledger", "versus", "list", "verdict", "image", "flash", "outro"]
SCENE_TYPES = ("statement", "chapter", "date", "timeline", "map", "quote", "ledger", "versus", "list", "verdict", "flash", "outro")  # `image` exists in the renderer but needs artwork the pipeline does not fetch yet
# The vocabulary of the vector illustrations (remotion_studio/src/chronicle/art/vocab.ts; a test keeps both lists identical)
PLACES = ("desert", "sea", "coast", "plains", "mountains", "forest", "snow", "city", "plaza", "interior", "battlefield")
TIMES = ("dawn", "day", "dusk", "night")
WEATHERS = ("clear", "rain", "snow", "storm", "smoke")
STRUCTURES = ("castle", "temple", "pyramids", "tower", "gate", "windmill", "factory", "lighthouse", "tents", "bridge", "ruins", "ziggurat", "colosseum", "aqueduct", "obelisk", "sphinx", "great_wall", "triumphal_arch", "stonehenge", "hut", "palisade", "harbor", "market", "well", "library", "theater", "adobe", "tomb", "palace", "cathedral", "church", "mosque", "pagoda", "monastery", "longhouse", "fortress", "siege_tower", "catapult", "trebuchet", "forge", "tavern", "village", "tipi", "yurt", "igloo", "torii", "japanese_castle", "star_fort", "observatory", "printing_press", "gallows", "guillotine", "clocktower", "mine", "skyscraper", "derrick", "barn", "telegraph", "bunker", "radiotower", "rocket", "cave", "menhir", "duomo", "pavilion", "dojo", "saloon", "general_store", "water_tower", "radar_dish", "cooling_tower")
ACTORS = ("soldiers", "cavalry", "king", "crowd", "caravan", "scholar", "monk", "farmer", "merchant", "ship", "fleet", "galley", "elephants", "train", "tank", "plane", "wagon", "junk", "lander", "satellite")
# A hundred historical characters (costumes of one figure; leaders alone, the rest with two companions) and twenty animals
PEOPLE = ("caveman", "pharaoh", "egyptian_priest", "scribe", "pyramid_builder", "gladiator", "legionary", "centurion", "senator", "roman_emperor", "vestal", "hoplite", "philosopher", "athlete", "persian_immortal", "babylonian", "celt", "carthaginian", "oracle", "druid", "qin_warrior", "knight", "crusader", "templar", "viking", "jarl", "bishop", "pope", "friar", "peasant", "blacksmith", "longbowman", "crossbowman", "castle_guard", "queen", "princess", "jester", "executioner", "alchemist", "plague_doctor", "samurai", "ninja", "shogun", "mongol_horseman", "khan", "saracen", "sultan", "byzantine_emperor", "aztec_warrior", "aztec_priest", "inca_noble", "maya_priest", "silk_trader", "mandarin", "chinese_emperor", "conquistador", "explorer", "navigator", "pirate", "buccaneer", "sailor", "admiral", "native_chief", "missionary", "renaissance_artist", "inventor", "astronomer", "merchant_prince", "musketeer", "redcoat", "grenadier", "minuteman", "general", "nobleman", "revolutionary", "frontiersman", "cowboy", "factory_worker", "miner", "engineer", "gentleman", "lady", "surgeon", "tycoon", "suffragette", "ww1_infantry", "ww1_officer", "ww2_soldier", "paratrooper", "pilot", "nurse", "resistance_fighter", "spy", "codebreaker", "factory_woman", "navy_sailor", "tank_commander", "field_marshal", "refugee", "astronaut", "neanderthal", "shaman", "cave_painter", "mammoth_hunter", "banker", "courtier", "condottiero", "printer", "geisha", "rice_farmer", "tang_scholar", "shaolin_monk", "sheriff", "outlaw", "prospector", "settler", "pioneer_woman", "trapper", "railroad_worker", "native_warrior", "cosmonaut", "scientist", "programmer", "protester", "president", "reporter", "test_pilot")
ANIMALS = ("dog", "wolf", "fox", "lion", "tiger", "bear", "deer", "boar", "pig", "cow", "ox", "sheep", "goat", "donkey", "rat", "eagle", "raven", "snake", "crocodile", "whale", "mammoth", "sabertooth", "bison", "horse", "camel")
PROPS = ("scroll", "crown", "sword", "chest", "torch", "banner", "throne", "map", "cannon")
EFFECTS = ("fire", "smoke", "birds", "comet", "eclipse", "volcano")
SUBJECTS = STRUCTURES + ACTORS + PEOPLE + ANIMALS + PROPS + EFFECTS
# What the people in a shot can be doing (7 everyday + 30 more), and which way they face
ACTIONS = ("stand", "walk", "run", "sit", "point", "wave", "cheer", "kneel", "bow", "pray", "salute", "slash", "stab", "fall", "lie", "crouch", "carry", "push", "dig", "hammer", "write", "read", "think", "shout", "plead", "threaten", "shrug", "lift", "throw", "shoot", "drink", "dance", "sneak", "surrender", "cower", "lean", "watch")
VIEWS = ("front", "side", "back")
HUMANS = ("soldiers", "king", "crowd", "scholar", "monk", "farmer", "merchant") + PEOPLE  # the actors an action applies to
PlaceT = Literal["desert", "sea", "coast", "plains", "mountains", "forest", "snow", "city", "plaza", "interior", "battlefield"]
TimeT = Literal["dawn", "day", "dusk", "night"]
WeatherT = Literal["clear", "rain", "snow", "storm", "smoke"]
ActionT = Literal["stand", "walk", "run", "sit", "point", "wave", "cheer", "kneel", "bow", "pray", "salute", "slash", "stab", "fall", "lie", "crouch", "carry", "push", "dig", "hammer", "write", "read", "think", "shout", "plead", "threaten", "shrug", "lift", "throw", "shoot", "drink", "dance", "sneak", "surrender", "cower", "lean", "watch"]
ViewT = Literal["front", "side", "back"]
# NOT a Literal: a 258-value enum repeated in every shot makes Gemini refuse the schema ("too many states"); the names are checked by _art_problems instead
# Subjects that did not exist in every era: the looks where each may be drawn (an anachronistic one is dropped, see fix_art_for_era)
ERA_ONLY = {
    "tank": {"wartime"}, "plane": {"wartime"}, "train": {"industrial", "wartime"}, "factory": {"industrial", "wartime"},
    "cannon": {"manuscript", "seachart", "empire", "industrial", "wartime"}, "windmill": {"manuscript", "seachart", "empire", "industrial"}, "castle": {"manuscript", "empire", "seachart"},
    "galley": {"antiquity", "manuscript", "seachart"},
}
# Eras of the new subjects (A antiquity, M middle ages, S age of exploration, E age of empires, I industrial, W 20th century): only those NOT drawn in every era are listed
ERA_ONLY.update({
    "caveman": {"antiquity"},
    "pharaoh": {"antiquity"},
    "egyptian_priest": {"antiquity"},
    "scribe": {"antiquity", "manuscript"},
    "pyramid_builder": {"antiquity"},
    "gladiator": {"antiquity"},
    "legionary": {"antiquity"},
    "centurion": {"antiquity"},
    "senator": {"antiquity"},
    "roman_emperor": {"antiquity"},
    "vestal": {"antiquity"},
    "hoplite": {"antiquity"},
    "philosopher": {"antiquity", "manuscript"},
    "athlete": {"antiquity"},
    "persian_immortal": {"antiquity"},
    "babylonian": {"antiquity"},
    "celt": {"antiquity", "manuscript"},
    "carthaginian": {"antiquity"},
    "oracle": {"antiquity"},
    "druid": {"antiquity", "manuscript"},
    "qin_warrior": {"antiquity"},
    "knight": {"manuscript"},
    "crusader": {"manuscript"},
    "templar": {"manuscript"},
    "viking": {"manuscript"},
    "jarl": {"manuscript"},
    "bishop": {"manuscript", "seachart", "empire"},
    "pope": {"manuscript", "seachart", "empire"},
    "friar": {"manuscript", "seachart", "empire"},
    "peasant": {"antiquity", "manuscript", "seachart", "empire", "industrial"},
    "blacksmith": {"antiquity", "manuscript", "seachart", "empire", "industrial"},
    "longbowman": {"manuscript", "seachart"},
    "crossbowman": {"manuscript", "seachart"},
    "castle_guard": {"manuscript", "seachart"},
    "queen": {"manuscript", "seachart", "empire", "industrial"},
    "princess": {"manuscript", "seachart", "empire", "industrial"},
    "jester": {"manuscript", "seachart"},
    "executioner": {"manuscript", "seachart", "empire"},
    "alchemist": {"manuscript", "seachart"},
    "plague_doctor": {"manuscript", "seachart"},
    "samurai": {"manuscript", "seachart", "empire"},
    "ninja": {"manuscript", "seachart"},
    "shogun": {"manuscript", "seachart", "empire"},
    "mongol_horseman": {"manuscript"},
    "khan": {"manuscript"},
    "saracen": {"manuscript"},
    "sultan": {"manuscript", "seachart", "empire"},
    "byzantine_emperor": {"manuscript"},
    "aztec_warrior": {"manuscript", "seachart"},
    "aztec_priest": {"manuscript", "seachart"},
    "inca_noble": {"manuscript", "seachart"},
    "maya_priest": {"antiquity", "manuscript"},
    "silk_trader": {"antiquity", "manuscript", "seachart"},
    "mandarin": {"manuscript", "seachart", "empire", "industrial"},
    "chinese_emperor": {"antiquity", "manuscript", "seachart", "empire", "industrial"},
    "conquistador": {"seachart"},
    "explorer": {"seachart", "empire", "industrial"},
    "navigator": {"seachart", "empire"},
    "pirate": {"seachart", "empire"},
    "buccaneer": {"seachart", "empire"},
    "sailor": {"seachart", "empire", "industrial", "wartime"},
    "admiral": {"seachart", "empire", "industrial", "wartime"},
    "native_chief": {"seachart", "empire", "industrial"},
    "missionary": {"seachart", "empire", "industrial"},
    "renaissance_artist": {"seachart"},
    "inventor": {"seachart", "empire", "industrial"},
    "astronomer": {"manuscript", "seachart", "empire"},
    "merchant_prince": {"seachart"},
    "musketeer": {"seachart", "empire"},
    "redcoat": {"empire"},
    "grenadier": {"empire"},
    "minuteman": {"empire"},
    "general": {"empire", "industrial"},
    "nobleman": {"seachart", "empire"},
    "revolutionary": {"empire"},
    "frontiersman": {"empire", "industrial"},
    "cowboy": {"empire", "industrial"},
    "factory_worker": {"industrial", "wartime"},
    "miner": {"industrial", "wartime"},
    "engineer": {"industrial", "wartime"},
    "gentleman": {"industrial"},
    "lady": {"industrial"},
    "surgeon": {"industrial", "wartime"},
    "tycoon": {"industrial", "wartime"},
    "suffragette": {"industrial", "wartime"},
    "ww1_infantry": {"wartime"},
    "ww1_officer": {"wartime"},
    "ww2_soldier": {"wartime"},
    "paratrooper": {"wartime"},
    "pilot": {"wartime"},
    "nurse": {"wartime"},
    "resistance_fighter": {"wartime"},
    "spy": {"wartime"},
    "codebreaker": {"wartime"},
    "factory_woman": {"wartime"},
    "navy_sailor": {"wartime"},
    "tank_commander": {"wartime"},
    "field_marshal": {"wartime"},
    "refugee": {"wartime"},
    "astronaut": {"wartime"},
    "ziggurat": {"antiquity"},
    "colosseum": {"antiquity", "manuscript"},
    "aqueduct": {"antiquity", "manuscript"},
    "sphinx": {"antiquity"},
    "palisade": {"antiquity", "manuscript", "seachart", "empire"},
    "library": {"antiquity", "manuscript", "seachart", "empire", "industrial"},
    "cathedral": {"manuscript", "seachart", "empire", "industrial", "wartime"},
    "church": {"manuscript", "seachart", "empire", "industrial", "wartime"},
    "mosque": {"manuscript", "seachart", "empire", "industrial", "wartime"},
    "pagoda": {"manuscript", "seachart", "empire", "industrial"},
    "monastery": {"manuscript", "seachart", "empire"},
    "longhouse": {"antiquity", "manuscript"},
    "fortress": {"manuscript", "seachart", "empire", "industrial"},
    "siege_tower": {"antiquity", "manuscript"},
    "catapult": {"antiquity", "manuscript"},
    "trebuchet": {"manuscript"},
    "tavern": {"manuscript", "seachart", "empire", "industrial"},
    "torii": {"manuscript", "seachart", "empire", "industrial", "wartime"},
    "japanese_castle": {"manuscript", "seachart", "empire"},
    "star_fort": {"seachart", "empire"},
    "observatory": {"seachart", "empire", "industrial", "wartime"},
    "printing_press": {"seachart", "empire", "industrial"},
    "gallows": {"manuscript", "seachart", "empire", "industrial"},
    "guillotine": {"empire"},
    "clocktower": {"manuscript", "seachart", "empire", "industrial", "wartime"},
    "mine": {"manuscript", "seachart", "empire", "industrial", "wartime"},
    "skyscraper": {"industrial", "wartime"},
    "derrick": {"industrial", "wartime"},
    "barn": {"manuscript", "seachart", "empire", "industrial", "wartime"},
    "telegraph": {"industrial", "wartime"},
    "bunker": {"wartime"},
    "radiotower": {"wartime"},
    "rocket": {"wartime"},
})
ERA_ONLY.update({
    "neanderthal": {"prehistory"},
    "shaman": {"prehistory"},
    "cave_painter": {"prehistory"},
    "mammoth_hunter": {"prehistory"},
    "banker": {"renaissance"},
    "courtier": {"renaissance"},
    "condottiero": {"renaissance"},
    "printer": {"renaissance"},
    "geisha": {"orient"},
    "rice_farmer": {"orient"},
    "tang_scholar": {"orient"},
    "shaolin_monk": {"orient"},
    "sheriff": {"frontier"},
    "outlaw": {"frontier"},
    "prospector": {"frontier"},
    "settler": {"frontier"},
    "pioneer_woman": {"frontier"},
    "trapper": {"frontier"},
    "railroad_worker": {"frontier"},
    "native_warrior": {"frontier"},
    "cosmonaut": {"spaceage"},
    "scientist": {"spaceage"},
    "programmer": {"spaceage"},
    "protester": {"spaceage"},
    "president": {"spaceage"},
    "reporter": {"spaceage"},
    "test_pilot": {"spaceage"},
    "mammoth": {"prehistory"},
    "sabertooth": {"prehistory"},
    "cave": {"prehistory"},
    "menhir": {"prehistory"},
    "duomo": {"renaissance", "seachart", "empire"},
    "pavilion": {"orient"},
    "dojo": {"orient"},
    "saloon": {"frontier"},
    "general_store": {"frontier", "industrial"},
    "water_tower": {"frontier", "industrial", "wartime"},
    "radar_dish": {"wartime", "spaceage"},
    "cooling_tower": {"wartime", "spaceage"},
    "wagon": {"frontier", "industrial"},
    "junk": {"orient", "manuscript", "seachart"},
    "lander": {"spaceage"},
    "satellite": {"spaceage"},
})
# Eras added later: the age of exploration also covers the Renaissance, the industrial age the frontier, the 20th century the space age.
# The prehistory and orient looks are special: prehistory draws ONLY what PREHISTORY_OK lists, orient draws what ORIENT_OK lists plus everything with no era restriction.
for _name, _looks in ERA_ONLY.items():
    if "seachart" in _looks:
        _looks.add("renaissance")
    if "industrial" in _looks:
        _looks.add("frontier")
    if "wartime" in _looks:
        _looks.add("spaceage")
ERA_ONLY["cavalry"] = {"antiquity", "manuscript", "seachart", "empire", "industrial", "wartime", "renaissance", "orient", "frontier"}
PREHISTORY_OK = set(ANIMALS) | set(HUMANS_PREHISTORIC := ("caveman", "neanderthal", "shaman", "cave_painter", "mammoth_hunter")) | {"crowd", "farmer", "fire", "smoke", "birds", "comet", "eclipse", "volcano", "torch", "tents", "hut", "tipi", "cave", "menhir", "stonehenge", "village"}
ORIENT_OK = {"samurai", "ninja", "shogun", "mongol_horseman", "khan", "silk_trader", "mandarin", "chinese_emperor", "qin_warrior", "geisha", "rice_farmer", "tang_scholar", "shaolin_monk", "pagoda", "torii", "japanese_castle", "great_wall", "yurt",
              "fortress", "palace", "trebuchet", "catapult", "siege_tower", "cannon", "pavilion", "dojo", "junk", "galley", "sailor", "peasant", "blacksmith", "scribe", "philosopher", "library", "forge", "tavern", "printing_press", "observatory", "gate"}


def era_allows(subject: str, look: str) -> bool:
    """Whether a picture subject can be drawn in an era: prehistory only draws its own list, orient only the Eastern and the timeless ones, every other look obeys ERA_ONLY."""
    if look == "prehistory":
        return subject in PREHISTORY_OK
    if look == "orient":
        return subject in ORIENT_OK or subject not in ERA_ONLY
    return subject not in ERA_ONLY or look in ERA_ONLY[subject]


ART_OPTIONAL = ("flash", "map", "outro")  # every other scene carries 1-2 illustration shots

ICONS = ("column", "laurel", "sword", "ship", "crown", "scroll", "hourglass", "castle", "quill", "key", "coin", "compass", "pyramid", "book", "gear", "sun")

# The eight formats. mystery: an unsolved case. dayinlife: an ordinary person's day. turning: the decision that changed everything. lies: myths of history stamped true or false.
# whatif: a grounded counterfactual. duel: two contenders over rounds. journey: a route on a map. portrait: a life in its key dates.
FORMATS = ("mystery", "dayinlife", "turning", "lies", "whatif", "duel", "journey", "portrait")
# How often `--motion-format any` picks each format (the first test wave decides the real weights, see scripts/genera_batch.py).
FORMAT_WEIGHTS = {"mystery": 3, "turning": 2, "lies": 2, "whatif": 2, "dayinlife": 2, "duel": 2, "journey": 2, "portrait": 2}


class ArtShot(BaseModel):
    place: PlaceT = Field(..., description="Where the picture is set")
    time: TimeT = Field(..., description="Time of day: sets the sky and the light")
    weather: WeatherT = Field(default="clear", description="clear, rain, snow, storm (rain and lightning) or smoke")
    subjects: List[str] = Field(..., description="1-4 DIFFERENT things drawn in the picture, the first is the hero: " + ", ".join(SUBJECTS))
    action: Optional[ActionT] = Field(default=None, description="What the PEOPLE in the picture are doing (only when the shot has soldiers, king, crowd, scholar, monk, farmer or merchant): " + ", ".join(ACTIONS) + ". Optional, but vary it from shot to shot")
    view: Optional[ViewT] = Field(default=None, description="Which way those people face: front (toward the viewer), side (in profile) or back (we see their backs, as they look at what is ahead). Optional: the action picks the natural one")


class MotionSceneModel(BaseModel):
    type: SceneType
    text: str = Field(..., description="Main line, at most 8 words. date: the year as digits. chapter: the chapter title. map: the title above the map. quote: the quotation (at most 30 words). ledger: the label above the figure")
    accentText: Optional[str] = Field(default=None, description="The accent phrase (max 4 words; verdict: max 6), shown in the rubric colour with a hand-drawn underline. date: the event line (max 8 words). quote: WHO said it (name, max 6 words). map: a caption under the map (max 10 words)")
    kicker: Optional[str] = Field(default=None, description="Small capitals label above the text, 1-4 words. date: the PLACE (\"Rome, Western Empire\")")
    value: Optional[float] = Field(default=None, description="date: the year as a whole number (> 0). ledger: the figure counted up (a whole number > 0, never a decimal). chapter: the chapter number")
    unit: Optional[str] = Field(default=None, description="date: AD or BC. ledger: what the figure counts (\"soldiers\", \"years\", \"miles\"), required")
    items: Optional[List[str]] = Field(default=None, description="timeline: 3-5 \"when|label\" entries in order (when = a year or an hour such as \"6 AM\", at most 8 characters; label at most 28 characters). map: 2-5 \"Place|x|y\" entries in the order of the route (x west 0 to east 100, y north 0 to south 100, schematic positions). list: 2-4 items of at most 6 words")
    left: Optional[str] = Field(default=None, description="versus: name of the left contender, at most 16 characters (the same in every versus scene)")
    right: Optional[str] = Field(default=None, description="versus: name of the right contender, at most 16 characters (the same in every versus scene)")
    leftValue: Optional[float] = Field(default=None, description="versus: the left contender's real, approximate figure for this round's metric (a whole number > 0); `unit` is shared by both")
    rightValue: Optional[float] = Field(default=None, description="versus: the right contender's real, approximate figure for the same metric (a whole number > 0)")
    winner: Optional[Literal["left", "right", "none"]] = Field(default=None, description="versus: who wins the round; leave empty when the BIGGER figure wins, set it when lower is better")
    verdict: Optional[Literal["myth", "fact", "partly"]] = Field(default=None, description="verdict scenes only: is the claim a myth, a fact or partly true")
    icon: Optional[str] = Field(default=None, description="statement scenes: the engraving drawn under the text, one of: " + ", ".join(ICONS) + ". Optional: picked from the words when empty")
    art: Optional[List[ArtShot]] = Field(default=None, description="1-2 illustration SHOTS drawn behind this scene as animated vector art. Each shot is a place + a time of day + optional weather + 1-4 subjects from the fixed lists. The picture changes shot by shot as the narration moves on, so a scene with two ideas gets two shots, in the order of the narration. Required on every scene except flash, map and outro")
    mediaSrc: Optional[str] = Field(default=None, description="Set by the pipeline, never by the model")
    callout: Optional[str] = Field(default=None, description="Set by the pipeline from the narration, never by the model: a short marginal note (a figure or a name) that pops up mid-scene")
    calloutCue: Optional[float] = Field(default=None, description="Set by the pipeline from the voice timing, never by the model")
    accentCue: Optional[float] = Field(default=None, description="Set by the pipeline from the voice timing, never by the model: seconds after the scene starts at which the narrator says the accent phrase")
    narration: str = Field(default="", description="What the narrator SAYS during this scene: one or two natural spoken sentences, 8-16 words, that explain the idea on screen")
    durationInFrames: int = Field(..., description="Minimum scene length in frames at 30 fps (60-150); the pipeline stretches it to fit the narration")


class CaptionWord(BaseModel):
    w: str = Field(..., description="Set by the pipeline: the spoken word")
    s: int = Field(..., description="Set by the pipeline: first frame of the word in the whole video")
    e: int = Field(..., description="Set by the pipeline: last frame")


class MotionProject(BaseModel):
    topic: str
    screen_title: str = Field(..., description="Short title, at most 24 characters")
    title: str = Field(..., max_length=100, description="YouTube title in English, at most 80 characters, plus 2-3 hashtags")
    description: str = Field(..., description="Two English sentences")
    tags: List[str] = Field(..., description="6-8 English tags")
    pinned_comment: str = Field(..., description="The same two-option vote as the outro, in the form \"A or B? Reply with one word.\" (at most 120 characters)")
    scenes: List[MotionSceneModel]
    kind: str = Field(default="history", description="Set by the pipeline")
    format: Optional[str] = Field(default=None, description="Set by the pipeline: one of FORMATS (None = a free-form history)")
    look: Optional[str] = Field(default=None, description="Set by the pipeline: the era look of the video (services/looks.py)")
    captions: Optional[List[CaptionWord]] = Field(default=None, description="Set by the pipeline from the voice timing: the words of the caption strip")
    fact_checked: bool = Field(default=True, description="Set by the pipeline; False when no model could run the fact-check")
    gemini_input_tokens: int = Field(default=0)
    gemini_output_tokens: int = Field(default=0)

    def to_props(self) -> dict:
        """The JSON the MotionGraphic composition receives as inputProps."""
        return {
            "title": self.screen_title,
            **({"series": self.series_label} if self.series_label else {}),
            "scenes": [s.model_dump(exclude_none=True) for s in self.scenes],
            **({"look": self.look} if self.look else {}),
            **({"captions": [c.model_dump() for c in self.captions]} if self.captions else {}),
        }

    @property
    def series_label(self) -> str:
        """The series part of the title ("Turning Point #4" of "Turning Point #4: The day..."), set by services/series.py."""
        head = self.title.split(":", 1)[0].strip() if ":" in self.title else ""
        return head if 3 <= len(head) <= 24 and "#" not in head.rsplit(" ", 1)[0] else ""

    @property
    def total_frames(self) -> int:
        return sum(s.durationInFrames for s in self.scenes)

    @property
    def narration_words(self) -> int:
        return sum(len(s.narration.split()) for s in self.scenes)

    @property
    def all_text(self) -> str:
        parts = [self.title, self.description, self.pinned_comment, self.screen_title, " ".join(self.tags)]
        for s in self.scenes:
            parts += [s.text, s.accentText or "", s.kicker or "", s.unit or "", " ".join(s.items or []), s.left or "", s.right or "", s.narration]
        return " ".join(p for p in parts if p)


def estimated_seconds(p: MotionProject) -> float:
    """Length after narration: ~2.5 spoken words per second plus a breath per scene, never less than the scenes' own minimum."""
    return max(p.total_frames / FPS, p.narration_words / WORDS_PER_SECOND + 0.7 * len(p.scenes))


# --------------------------------------------------------------------------------------------------------------------------------------------------------------------- prompts

SYSTEM_PROMPT = """You write 65-80 second vertical motion-graphics histories for the channel 'The Chronicles of History' (the stories behind real events, people and places).
They must run MORE than 60 seconds (YouTube monetisation), so be generous with substance: a real story, not a teaser.
The video is an illustrated archive: aged paper, ink, engravings, hand-drawn maps, stamps and wax seals. One idea per scene, a single ACCENT phrase underlined by a hand-drawn stroke, dates stamped into the page.
A NARRATOR speaks over the video. Each scene has a `narration` (what is said while that scene is on screen): natural spoken American English, 8-16 words, conversational and vivid,
explaining what the screen shows (the on-screen words are the headline, the narration is the story). Together the narrations read like ONE continuous story with a hook, a build-up,
a twist and a closing line, 150-190 words in total (about 11 words per scene). Spell numbers and years the way they are spoken ("four seventy-six A.D.", "fourteen ninety-two", "forty thousand soldiers").
The narrations are ONE monologue, not separate captions: each line picks up from the previous one and flows into the next, opening with a connective such as "But", "And", "Then", "That's why", "Now", "Which means"
(never a stand-alone fact, never the same opener twice in a row). The last scene's narration ends with the two-option vote question (see VOTE), never with "Follow for more".

LANGUAGE: everything (scene text, narration, title, description, tags, comment) MUST be natural American English. Never any other language.
FACTS (the most important rule): only TRUE, well documented history. Every date, name, place and figure must be real; give dates as the years historians agree on and figures as approximate ("about", "roughly").
When historians disagree, say so ("historians still argue", "according to Plutarch") instead of choosing a side. NEVER invent a quote, a number, a person or a detail to make the story better:
a `quote` scene is allowed ONLY for a famous, well documented quotation with its real author (and "reportedly" in the narration when the attribution is uncertain). If you are not sure of a fact, leave it out.
No gore for its own sake, no glorification of atrocities or of hate movements; treat victims and difficult subjects with respect.

STORY (11 to 19 scenes, aim for 13+, each 60-150 frames at 30 fps), using a variety of these scene types:
- statement: `text` (max 8 words) + `accentText` (1-4 words, the emotional or key phrase, NOT repeating the last word of `text`) + `kicker` (1-4 words, optional) + `icon` (optional engraving: column laurel sword ship crown scroll hourglass castle quill key coin compass pyramid book gear sun).
  Use it for claims, stakes and turns of the story.
- date: `value` = the year (whole number), `text` = the year as digits, `unit` = AD or BC, `kicker` = the PLACE ("Rome, Western Empire"), `accentText` = what happened (max 8 words). Stamps one decisive date into the page.
- timeline: `text` = a title (max 5 words), `items` = 3 to 5 "when|label" entries in order ("476|Last emperor falls"; for a day: "6 AM|Wake before dawn"). when: at most 8 characters, label: at most 28 characters.
- map: `text` = a title, `items` = 2 to 5 "Place|x|y" in the order of the route (x: 0 west to 100 east, y: 0 north to 100 south, schematic but geographically sensible), `accentText` = a caption (max 10 words). The route is inked from place to place.
- quote: `text` = a famous, documented quotation (max 30 words), `accentText` = who said it. Rare: at most one per video, only when you are sure.
- ledger: `text` = a label (max 8 words), `value` = a REAL whole number > 0 (never a decimal), `unit` = what it counts ("soldiers", "years", "miles"), `accentText` = a short remark. The figure must be said in the narration.
- versus: `left`/`right` names (max 16 characters, identical in every versus scene), `leftValue`/`rightValue` real approximate whole numbers, `unit` shared, `text` = the round's metric. Two banners unfurl to the figures.
- list: `text` = a heading, `items` = 2-4 short lines (max 6 words). verdict: a claim stamped MYTH, FACT or PARTLY (`verdict`), `text` = the claim as people say it (max 8 words), `accentText` = the one-line truth (max 6 words).
- chapter: `value` = a chapter number, `text` = a title, `accentText` = a subtitle: a section break, rarely needed. flash: ONE word on a bare page (a rhythm break; at most two per video, at least four scenes apart).
- Last scene: type outro. `text` and `accentText` are replaced by the vote cards (see VOTE).
ART DIRECTION (the video is mostly ANIMATED VECTOR DRAWINGS): behind every scene a picture is drawn and moves, and it changes as the narration moves on, so the viewer SEES the story. Every scene except flash, map and outro carries `art`:
one or two SHOTS. A shot = `place` (desert, sea, coast, plains, mountains, forest, snow, city, plaza, interior, battlefield) + `time` (dawn, day, dusk, night) + optional `weather` (clear, rain, snow, storm, smoke) + 1-4 `subjects`:
structures (castle temple pyramids tower gate windmill factory lighthouse tents bridge ruins + ziggurat colosseum aqueduct obelisk sphinx great_wall triumphal_arch stonehenge hut palisade harbor market well library theater adobe tomb palace cathedral church mosque pagoda monastery longhouse fortress siege_tower catapult trebuchet forge tavern village tipi yurt igloo torii japanese_castle star_fort observatory printing_press gallows guillotine clocktower mine skyscraper derrick barn telegraph bunker radiotower rocket + cave menhir duomo pavilion dojo saloon general_store water_tower radar_dish cooling_tower),
generic people and vehicles (soldiers cavalry king crowd caravan scholar monk farmer merchant ship fleet galley elephants train tank plane wagon junk lander satellite), animals (dog wolf fox lion tiger bear deer boar pig cow ox sheep goat donkey rat eagle raven snake crocodile whale mammoth sabertooth bison horse camel),
and 127 NAMED HISTORICAL CHARACTERS (a leader alone, the rest with two companions): ancient: caveman pharaoh egyptian_priest scribe pyramid_builder gladiator legionary centurion senator roman_emperor vestal hoplite philosopher athlete persian_immortal babylonian celt carthaginian oracle druid qin_warrior;
medieval: knight crusader templar viking jarl bishop pope friar peasant blacksmith longbowman crossbowman castle_guard queen princess jester executioner alchemist plague_doctor samurai ninja shogun mongol_horseman khan saracen sultan byzantine_emperor aztec_warrior aztec_priest inca_noble maya_priest silk_trader mandarin chinese_emperor;
exploration: conquistador explorer navigator pirate buccaneer sailor admiral native_chief missionary renaissance_artist inventor astronomer merchant_prince musketeer; empires: redcoat grenadier minuteman general nobleman revolutionary frontiersman cowboy;
industrial: factory_worker miner engineer gentleman lady surgeon tycoon suffragette; 20th century: ww1_infantry ww1_officer ww2_soldier paratrooper pilot nurse resistance_fighter spy codebreaker factory_woman navy_sailor tank_commander field_marshal refugee astronaut;
prehistory: neanderthal shaman cave_painter mammoth_hunter; renaissance: banker courtier condottiero printer; the East: geisha rice_farmer tang_scholar shaolin_monk; the frontier: sheriff outlaw prospector settler pioneer_woman trapper railroad_worker native_warrior; space age: cosmonaut scientist programmer protester president reporter test_pilot.
Pick the character who WAS THERE: "Caesar crossed the Rubicon" = legionary or centurion, "the Vikings raided" = viking, jarl; never a samurai in Rome. Characters, structures and animals of the wrong era are removed automatically, so choose the right ones. `action` and `view` apply to every person (the 100 characters included),
props (scroll crown sword chest torch banner throne map cannon) and effects (fire smoke birds comet eclipse volcano). The first subject is the hero of the picture. Choose what the narrator is saying AT THAT MOMENT:
"the army crossed the Alps" = mountains, dawn, [elephants, soldiers]; "the city burned" = city, dusk, smoke, [crowd, fire, gate]; "the king grew afraid" = interior, night, [throne, king, torch]. A scene with two ideas gets two shots in the order of the narration.
Vary place, time and hero from scene to scene so the picture keeps changing; a night scene after a day scene, a wide landscape after an interior. Depict the period faithfully: tank and plane only in 20th-century stories, train and factory only in the industrial age and later,
cannon only after 1300, castle and windmill never in antiquity (anachronistic subjects are removed). Never repeat the same shot twice in a video.
PEOPLE ACT. When a shot has any person (soldiers, king, crowd, scholar, monk, farmer, merchant or one of the hundred characters), add `action` (what they are doing) and, when it helps, `view` (front, side or back). The 37 actions: stand walk run sit point wave cheer kneel bow pray salute slash stab fall lie crouch carry push dig hammer write read think shout plead threaten shrug lift throw shoot drink dance sneak surrender cower lean watch.
Match the action to the narration: "the army charged" = soldiers + run; "they begged for mercy" = crowd + plead; "he signed the decree" = king + write; "the soldiers laid down their arms" = soldiers + surrender; "she studied the stars" = scholar + read or think; "the crowd roared" = crowd + shout; "the city fell asleep" = crowd + lie. A view of `back` shows people facing the thing the viewer is looking at (an army of backs walking to a gate). Use at least five different actions across the video and never the same action in two shots in a row. Actions are ignored on shots with no people.
STORY FIRST. The drawings are the story and the words are only a hint: the viewer must understand what happens by WATCHING the characters. Choose one PROTAGONIST (a named character such as legionary, knight, pharaoh, sailor or a group such as soldiers or crowd)
and let that character appear in at least three shots, living the story beat by beat: arriving, hesitating, deciding, fighting, falling, celebrating. Every shot with people has an `action` that is what THEY are doing at that moment of the narration (use at least four different actions), and a `view`
when it helps. Put at least 60% of the shots on people, with the hero person first in `subjects`; use structures, animals and props as the stage around them. Prefer two shots per scene so the picture follows each phase of the sentence.
ON-SCREEN TEXT IS SMALL AND SHORT: `text` at most 6 words and `accentText` at most 3: the picture carries the story, the narration carries the detail.
Rules: never repeat the same scene type back to back (except versus and verdict); on-screen text is short and readable in 2 seconds; no emojis.
Metadata: title <= 80 characters + 2-3 hashtags (#history first, then one-word tags such as #ancientrome); the title is a specific question, a claim or a duel ("What If Rome Never Fell?", "The Day Rome Fell"), never a catalogue line;
description 2 sentences; 6-8 tags; pinned_comment = the two-option vote of the outro. screen_title <= 24 characters."""

RETENTION_RULES = """
RETENTION RULES (they decide whether people keep watching; the validator checks them):
- COLD OPEN. Scene 1 is the most striking fact, the paradox or the claim that breaks a belief, in at most 14 words with NO context before it. Never open with a greeting, "today", "in this video",
  "did you know", "have you ever wondered", "let's" or "so". Example: "Rome's last emperor was a teenager, and nobody even noticed he was gone."
- OPEN LOOP. In scene 2, 3, 4 or 5 the narration promises something that comes later, and the video pays it off in the last third. Use one of these phrases VERBATIM:
  "Stay to the end, the catch comes last." / "And the last one is the one most people miss." / "But the real twist comes in a moment." / "Wait for the last part, nobody expects it."
- PATTERN BREAK. Never more than two statement scenes in a row: break the rhythm with a date, timeline, map, ledger, list, versus, verdict, quote or flash scene at least every third scene.
- PACE. No narration is longer than 16 words (24 in duel videos): something on screen changes at least every 5 seconds. Keep the whole script at 150-190 words: use more scenes of 8-16 words, never fewer words.
- VOTE. The outro narration ends with a TWO-OPTION question the viewer can answer in one word ("Betrayal or bad luck?", "Team Rome or team Carthage?") and `pinned_comment` repeats the SAME choice
  as "A or B? Reply with one word." (at most 120 characters). The two options are NAMED in the question and belong to THIS video; never "What do you think?" nor "Tell me below and follow for more".
- HOOK. Scene 1 states a tension or a verdict, not the topic ("A label would be 'The fall of Rome'; a hook is 'Rome fell and almost nobody alive noticed'"). Never "Let us", "Let's" or "Did you know".
- YOU. Put the viewer in the story when it helps ("you wake before dawn", "your army is out of food"), not "people back then".
- ACCENT. `accentText` adds words that are NOT in `text` (the headline and the accent are drawn one under the other): never repeat the headline's last word in the accent."""

FORMAT_COMMON = """
CONTENT FORMAT. This video follows a fixed format. A hook first, an outro last, a narration on every scene, 150-190 words in total, 13 to 19 scenes (duel videos: 9 to 19, with narrations of 14-24 words so the video still reaches 150-190 words),
and NEVER two consecutive scenes of the same type unless it is a versus or a verdict scene."""

FORMAT_RULES = {
    "mystery": FORMAT_COMMON + """
FORMAT = UNSOLVED. ONE genuinely unsolved or disputed historical mystery that is well documented (a vanished colony, a missing ship, an undeciphered text, a disputed death, a lost city, an unexplained event).
Structure: (1) cold open with the strangest documented fact; (2) a `date` scene: when and where it happened (kicker = the place); (3) what we know for certain: a `timeline` or a `list`; (4) a `map` when the mystery is tied to a place;
(5) the two leading explanations, each told in its own scene and clearly labelled as a theory ("one theory says", "other historians argue") with the real evidence for and against, including one `ledger` or `date` scene when a real figure or date matters;
(6) what is still missing; (7) the outro vote between the TWO leading theories (named in the question). Never present a theory as proven, never invent evidence, never include supernatural claims as fact.""",
    "dayinlife": FORMAT_COMMON + """
FORMAT = A DAY IN. The day of an ORDINARY person (a baker, a scribe, a sailor, a soldier, a monk, a farmer, a child) in a precise place and year, told in the second person ("You wake before dawn").
Structure: (1) cold open with the most surprising detail of that life; (2) a `date` scene: the year and the place (kicker = the place and the person's job); (3) exactly ONE `timeline` scene with 5 hours of the day ("5 AM|Wake before dawn") that frames the day,
and then one scene for each of 3 or 4 of those hours: a `statement` (with an icon) or a `list`; (4) a `ledger` scene with a real documented figure of that life (a wage, hours worked, a price, an age); (5) the twist: how this life ended or what changed;
(6) the outro vote between two options of THIS life ("Would you survive it, or run?"). Use only what historians know about daily life in that time and place; say "most" or "typically" instead of inventing one person's biography.""",
    "turning": FORMAT_COMMON + """
FORMAT = TURNING POINT. ONE decision or moment that changed the course of history (a crossing, an order, a signature, a refusal, a mistake), told as a countdown to the moment and its consequences.
Structure: (1) cold open with the stakes; (2) a `date` scene: the day and the place; (3) a `statement` for who had to decide and what they feared; (4) the options on the table, as a `list` of 2-3 lines;
(5) the decision itself in one `statement` (accent on the decision); (6) a `timeline` with 3-5 consequences in order; (7) one `ledger` with a real figure of the consequences (people, miles, years); (8) the what-if in one line and a final twist;
(9) the outro vote on the decision ("Genius or mistake?"). Stay with what is documented: say "reportedly" for anything only one source claims.""",
    "lies": FORMAT_COMMON + """
FORMAT = HISTORY LIES. A theme (Vikings, medieval life, ancient Rome, pirates, the Wild West, a famous person) and 4 or 5 widespread beliefs about it, each tested.
- Each belief is a `verdict` scene: `text` = the belief exactly as people say it (max 8 words), `verdict` = myth | fact | partly, `accentText` = the one-line truth (max 6 words, REQUIRED), `kicker` = "myth or fact?".
- After each verdict scene put ONE supporting scene (date, ledger, map, list, quote or statement) that shows the evidence; its narration explains WHY the belief started or what is really known.
- At least 3 of the verdicts must be MYTH or PARTLY (a video of only facts is boring) and at least one must be FACT, so the viewer cannot guess. Use well documented corrections only (for example: Viking helmets had no horns; people did not think the Earth was flat in the Middle Ages).
- The outro vote asks which belief the viewer held ("Did you believe the horned helmet, or the flat Earth?" style: two beliefs named).""",
    "whatif": FORMAT_COMMON + """
FORMAT = WHAT IF. ONE counterfactual built on a real, documented hinge of history, told as clearly hypothetical ("What if the Armada had reached London?").
Structure: (1) cold open: scene 1's narration STARTS with "What if" and states the hinge; (2) a `date` scene with the REAL event and its real date (kicker = place); (3) a `statement` or `list` for how close it really came (documented);
(4) the fork in one `statement` (accent on the change); (5) three plausible consequences, each in its own scene (statement, map, ledger or timeline), each hedged with words like "historians think", "it is likely", "might"; never state a consequence as a fact;
(6) what actually happened instead, with a real figure or date; (7) the outro vote between two outcomes ("Better world or worse?"). Keep the hypothetical clearly separate from the history, and always say what is speculation.""",
    "duel": FORMAT_COMMON + """
FORMAT = HISTORY DUEL. Two real contenders (two armies, empires, leaders, cities, fleets, inventions, dynasties) compared over 3 to 5 ROUNDS.
- Each round is ONE `versus` scene about ONE measurable thing (soldiers, ships, territory in thousand square miles, population in millions, years in power, treasure): `left` and `right` are the SAME two names in every versus scene (max 16 characters),
  `leftValue`/`rightValue` are real approximate whole numbers, `unit` is shared, `winner` is set when lower is better. The figures must be said in the narration. Use only figures historians commonly cite; say "about" for uncertain ones.
- Around the rounds: a cold open that frames the duel, a `date` scene or two for when each was at its peak, a `statement` between rounds, the verdict of history in one `statement` (who actually won and why, a documented fact), and an outro vote ("Team Rome or team Carthage?").
- Versus scenes may follow each other. Be fair to both sides: no contender is a joke.""",
    "journey": FORMAT_COMMON + """
FORMAT = THE ROUTE. ONE journey that mattered (an expedition, a campaign, a migration, a trade route, an escape, a pilgrimage) told as a route inked on a hand-drawn map.
Structure: (1) cold open with the cost or the impossibility of the journey; (2) a `date` scene: the start, the year and the place; (3) a `map` scene with 3 to 5 places in route order (schematic but geographically sensible x/y: west to east, north to south) and a caption;
(4) then the journey in stages, one scene per stage (statement with an icon, ledger with a real distance or number of people, timeline of key dates); you may use a second `map` for a different leg (never two maps in a row);
(5) the arrival or the failure, with a real figure of who made it; (6) what the journey changed; (7) the outro vote ("Heroes or fools?"). Names of places must be real and spelled as in English books.""",
    "portrait": FORMAT_COMMON + """
FORMAT = LIFE IN DATES. The life of ONE real, well documented person (a ruler, an explorer, a scientist, an inventor, a writer, a rebel) told through its key dates.
Structure: (1) cold open with the paradox of the person (what they are famous for versus what they really were); (2) a `date` scene for the birth (kicker = place and family), then the rise; (3) a `timeline` with 4-5 key years of the whole life;
(4) at least one more `date` scene for the decisive moment and one for the death or the end; (5) one `ledger` with a real figure (years ruled, books written, miles travelled, soldiers); (6) at most one `quote`, ONLY a famous, documented sentence;
(7) the legacy in one `statement`; (8) the outro vote about the person ("Hero or villain?", "Genius or lucky?"). Only documented facts about the person: no invented dialogue, no invented feelings stated as facts.""",
}

TOPIC_HINTS = {
    "mystery": "Pick ONE well documented unsolved or disputed mystery of history (for example the lost colony of Roanoke, the Voynich manuscript, the Princes in the Tower, the Sea Peoples, the Antikythera mechanism).",
    "dayinlife": "Pick ONE ordinary person in a precise place and year whose daily life is well documented (a Roman baker in Pompeii, a medieval monk, a sailor of the East India Company, a Viking farmer).",
    "turning": "Pick ONE decision or moment that changed history and is well documented (Caesar crossing the Rubicon, the Cuban Missile Crisis, the Edict of Milan, the Fall of Constantinople).",
    "lies": "Pick ONE theme and test the famous myths about it that historians have clearly debunked or confirmed (Vikings, the Middle Ages, gladiators, pirates, Napoleon, the Wild West).",
    "whatif": "Pick ONE real hinge of history that was close and about which historians have written counterfactuals (the Spanish Armada, the Battle of Tours, the plot to kill Hitler in 1944, the Mongol retreat from Europe in 1242).",
    "duel": "Pick ONE pair of contenders with well documented, comparable figures (Rome and Han China, Athens and Sparta, the Mongol Empire and the British Empire, the Spanish Armada and the English fleet).",
    "journey": "Pick ONE well documented journey (Hannibal crossing the Alps, Magellan's circumnavigation, the Long March, Lewis and Clark, Shackleton's Endurance expedition, the Silk Road of Marco Polo).",
    "portrait": "Pick ONE well documented person with a striking life (Cleopatra, Genghis Khan, Marie Curie, Ada Lovelace, Leonardo da Vinci, Harriet Tubman, Ibn Battuta).",
}

FACTS_RULES = """
SOURCE TEXT. This video is about a specific subject for which a reference text is given. Every claim about it (names, dates, figures, who said what) must come from the SOURCE TEXT below;
do not use outside knowledge about the subject and do not invent. Say "reportedly" for anything the text says is reported. Never use relative dates ("this week", "tomorrow"): write the date itself.
SOURCE TEXT:
{facts}"""

# --------------------------------------------------------------------------------------------------------------------------------------------------------------------- language and cleanup

_EN_STOP = {"the", "a", "an", "is", "are", "to", "of", "and", "in", "it", "your", "you", "for", "on", "with", "that", "this", "can", "no", "not", "one", "every", "more", "how", "why", "what", "from", "by", "at", "be", "its", "we", "just", "all", "up", "than", "into", "or", "so", "but", "if", "as"}


def looks_english(text: str) -> bool:
    """Heuristic language gate: rejects accents/Spanish function words and text with almost no English function words."""
    words = re.findall(r"[A-Za-zÀ-ÿ']+", text)
    if len(words) < 4:
        return not re.search(r"[ñ¿¡áéíóúü]", text, re.I)
    if re.search(r"[ñ¿¡áéíóúü]", text, re.I):
        return False
    spanish = sum(1 for w in words if w.lower() in {"el", "la", "los", "las", "de", "del", "que", "para", "con", "una", "por", "como", "más", "es", "y", "tu", "su"})
    english = sum(1 for w in words if w.lower() in _EN_STOP)
    return spanish <= max(1, len(words) // 12) and english >= max(1, len(words) // 14)


def strip_markers(p: MotionProject) -> None:
    """Removes markdown emphasis marks (*word*, **word**) from everything shown, spoken or published: the renderer draws them as literal asterisks."""
    clean = lambda t: re.sub(r"\s{2,}", " ", t.replace("*", "")).strip() if isinstance(t, str) else t  # noqa: E731
    for f in ("title", "description", "pinned_comment", "screen_title"):
        setattr(p, f, clean(getattr(p, f)))
    p.tags = [clean(t) for t in p.tags]
    for s in p.scenes:
        for f in ("text", "accentText", "kicker", "narration", "unit", "left", "right", "callout"):
            if getattr(s, f, None):
                setattr(s, f, clean(getattr(s, f)))
        if s.items:
            s.items = [clean(i) for i in s.items]


def _repair(p: MotionProject) -> None:
    """Fixes what can be fixed without asking again: clamps scene lengths, trims lists, makes a date scene's text its year, drops unknown icons and unusable media."""
    strip_markers(p)
    for s in p.scenes:
        s.durationInFrames = max(60, min(150, int(s.durationInFrames)))
        if s.items:
            s.items = s.items[:{"timeline": 5, "map": 5}.get(s.type, 4)]
        if s.type == "date" and s.value:
            s.value = float(round(s.value))
            if not re.fullmatch(r"\d{1,4}", (s.text or "").strip()):
                s.text = str(int(s.value))
            if s.unit:
                s.unit = "BC" if s.unit.strip().upper().startswith("B") else "AD"
        if s.type == "ledger" and s.value is not None and s.value > 0:
            s.value = float(max(1, round(s.value)))  # counters round decimals: say the whole number
        if s.type == "versus":
            s.leftValue = float(round(s.leftValue)) if s.leftValue else s.leftValue
            s.rightValue = float(round(s.rightValue)) if s.rightValue else s.rightValue
        if (s.icon or "").lower() not in ICONS:
            s.icon = None
        else:
            s.icon = s.icon.lower()
        s.mediaSrc = None
        if s.art is not None:
            kept = []
            for sh in s.art[:2]:
                sh.subjects = list(dict.fromkeys(sh.subjects))[:4]
                if sh.subjects:
                    kept.append(sh)
            s.art = kept or None
        if len(s.narration.split()) < 3 and s.type in ("flash", "outro"):  # a one-word punch scene may simply speak its own text
            s.narration = " ".join(x for x in (s.text, s.accentText) if x)


def fix_duplicate_accents(scenes) -> None:
    """The headline and its accent phrase are drawn one under the other, so an accent that repeats the first or last words of the headline reads as a stutter
    ("Check before you believe" + "believe"): the repeated words are taken out of the headline (the accent keeps them)."""
    for s in scenes:
        acc = (s.accentText or "").strip()
        if len(acc) < 3 or s.type not in ("statement", "chapter", "verdict"):
            continue
        words, a_words = s.text.split(), acc.split()
        k = len(a_words)
        norm = lambda ws: [re.sub(r"[^a-z0-9]", "", w.lower()) for w in ws]  # noqa: E731
        if len(words) > k and norm(words[-k:]) == norm(a_words):
            s.text = " ".join(words[:-k]).rstrip(" ,;:-")
        elif len(words) > k and norm(words[:k]) == norm(a_words):
            s.text = " ".join(words[k:]).lstrip(" ,;:-")


# --------------------------------------------------------------------------------------------------------------------------------------------------------------------- the vote

_QUESTION_START = re.compile(r"^(would|do|does|did|will|which|is|are|can|could|should|have|has|what|how|why|who|was|were)\b", re.I)


def vote_options(pinned: str) -> Optional[List[str]]:
    """The two short options of a pinned-comment vote ("Rome or Carthage? Reply with one word." -> ["Rome", "Carthage"]; "Reply HERO or VILLAIN." -> ["Hero", "Villain"]),
    or None when the question does not name two short things (the outro then simply has no vote cards)."""
    text = (pinned or "").strip()
    m = re.search(r"\breply\s+(.{1,24}?)\s+or\s+(.{1,24}?)\s*[.!?]*$", text, re.I)
    if not m and not _QUESTION_START.match(text):
        m = re.match(r"^(.{2,28}?),?\s+or\s+(.{2,28}?)\s*\?", text, re.I)
    if not m:
        return None
    out = []
    for raw in m.groups():
        t = re.sub(r"^(the|a|an|team)\s+", "", raw.strip(" ,.?!"), flags=re.I)
        if not t or len(t.split()) > 3:
            return None
        if t.isupper() and len(t) > 3:
            t = t.capitalize()  # a shouted word ("HERO"), never a short abbreviation ("USA")
        out.append(t[0].upper() + t[1:])
    return out


VOTE_TITLE, VOTE_ACCENT = "Your verdict?", "Vote below"
_FOLLOW = re.compile(r"[^.!?]*\bfollow\b[^.!?]*[.!]\s*", re.I)


def add_vote_items(project: Any) -> None:
    """Gives the outro its two vote options (drawn as two tablets) from the pinned comment, which repeats the same choice the narration ends with. Existing items are kept.
    With a vote on screen the outro is about the vote: its headline asks for the verdict and its narration drops the "Follow for more" sentence, so the last thing said is the question."""
    outro = project.scenes[-1] if project.scenes else None
    if outro is None or outro.type != "outro":
        return
    if not outro.items:
        opts = vote_options(getattr(project, "pinned_comment", "") or "")
        if opts:
            outro.items = opts
    if not outro.items or len(outro.items) != 2:
        return
    outro.text, outro.accentText = VOTE_TITLE, VOTE_ACCENT
    rest = _FOLLOW.sub("", outro.narration or "").strip()
    if rest.endswith("?") and len(rest.split()) >= 3:
        outro.narration = rest


# --------------------------------------------------------------------------------------------------------------------------------------------------------------------- validators

_NUM_WORDS = {"zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10, "twenty": 20, "thirty": 30, "forty": 40, "fifty": 50,
              "sixty": 60, "seventy": 70, "eighty": 80, "ninety": 90, "hundred": 100, "thousand": 1000, "million": 1_000_000, "billion": 1_000_000_000}
_TEENS = r"\b(?:eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\b"


def _said(value: float, narration: str) -> bool:
    """True when `value` appears in the narration as digits or as a spoken number (loose: any digit within 6 % or any number word)."""
    text = narration.lower().replace(",", "")
    if not text.strip():
        return False
    digits = [float(x) for x in re.findall(r"\d+(?:\.\d+)?", text)]
    if any(abs(d - value) < 1e-6 or (value and abs(d - value) / value < 0.06) for d in digits):
        return True
    return any(w in _NUM_WORDS for w in re.findall(r"[a-z]+", text)) or bool(re.search(_TEENS, text))


def _two_sided_problems(i: int, s: MotionSceneModel) -> List[str]:
    out: List[str] = []
    if not (s.left and s.right and len(s.left) <= 16 and len(s.right) <= 16):
        out.append(f"scene {i}: versus needs `left` and `right` names of at most 16 characters")
    if not (s.leftValue and s.rightValue and s.leftValue > 0 and s.rightValue > 0):
        out.append(f"scene {i}: versus needs positive leftValue and rightValue")
    elif not (_said(s.leftValue, s.narration) or _said(s.rightValue, s.narration)):
        out.append(f"scene {i}: the versus figures must be said in that scene's narration (no decorative figures)")
    if not s.unit:
        out.append(f"scene {i}: versus needs a `unit` (what the figures count)")
    return out


def _timeline_problems(i: int, s: MotionSceneModel) -> List[str]:
    rows = [it.split("|", 1) for it in (s.items or []) if "|" in it]
    if not (3 <= len(s.items or []) <= 5) or len(rows) != len(s.items or []):
        return [f"scene {i}: timeline needs 3-5 \"when|label\" items"]
    out: List[str] = []
    if any(not (0 < len(r[0].strip()) <= 8) or not (0 < len(r[1].strip()) <= 28) for r in rows):
        out.append(f"scene {i}: timeline `when` is at most 8 characters and the label at most 28")
    years = [r[0].strip() for r in rows]
    if all(re.fullmatch(r"\d{3,4}", y) for y in years) and years != sorted(years, key=int):
        out.append(f"scene {i}: timeline years must be in chronological order")
    return out


def _map_problems(i: int, s: MotionSceneModel) -> List[str]:
    rows = [it.split("|") for it in (s.items or [])]
    if not (2 <= len(rows) <= 5) or any(len(r) != 3 for r in rows):
        return [f"scene {i}: map needs 2-5 \"Place|x|y\" items"]
    try:
        coords = [(float(r[1]), float(r[2])) for r in rows]
    except ValueError:
        return [f"scene {i}: map x and y must be numbers from 0 to 100"]
    out: List[str] = []
    if any(not (0 <= x <= 100 and 0 <= y <= 100) for x, y in coords):
        out.append(f"scene {i}: map x and y are between 0 and 100")
    if any(not (0 < len(r[0].strip()) <= 18) for r in rows):
        out.append(f"scene {i}: map place names are at most 18 characters")
    if len(set(coords)) != len(coords):
        out.append(f"scene {i}: two places of the map sit at the same spot")
    return out


def _scene_problems(i: int, s: MotionSceneModel) -> List[str]:
    out: List[str] = []
    words = len(s.text.split())
    if s.type == "statement" and (words > 9 or (s.accentText and len(s.accentText.split()) > 5)):
        out.append(f"scene {i}: a statement is at most 8 words with an accent of at most 4")
    if s.type == "statement" and not (s.accentText or "").strip():
        out.append(f"scene {i}: a statement needs an accentText (the underlined phrase)")
    if s.type == "date":
        if not s.value or s.value <= 0 or s.value > 2100:
            out.append(f"scene {i}: a date scene needs `value`, the year as a whole number")
        elif s.value < 1000 and s.unit not in ("AD", "BC"):
            out.append(f"scene {i}: a year before 1000 needs `unit` AD or BC")
        if not (s.kicker or "").strip():
            out.append(f"scene {i}: a date scene needs `kicker`, the place")
        if not (s.accentText or "").strip() or len(s.accentText.split()) > 9:
            out.append(f"scene {i}: a date scene needs `accentText`, what happened (at most 8 words)")
    if s.type == "timeline":
        out += _timeline_problems(i, s)
    if s.type == "map":
        out += _map_problems(i, s)
    if s.type == "quote":
        if not (s.accentText or "").strip() or len(s.accentText.split()) > 6:
            out.append(f"scene {i}: a quote needs accentText: who said it (at most 6 words)")
        elif not any(re.sub(r"[^a-z]", "", w.lower()) in re.sub(r"[^a-z ]", "", s.narration.lower()).split() for w in s.accentText.split() if len(w) > 3):
            out.append(f"scene {i}: the narration of a quote scene must name who said it")
        if words > 30:
            out.append(f"scene {i}: a quotation is at most 30 words")
    if s.type == "ledger":
        if s.value is None or s.value <= 0:
            out.append(f"scene {i}: ledger needs a positive whole `value`")
        elif not _said(s.value, s.narration):
            out.append(f"scene {i}: the ledger figure {s.value:g} must be said in that scene's narration (no decorative figures)")
        if not (s.unit or "").strip():
            out.append(f"scene {i}: ledger needs a `unit` saying what the figure counts")
    if s.type == "versus":
        out += _two_sided_problems(i, s)
    if s.type == "list" and not (s.items and 2 <= len(s.items) <= 4 and all(len(x.split()) <= 7 for x in s.items)):
        out.append(f"scene {i}: list needs 2-4 items of at most 6 words")
    if s.type == "verdict":
        if not s.verdict:
            out.append(f"scene {i}: verdict scenes need `verdict` (myth, fact or partly)")
        if not (s.accentText or "").strip() or len(s.accentText.split()) > 6:
            out.append(f"scene {i}: a verdict scene needs accentText: the one-line truth (at most 6 words)")
    if s.type == "flash" and words > 3:
        out.append(f"scene {i}: a flash scene is one to three words")
    return out


def _art_problems(i: int, s: MotionSceneModel) -> List[str]:
    if not s.art:
        return [] if s.type in ART_OPTIONAL else [f"scene {i}: every scene except flash, map and outro needs `art`: 1-2 illustration shots (place, time, subjects)"]
    out = []
    if len(s.art) > 2:
        out.append(f"scene {i}: at most two illustration shots per scene")
    for sh in s.art:
        unknown = [x for x in sh.subjects if x not in SUBJECTS]
        if unknown:
            out.append(f"scene {i}: unknown subject(s) {', '.join(unknown)}: use only names from the subject lists")
        if not 1 <= len(sh.subjects) <= 4 or len(set(sh.subjects)) != len(sh.subjects):
            out.append(f"scene {i}: a shot has 1-4 different subjects")
    return out


def story_problems(p: MotionProject) -> List[str]:
    """The pictures must tell the story through its people: most shots show a person doing something, the actions vary and one protagonist keeps coming back.
    Only generated scripts are held to this."""
    shots = [sh for sc in p.scenes for sh in (sc.art or [])]
    if len(shots) < 8:
        return []
    out: List[str] = []
    people = [sh for sh in shots if any(x in HUMANS for x in sh.subjects)]
    if len(people) < 0.6 * len(shots):
        out.append(f"only {len(people)} of {len(shots)} illustration shots show a person: the characters live the story, so at least 60% of the shots need a person (a named character, soldiers, king, crowd...) as a subject")
    acting = [sh for sh in people if sh.action]
    if len(acting) < 0.7 * len(people):
        out.append("give every shot with people an `action` (what they are doing): the viewer follows the story through what the characters do")
    if len({sh.action for sh in acting}) < 4:
        out.append("use at least four different `action` values across the video (run, kneel, point, shout, fall, write, surrender...)")
    seen: Dict[str, int] = {}
    for sh in people:
        for x in sh.subjects:
            if x in HUMANS:
                seen[x] = seen.get(x, 0) + 1
    if not seen or max(seen.values()) < 3:
        out.append("one protagonist (the same character subject) must appear in at least three shots, so the viewer follows somebody through the story")
    return out


def fix_art_for_era(project: Any) -> int:
    """Removes the subjects that did not exist in the video's era (a tank in ancient Rome) once the look is known; a shot left empty gets a crowd. Returns how many subjects were dropped."""
    dropped = 0
    for s in project.scenes:
        for sh in s.art or []:
            keep = [x for x in sh.subjects if era_allows(x, project.look or "manuscript")]
            dropped += len(sh.subjects) - len(keep)
            sh.subjects = keep or ["crowd"]
    return dropped


def _count(p: MotionProject, kind: str) -> int:
    return sum(1 for s in p.scenes if s.type == kind)


def _needs_dates_and(*others: str) -> Callable[[MotionProject], Optional[str]]:
    def check(p: MotionProject) -> Optional[str]:
        if not _count(p, "date"):
            return "needs at least one `date` scene (the year and the place)"
        if others and not any(_count(p, t) for t in others):
            return "needs at least one " + " or ".join(f"`{t}`" for t in others) + " scene"
        return None
    return check


def _needs_duel(p: MotionProject) -> Optional[str]:
    rounds = [s for s in p.scenes if s.type == "versus"]
    if not 3 <= len(rounds) <= 5:
        return f"duel videos need 3-5 versus scenes (found {len(rounds)})"
    if len({(s.left, s.right) for s in rounds}) > 1:
        return "every versus scene must use the same `left` and `right` names"
    return None


def _needs_lies(p: MotionProject) -> Optional[str]:
    v = [s.verdict for s in p.scenes if s.type == "verdict"]
    if not 4 <= len(v) <= 6:
        return f"lies videos need 4-6 verdict scenes (found {len(v)})"
    if sum(1 for x in v if x in ("myth", "partly")) < 3 or "fact" not in v:
        return "lies videos need at least 3 myth/partly verdicts and at least one fact"
    return None


def _needs_whatif(p: MotionProject) -> Optional[str]:
    if not re.match(r"^\W*what if\b", p.scenes[0].narration.strip(), re.I):
        return "scene 1's narration must start with \"What if\""
    if not _count(p, "date"):
        return "needs a `date` scene with the REAL event and its real date"
    if not re.search(r"\b(historians|likely|might|may have|could have|probably|perhaps)\b", " ".join(s.narration for s in p.scenes), re.I):
        return "the consequences must be hedged (\"historians think\", \"it is likely\", \"might\"): never state speculation as fact"
    return None


def _needs_journey(p: MotionProject) -> Optional[str]:
    maps = [s for s in p.scenes if s.type == "map"]
    if not maps or not any(len(s.items or []) >= 3 for s in maps):
        return "journey videos need a `map` scene with at least 3 places"
    if not _count(p, "date"):
        return "needs a `date` scene for the start of the journey"
    return None


def _needs_dayinlife(p: MotionProject) -> Optional[str]:
    if _count(p, "timeline") != 1:
        return "a dayinlife video needs exactly ONE timeline scene (the hours of the day)"
    tl = next(s for s in p.scenes if s.type == "timeline")
    if len(tl.items or []) < 4:
        return "the dayinlife timeline needs 4-5 hours"
    if not _count(p, "date"):
        return "needs a `date` scene for the year and the place"
    return None


def _needs_portrait(p: MotionProject) -> Optional[str]:
    if _count(p, "date") < 2:
        return "a portrait needs at least two `date` scenes (a birth or rise, and a decisive moment or the end)"
    if not _count(p, "timeline"):
        return "a portrait needs a `timeline` of the life's key years"
    if _count(p, "quote") > 1:
        return "at most one quote in a portrait"
    return None


FORMAT_NEEDS: Dict[str, Callable[[MotionProject], Optional[str]]] = {
    "mystery": lambda p: _needs_dates_and("timeline", "list", "map")(p),
    "dayinlife": _needs_dayinlife,
    "turning": lambda p: _needs_dates_and("timeline")(p),
    "lies": _needs_lies,
    "whatif": _needs_whatif,
    "duel": _needs_duel,
    "journey": _needs_journey,
    "portrait": _needs_portrait,
}


def _format_problems(p: MotionProject, fmt: Optional[str]) -> List[str]:
    if fmt is None or fmt not in FORMAT_NEEDS or not p.scenes:
        return []
    msg = FORMAT_NEEDS[fmt](p)
    return [f"{fmt} format: {msg}"] if msg else []


BAD_OPENER = re.compile(r"^\W*(so\b|welcome|hey\b|hi\b|hello|today|in this video|did you know|have you ever|do you know|let(?:'?s| us)|ever wonder)", re.I)
GENERIC_CLOSER = re.compile(r"surprise you or|tell me below|know it or|did you know it|do you agree with this|what do you think", re.I)  # a vote must name this video's own two options
OPEN_LOOP = re.compile(
    r"\b(wait for|stay (?:to|till|until|for|with)|by the end|until the end|in a moment|in a second|before we (?:finish|end)|later on|catch|twist|nobody|no one|most people|secret|"
    r"gets (?:worse|weirder|stranger|better)|the (?:last|final|third|second|next) (?:one|reason|part|step|round|rule|trick|piece)|you will not believe|that is not even|that is not the)\b", re.I)
HEADLINE = ("statement",)
HOOK_MAX_WORDS = 16  # the prompt asks for 14; two more words of tolerance
SCENE_MAX_WORDS = 17  # about 6.5 s of speech: beyond that the screen sits still for too long


def retention_problems(p: MotionProject) -> List[str]:
    """Style checks: a cold open, an open loop early on, a visual break at least every third scene and a two-option vote at the end.
    Only generated scripts are held to these; hand-written scripts are measured with `scripts/lint_retention.py`."""
    out: List[str] = []
    if not p.scenes:
        return out
    hook = p.scenes[0].narration.strip()
    if BAD_OPENER.search(hook):
        out.append("scene 1 must be a cold open: the claim itself, never a greeting, \"so\", \"today\", \"in this video\", \"did you know\" or \"have you ever wondered\"")
    if len(hook.split()) > HOOK_MAX_WORDS:
        out.append(f"scene 1 narration has {len(hook.split())} words: the cold open is at most 14 words, the claim and nothing else")
    if not any(OPEN_LOOP.search(s.narration) for s in p.scenes[1:5]):
        out.append("scenes 2-5 need an open loop: one narration line that promises a later payoff (for example \"And the last one is the one most people miss.\" or \"Stay to the end, the catch comes last.\")")
    if not re.search(r"\bor\b[^?]*\?", p.scenes[-1].narration):
        out.append("the outro narration must end with a two-option vote (\"A or B?\"), not an open question")
    if GENERIC_CLOSER.search(p.scenes[-1].narration + " " + p.pinned_comment):
        out.append("the closing vote is the generic one (\"what do you think\", \"tell me below\"): ask a question about THIS video's own two options, named in the question (\"Team Rome or team Carthage?\")")
    if not (re.search(r"\bor\b", p.pinned_comment) and "?" in p.pinned_comment) or len(p.pinned_comment) > 120:
        out.append("pinned_comment must be the same two-option vote (\"A or B? Reply with one word.\"), at most 120 characters")
    cap = 24 if any(s.type == "versus" for s in p.scenes) else SCENE_MAX_WORDS  # duel scenes carry two figures, so they may be wordier
    long_ones = [i for i, s in enumerate(p.scenes, 1) if len(s.narration.split()) > cap]
    if long_ones:
        out.append(f"scene {long_ones[0]} narration is longer than {cap} words: a visual change at least every 5 seconds, so split it across two scenes")
    run = 0
    for i, s in enumerate(p.scenes, 1):
        run = run + 1 if s.type in HEADLINE else 0
        if run > 2:
            out.append(f"scenes {i - 2}-{i} are three statement scenes in a row: break the rhythm with a date, timeline, map, ledger, list, versus, verdict or flash scene")
            break
    return out


def make_validator(facts: Optional[str] = None, fmt: Optional[str] = None, retention: bool = False):
    """Validator for generate_structured. `fmt` is the content format; `retention` adds the cold-open / open-loop / pattern-break style checks (on for generated scripts)."""
    def validate_project(p: MotionProject) -> List[str]:
        _repair(p)
        out: List[str] = _format_problems(p, fmt)
        if retention:
            out += retention_problems(p)
            out += story_problems(p)
        n = len(p.scenes)
        compact = fmt == "duel"  # a duel is built from a run of versus scenes, so it has fewer, wordier scenes
        if not (8 if compact else 10) <= n <= 21:
            out.append(f"{n} scenes (need {'9-19' if compact else '11-19'})")
        words, est = p.narration_words, estimated_seconds(p)
        if any(len(s.narration.split()) < 3 for s in p.scenes):
            out.append("every scene needs a narration (3-16 words; short is fine for a one-word flash scene)")
        if any(len(s.narration.split()) > (26 if compact else 20) for s in p.scenes):
            out.append(f"a scene narration is longer than {26 if compact else 20} words")
        if not 61.0 <= est <= MAX_SECONDS:  # just over 60 s is enough for monetisation
            out.append(f"narration has {words} words across {n} scenes (about {est:.0f} s): it must come to 61-{MAX_SECONDS:.0f} s (aim for roughly 135-190 words, about 11 per scene)")
        if p.scenes and p.scenes[-1].type != "outro":
            out.append("the last scene must be type outro")
        if p.scenes and p.scenes[0].type != "statement":
            out.append("the first scene must be a statement")
        flashes = [i for i, s in enumerate(p.scenes) if s.type == "flash"]
        if len(flashes) > 2 or any(b - a < 4 for a, b in zip(flashes, flashes[1:])):
            out.append("at most two flash scenes, at least four scenes apart")
        if sum(1 for s in p.scenes if s.type == "quote") > 2:
            out.append("at most two quote scenes")
        if any(s.type == "image" for s in p.scenes):
            out.append("image scenes are not available yet: use the other scene types")
        fix_duplicate_accents(p.scenes)
        seen_shots: set = set()
        for i, s in enumerate(p.scenes, 1):
            out += _scene_problems(i, s)
            out += _art_problems(i, s)
            for sh in s.art or []:
                key = (sh.place, sh.time, tuple(sh.subjects))
                if key in seen_shots:
                    out.append(f"scene {i}: an illustration shot is repeated: every shot of the video must be different")
                seen_shots.add(key)
            if i > 1 and s.type == p.scenes[i - 2].type and s.type not in ("outro", "versus", "verdict"):
                out.append(f"scenes {i - 1} and {i} have the same type")
        if not looks_english(p.all_text):
            out.append("the text is not English: everything must be American English")
        return out
    return validate_project


# --------------------------------------------------------------------------------------------------------------------------------------------------------------------- fact-check


class _Issue(BaseModel):
    scene: int
    problem: str
    definitely_wrong: bool
    fixed_verdict: Optional[Literal["myth", "fact", "partly"]] = Field(default=None, description="For a verdict scene whose stamp is wrong: the correct stamp (the narration is then rewritten to agree with it)")
    fixed_narration: Optional[str] = Field(default=None, description="For a definitely_wrong issue: a replacement narration for that scene (8-16 words) that is TRUE")


class _Review(BaseModel):
    errors: List[_Issue] = Field(default_factory=list)


def _review_prompt(p: MotionProject, facts: Optional[str]):
    rows = []
    for i, s in enumerate(p.scenes, 1):
        extra = ""
        if s.type == "versus":
            extra = f" | VERSUS: {s.left} = {s.leftValue:g} {s.unit or ''} vs {s.right} = {s.rightValue:g} {s.unit or ''}, winner: {s.winner or 'the bigger figure'}" if s.leftValue and s.rightValue else " | VERSUS (figures missing)"
        elif s.type == "verdict":
            extra = f" | CLAIM VERDICT: the claim is stamped {(s.verdict or '?').upper()}; the truth on screen is \"{s.accentText}\""
        elif s.type == "date":
            extra = f" | DATE: {int(s.value or 0)} {s.unit or ''} at {s.kicker}: {s.accentText}"
        elif s.type == "quote":
            extra = f" | QUOTE by {s.accentText}"
        art = " | PICTURES: " + "; ".join(f"{sh.place}, {sh.time}, {', '.join(sh.subjects)}" for sh in s.art) if s.art else ""
        rows.append(f"{i}. [{s.type}] {s.text} | narration: \"{s.narration}\" | accent: {s.accentText or '-'} | value: {s.value if s.value is not None else '-'} {s.unit or ''} | items: {s.items or '-'}{extra}{art}")
    rule = (" You are given the SOURCE TEXT. Any claim about the subject (names, dates, figures, who said what) that the SOURCE TEXT does not state or clearly imply is definitely_wrong, even if it sounds plausible; "
            "fixed_narration must then use only what the text supports." if facts else "")
    fmt_rule = (" Scenes of type date state a year and a place: flag a wrong year or place. timeline scenes list milestones as when|label: flag a wrong year or a wrong order. map scenes list places in route order: flag a place that is not part of the story. "
                "versus scenes compare two contenders on one metric: flag any figure that is clearly wrong and a winner that contradicts the figures. quote scenes attribute a quotation: flag any quotation that is invented, misattributed or not well documented. "
                "verdict scenes stamp a belief MYTH, FACT or PARTLY: flag a stamp that is wrong. Counterfactual (what if) claims must be hedged: flag any consequence stated as a fact. PICTURES list the animated drawing shown while the narrator speaks: flag a picture whose place or hero clearly contradicts the narration (a desert for a sea battle).")
    system = ("You are a strict but fair historian and fact-checker. List in `errors` only statements that are clearly FALSE, anachronistic or misleading, names or places that are wrong, "
              "and numbers that are clearly wrong (check arithmetic). Simplifications for a general audience are fine: mark definitely_wrong=false for those or leave them out. "
              "Where historians genuinely disagree, a statement is fine only if it says so. For every definitely_wrong issue also give fixed_narration (and fixed_verdict when a verdict stamp is the error)." + rule + fmt_rule)
    prompt = f"Topic: {p.topic}" + (f"\nSOURCE TEXT:\n{facts}\n" if facts else "") + "\nScenes:\n" + "\n".join(rows) + "\n\nFact-check this history script."
    return prompt, system


def fact_check(p: MotionProject, facts: Optional[str] = None) -> List[_Issue]:
    """Second pass: the blocking issues (false claims, wrong dates or figures, invented quotes), each with a replacement narration.

    Tiered so that it keeps working whatever fails: (1) the strongest reviewer, retried once after a pause if its per-minute window is full; (2) a PANEL of every other
    reviewer that answers, whose issues are merged (stricter than any one of them); raises GeminiUnavailable only when no reviewer answered at all."""
    prompt, system = _review_prompt(p, facts)
    kw = dict(prompt=prompt, system_instruction=system, schema=_Review, temperature=0.1, max_output_tokens=2500)  # small: the free tier meters prompt + reserved output per minute
    for attempt in (1, 2):
        try:
            review, _t, model = generate_structured(**kw, provider_first="cloudflare", provider_models=STRONG_REVIEWERS, strict_provider=True)
            bad = [e for e in review.errors if e.definitely_wrong]
            logger.info("Fact-check via %s: %d blocking issue(s).", model, len(bad))
            return bad
        except GeminiUnavailable as exc:
            logger.warning("Strong reviewer unavailable (%s)%s", str(exc)[:100], "; retrying in 25 s." if attempt == 1 else ".")
            if attempt == 1:
                time.sleep(25)
    merged: Dict[tuple, _Issue] = {}
    answered: List[str] = []
    panel = [dict(provider_first="cloudflare", provider_models=["@cf/meta/llama-3.3-70b-instruct-fp8-fast"], strict_provider=True),
             dict()]  # last: the default chain (Gemini first)
    for opts in panel:
        try:
            review, _t, model = generate_structured(**kw, **opts)
        except GeminiUnavailable as exc:
            logger.warning("Panel reviewer %s unavailable: %s", opts.get("provider_first", "gemini"), str(exc)[:80])
            continue
        answered.append(model)
        for e in review.errors:
            if e.definitely_wrong:
                merged.setdefault((e.scene, e.problem[:40]), e)
    if not answered:
        raise GeminiUnavailable("no reviewer answered")
    logger.info("Fact-check by panel %s: %d blocking issue(s) merged.", answered, len(merged))
    return list(merged.values())


def _apply_fixes(p: MotionProject, issues: List[_Issue]) -> int:
    """Replaces the narration of the flagged scenes with the reviewer's corrected text. Returns how many were applied."""
    done = 0
    for e in issues:
        if not 1 <= e.scene <= len(p.scenes):
            continue
        sc = p.scenes[e.scene - 1]
        if e.fixed_verdict and sc.type == "verdict" and e.fixed_verdict != sc.verdict:
            sc.verdict = e.fixed_verdict
            done += 1
        if e.fixed_narration and 3 <= len(e.fixed_narration.split()) <= 20:
            sc.narration = e.fixed_narration.strip()
            done += 1
    return done


# --------------------------------------------------------------------------------------------------------------------------------------------------------------------- generation


def generate_motion_project(topic: Optional[str] = None, avoid_topics: Optional[List[str]] = None, facts: Optional[str] = None, attempts: int = 3, fmt: Optional[str] = None) -> MotionProject:
    """A validated, fact-checked history project of the given format (None = a free-form history).
    Raises GeminiUnavailable when no provider answers, RuntimeError if every attempt fails the checks."""
    avoid = [t for t in (avoid_topics or []) if t][-25:]
    if fmt is not None and fmt not in FORMATS:
        raise ValueError(f"unknown format {fmt!r}: use one of {FORMATS}")
    system = SYSTEM_PROMPT + RETENTION_RULES + (FACTS_RULES.format(facts=facts) if facts else "")
    name = fmt or "history"
    if fmt:
        system += FORMAT_RULES[fmt]
    if topic:
        base = f"Make a {name} video about: {topic}\n"
    elif fmt:
        base = f"Make a {fmt} video (the format is described in the rules). {TOPIC_HINTS[fmt]} Choose a subject you know very well and that has many documented details.\n"
    else:
        base = "Pick ONE fascinating, well documented story of history that works well as a short illustrated video, and tell it.\n"
    if avoid:
        base += "Do NOT repeat or resemble these topics: " + "; ".join(avoid) + "\n"
    feedback = ""
    validator = make_validator(facts, fmt, retention=True)
    for attempt in range(1, attempts + 1):
        project, tokens, model = generate_structured(prompt=base + feedback + "Return a JSON object matching the schema.", system_instruction=system, schema=MotionProject,
                                                     temperature=0.8, validate=validator, max_output_tokens=12000, max_passes=3)
        project.kind, project.format = "history", fmt
        project.gemini_input_tokens, project.gemini_output_tokens = tokens
        problems: List[_Issue] = []
        try:
            for rnd in range(1, 4):  # the reviewer both flags and fixes narration: apply its fixes and look again before giving up on the script
                problems = fact_check(project, facts)
                if not problems:
                    break
                logger.warning("Fact-check round %d (attempt %d): %s", rnd, attempt, " | ".join(f"scene {e.scene}: {e.problem}" for e in problems)[:300])
                if rnd == 3 or not _apply_fixes(project, problems) or validator(project):
                    break
        except GeminiUnavailable as exc:
            logger.warning("Fact-check unavailable (%s): the video will not be uploaded automatically.", str(exc)[:100])
            project.fact_checked = False
            return project
        if not problems and not validator(project):
            logger.info("History project '%s' ready via %s: %d scenes, about %.0f s.", project.topic, model, len(project.scenes), estimated_seconds(project))
            return project
        feedback = "A previous attempt was rejected by the fact-checker for: " + "; ".join(f"scene {e.scene}: {e.problem}" for e in problems) + ". Write a different, accurate script.\n"
    raise RuntimeError(f"{attempts} consecutive scripts failed the fact-check; nothing produced.")
