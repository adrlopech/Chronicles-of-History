"""Hand-made scripts of the second batch (data/scripts/*.json), checked against the generator's own validator.

    .venv/bin/python scripts/write_batch2_scripts.py

Used when the LLMs are down: every fact is well documented and hedged where sources differ ("reportedly", "by tradition").
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from services.motion_generator import MotionProject, make_validator  # noqa: E402
from write_era_scripts import scene, shot  # noqa: E402

SCRIPTS = {}

# ---------------------------------------------------------------------------------------------------------------------------------------------------------------- antiquity
SCRIPTS["caesar_rubicon"] = dict(
    format="turning", look="antiquity", topic="Caesar crosses the Rubicon, 49 BC",
    screen_title="The Rubicon", title="Caesar Crosses the Rubicon, 49 BC #history #rome",
    description="In 49 BC Julius Caesar stood at a small river in northern Italy. One step would start a civil war. This is the choice that ended the Roman Republic.",
    tags=["history", "rome", "julius caesar", "rubicon", "roman republic", "civil war", "ancient history"],
    pinned_comment="Genius or mistake? Reply with one word.",
    scenes=[
        scene("statement", "One step across a small river, and Rome could never go back.",
              [shot("plains", "dawn", ["legionary", "centurion", "aqueduct"], "stand", "back"), shot("coast", "dawn", ["legionary", "torch", "banner"], "watch", "side")],
              text="One river, no way back", accentText="A point of no return", kicker="Caesar", icon="sword"),
        scene("date", "By tradition it is January the tenth, forty-nine BC, at the Rubicon in northern Italy.",
              [shot("plains", "dusk", ["centurion", "legionary", "gate"], "point", "side")],
              text="49 BC", value=49, unit="BC", kicker="The Rubicon, Italy", accentText="Caesar halts at a river"),
        scene("statement", "Roman law forbade generals to bring armies across. Stay to the end, the catch comes last.",
              [shot("interior", "night", ["senator", "roman_emperor", "torch"], "threaten", "front"), shot("plaza", "day", ["senator", "crowd", "triumphal_arch"], "shout", "front")],
              text="No army may cross", accentText="Roman law"),
        scene("list", "He could disband his army and face trial, wait and bargain, or cross and fight.",
              [shot("interior", "dusk", ["centurion", "scribe", "scroll"], "think", "side")],
              text="His three choices", items=["Disband and face trial", "Wait and bargain", "Cross and fight"]),
        scene("statement", "He crossed. According to the writer Suetonius, he said, the die is cast.",
              [shot("coast", "dawn", ["centurion", "legionary", "torch"], "run", "side"), shot("plains", "dawn", ["legionary", "centurion", "horse"], "salute", "front")],
              text="The die is cast", accentText="Alea iacta est"),
        scene("ledger", "He reportedly had only one legion with him, about five thousand men.",
              [shot("plains", "day", ["legionary", "centurion", "banner"], "walk", "side")],
              text="Men who crossed with him", value=5000, unit="soldiers", accentText="one legion, reportedly"),
        scene("timeline", "Civil war followed. Pompey fled, lost at Pharsalus, and Caesar became dictator.",
              [shot("battlefield", "dusk", ["legionary", "centurion", "cavalry"], "slash", "side", "smoke")], frames=180,
              text="The war that followed", items=["49 BC|Civil war begins", "48 BC|Pharsalus", "46 BC|Caesar dictator", "44 BC|Caesar killed"]),
        scene("date", "On the Ides of March, forty-four BC, senators stabbed him in Rome.",
              [shot("plaza", "day", ["senator", "roman_emperor", "triumphal_arch"], "stab", "front")],
              text="44 BC", value=44, unit="BC", kicker="Rome", accentText="Caesar is assassinated"),
        scene("statement", "Had he stopped at the river, the republic might have lasted longer, though most historians doubt it.",
              [shot("interior", "night", ["senator", "scribe", "scroll"], "shrug", "front")],
              text="If he had stopped", accentText="A republic saved?"),
        scene("list", "The republic was already cracking from years of rival armies, and within decades Rome had an emperor.",
              [shot("city", "day", ["roman_emperor", "legionary", "colosseum"], "stand", "front")],
              text="A republic already cracking", items=["Years of civil wars", "Generals with armies", "Then came Augustus"]),
        scene("flash", "The die was cast.", text="Cast"),
        scene("outro", "So was crossing the Rubicon genius or a mistake?", text="Genius or mistake?", items=["Genius", "Mistake"]),
    ],
)

# ---------------------------------------------------------------------------------------------------------------------------------------------------------------- age of sail
SCRIPTS["roanoke_colony"] = dict(
    format="mystery", look="seachart", topic="The lost colony of Roanoke",
    screen_title="The Lost Colony", title="The Lost Colony of Roanoke #history #mystery",
    description="In 1590 an English governor came back to Roanoke Island and found the settlement empty, with a single word carved on a post. Here is what we know, and the two theories.",
    tags=["history", "roanoke", "lost colony", "virginia dare", "mystery", "american history", "english colonies"],
    pinned_comment="Joined them or perished? Reply with one word.",
    scenes=[
        scene("statement", "A hundred settlers vanished, and left behind a single carved word.",
              [shot("coast", "dusk", ["explorer", "navigator", "ship"], "point", "side"), shot("forest", "dawn", ["explorer", "sailor", "torch"], "watch", "back")],
              text="A whole colony gone", accentText="One carved word", kicker="Roanoke", icon="key"),
        scene("date", "In fifteen eighty-seven, about a hundred and fifteen English settlers land on Roanoke Island.",
              [shot("coast", "day", ["explorer", "sailor", "ship"], "walk", "side")],
              text="1587", value=1587, unit="AD", kicker="Roanoke Island, Carolina", accentText="The colony lands"),
        scene("statement", "Virginia Dare is born there. Stay to the end, the catch comes last.",
              [shot("forest", "day", ["explorer", "missionary", "native_chief"], "cheer", "front"), shot("coast", "dawn", ["sailor", "explorer", "pioneer_woman"], "carry", "side")],
              text="First English child", accentText="Virginia Dare"),
        scene("timeline", "Governor John White sails home for supplies, but war with Spain keeps him away for three years.",
              [shot("sea", "day", ["sailor", "navigator", "ship"], "lean", "side")], frames=180,
              text="The long wait", items=["1587|White sails home", "1588|The Armada delays him", "1590|He returns"]),
        scene("date", "He returns on the eighteenth of August, fifteen ninety, his granddaughter's third birthday. The houses are gone.",
              [shot("coast", "dusk", ["explorer", "sailor", "ruins"], "kneel", "front")],
              text="1590", value=1590, unit="AD", kicker="Roanoke Island", accentText="The settlement is empty"),
        scene("statement", "On a post he finds the word Croatoan, and no distress cross.",
              [shot("forest", "dusk", ["explorer", "sailor", "palisade"], "read", "front"), shot("coast", "night", ["explorer", "torch", "ruins"], "point", "side")],
              text="Carved on a post", accentText="CROATOAN"),
        scene("map", "Croatoan was an island to the south, and the Chesapeake lay far to the north.",
              [], text="Where could they have gone?",
              items=["Roanoke Island|35.92|-75.70", "Croatoan Island|35.22|-75.70", "Chesapeake Bay|37.00|-76.30"], accentText="Three places in the story"),
        scene("statement", "One theory says they moved south and lived with the Croatoan people.",
              [shot("forest", "day", ["native_chief", "explorer", "tipi"], "wave", "front")],
              text="Theory one", accentText="They joined them"),
        scene("list", "Archaeologists have found a few English objects on Hatteras Island, though none prove it.",
              [shot("coast", "day", ["scholar", "explorer", "tents"], "dig", "side")],
              text="Clues for theory one", items=["The word on the post", "A few English objects", "Native oral stories"]),
        scene("statement", "Other historians argue they headed north toward the Chesapeake, where some may have died.",
              [shot("forest", "dusk", ["explorer", "sailor", "native_chief"], "sneak", "side")],
              text="Theory two", accentText="They went north"),
        scene("ledger", "In all, about one hundred and fifteen people vanished.",
              [shot("coast", "night", ["explorer", "pioneer_woman", "torch"], "cower", "front")],
              text="People who vanished", value=115, unit="settlers", accentText="no proven grave"),
        scene("statement", "What is missing is proof: no letter and no grave that anyone can tie to them.",
              [shot("forest", "night", ["scholar", "explorer", "torch"], "think", "front")],
              text="What is missing", accentText="Any proof"),
        scene("flash", "Lost, but not forgotten.", text="Lost"),
        scene("outro", "So did they join the Croatoan or did they perish?", text="Joined or perished?", items=["Joined them", "Perished"]),
    ],
)

# ---------------------------------------------------------------------------------------------------------------------------------------------------------------- middle ages
SCRIPTS["viking_sailor_day"] = dict(
    format="dayinlife", look="manuscript", topic="A day in the life of a Viking sailor in 900 AD",
    screen_title="The Viking Sailor", title="A Day as a Viking Sailor in 900 AD #history #vikings",
    description="You sleep on the deck, eat dried fish and row when the wind dies. This is a day in the life of a Viking sailor, from what historians know.",
    tags=["history", "vikings", "norse", "longship", "daily life", "middle ages", "sailors"],
    pinned_comment="Take the oar or stay home? Reply with one word.",
    scenes=[
        scene("statement", "You will eat, sleep and row on an open deck, with no cabin at all.",
              [shot("sea", "dawn", ["viking", "sailor", "ship"], "lean", "back"), shot("coast", "dawn", ["jarl", "viking", "galley"], "watch", "side")],
              text="No cabin, no bed", accentText="Open to the sea", kicker="Viking sailor", icon="ship"),
        scene("date", "It is the year nine hundred, and you sail a Norse longship across the North Sea.",
              [shot("sea", "day", ["viking", "jarl", "ship"], "stand", "side")],
              text="900", value=900, unit="AD", kicker="The North Sea, a sailor", accentText="A Norse crew sets out"),
        scene("statement", "Most sailors were also farmers. Stay to the end, the catch comes last.",
              [shot("plains", "dawn", ["viking", "farmer", "longhouse"], "carry", "side"), shot("coast", "day", ["viking", "sailor", "harbor"], "push", "side")],
              text="A farmer who sails", accentText="A seasonal crew"),
        scene("timeline", "Your day follows the wind: you wake at dawn, row, eat, sail, and sleep under the stars.",
              [shot("coast", "dusk", ["jarl", "viking", "ship"], "walk", "side")], frames=180,
              text="Your day at sea", items=["5 AM|Wake on deck", "8 AM|Row against the wind", "12 PM|Eat dried fish", "4 PM|Raise the sail", "9 PM|Sleep under the sky"]),
        scene("statement", "At dawn you wake wet with dew, and stretch on the oak boards.",
              [shot("sea", "dawn", ["viking", "sailor", "galley"], "crouch", "side")],
              text="Dawn on the deck", accentText="Wet with dew"),
        scene("list", "Typically you eat dried fish, salted meat, and bread, with water or ale.",
              [shot("interior", "day", ["viking", "jarl", "tavern"], "drink", "front")],
              text="Your meals", items=["Dried fish", "Salted meat", "Bread or porridge", "Ale or water"]),
        scene("statement", "When the wind dies, you row in turns on a wooden bench.",
              [shot("sea", "dusk", ["viking", "sailor", "galley"], "push", "side"), shot("sea", "dawn", ["jarl", "sailor", "galley"], "lift", "side")],
              text="When the wind dies", accentText="You row"),
        scene("ledger", "The famous Gokstad ship had sixteen oars on each side, so thirty-two rowers pulled together.",
              [shot("sea", "day", ["viking", "sailor", "galley"], "hammer", "side")],
              text="Rowers on the Gokstad ship", value=32, unit="rowers", accentText="sixteen oars a side"),
        scene("date", "In seven ninety-three, raiders sacked the monastery of Lindisfarne, and the Viking Age began.",
              [shot("coast", "dusk", ["viking", "monk", "monastery"], "threaten", "front", "smoke")],
              text="793", value=793, unit="AD", kicker="Lindisfarne, England", accentText="The Viking Age begins"),
        scene("statement", "Yet many voyages were for trade, and most Vikings lived and died as farmers.",
              [shot("plains", "day", ["viking", "farmer", "longhouse"], "dig", "side")],
              text="Not only raiders", accentText="Mostly farmers"),
        scene("flash", "Salt, oak and wind.", text="Salt and oak"),
        scene("outro", "So would you take the oar, or stay on the farm?", text="Oar or farm?", items=["Take the oar", "Stay home"]),
    ],
)

# ---------------------------------------------------------------------------------------------------------------------------------------------------------------- industrial age
SCRIPTS["titanic_myths"] = dict(
    format="lies", look="industrial", topic="Titanic: myths versus facts",
    screen_title="Titanic: Myth or Fact", title="Titanic: Five Beliefs, Myth or Fact? #history #titanic",
    description="Everyone knows the Titanic story, and a lot of it is wrong. Five famous beliefs, tested against what historians have documented.",
    tags=["history", "titanic", "myths", "1912", "ocean liner", "facts", "maritime history"],
    pinned_comment="Unsinkable or head-on? Reply with one word.",
    scenes=[
        scene("statement", "Everyone knows the Titanic story, and a good part of it is wrong.",
              [shot("sea", "dusk", ["gentleman", "lady", "ship"], "point", "side"), shot("coast", "day", ["sailor", "gentleman", "harbor"], "wave", "front")],
              text="You know the story", accentText="Much of it is wrong", kicker="Titanic", icon="ship"),
        scene("date", "On the tenth of April, nineteen twelve, the Titanic leaves Southampton for New York.",
              [shot("coast", "day", ["sailor", "lady", "harbor"], "cheer", "front")],
              text="1912", value=1912, unit="AD", kicker="Southampton, England", accentText="The maiden voyage begins"),
        scene("statement", "We will test five beliefs. Stay to the end, the catch comes last.",
              [shot("interior", "day", ["gentleman", "lady", "scroll"], "read", "side")],
              text="Five beliefs, tested", accentText="Myth or fact?"),
        scene("verdict", "The Titanic was called unsinkable.",
              [shot("sea", "day", ["sailor", "engineer", "ship"], "stand", "side")],
              text="Called unsinkable", verdict="partly", accentText="Practically unsinkable, said ads", kicker="myth or fact?"),
        scene("statement", "A magazine called her practically unsinkable, but the company never officially promised it.",
              [shot("interior", "day", ["gentleman", "engineer", "printing_press"], "write", "side")],
              text="Where it came from", accentText="A magazine's phrase"),
        scene("verdict", "It hit the iceberg head-on.",
              [shot("sea", "night", ["sailor", "navy_sailor", "ship"], "shout", "front")],
              text="Hit head-on", verdict="myth", accentText="A long glancing scrape", kicker="myth or fact?"),
        scene("list", "It scraped along the iceberg, and the hull seams opened across several of her watertight compartments.",
              [shot("sea", "night", ["sailor", "engineer", "ship"], "point", "side")],
              text="What really happened", items=["A glancing scrape", "Seams opened", "Several compartments flooded"]),
        scene("verdict", "It sank in minutes.",
              [shot("sea", "night", ["sailor", "gentleman", "ship"], "run", "side")],
              text="Sank in minutes", verdict="myth", accentText="About two hours forty", kicker="myth or fact?"),
        scene("timeline", "It struck at eleven forty, lowered boats soon after midnight, and sank at two twenty.",
              [shot("sea", "night", ["sailor", "lady", "ship"], "lift", "side")], frames=180,
              text="The longest night", items=["11:40 PM|Iceberg struck", "12:45 AM|First boat lowered", "2:20 AM|Titanic sinks"]),
        scene("verdict", "There were too few lifeboats.",
              [shot("sea", "night", ["lady", "engineer", "ship"], "carry", "side")],
              text="Too few lifeboats", verdict="fact", accentText="Room for about half", kicker="myth or fact?"),
        scene("ledger", "Her lifeboats held about eleven hundred seventy-eight people, for over twenty-two hundred aboard.",
              [shot("sea", "night", ["navy_sailor", "gentleman", "ship"], "push", "side")],
              text="Seats in lifeboats", value=1178, unit="seats", accentText="for about 2,224 aboard"),
        scene("verdict", "The band played as she sank.",
              [shot("sea", "night", ["gentleman", "lady", "ship"], "watch", "back")],
              text="The band played on", verdict="partly", accentText="They played; the tune is disputed", kicker="myth or fact?"),
        scene("statement", "Survivors agreed the musicians played, but they disagreed about what the final tune was.",
              [shot("interior", "night", ["gentleman", "scholar", "scroll"], "think", "front")],
              text="Survivors disagreed", accentText="The last tune"),
        scene("flash", "Truth sinks slowly.", text="Slowly"),
        scene("outro", "So which one did you believe: unsinkable, or the head-on crash?", text="Which did you believe?", items=["Unsinkable", "Head-on crash"]),
    ],
)


def main() -> int:
    out = ROOT / "data" / "scripts"
    bad = 0
    for name, data in SCRIPTS.items():
        project = MotionProject(**data)
        problems = make_validator(None, data["format"], retention=True)(project)
        (out / f"{name}.json").write_text(json.dumps(project.model_dump(exclude_none=True), indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"{name}: {len(project.scenes)} scenes, {project.narration_words} words, {'OK' if not problems else 'PROBLEMS'}")
        for p in problems:
            print("   -", p)
        bad += bool(problems)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
