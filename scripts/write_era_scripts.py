"""Writes the hand-made era demo scripts into data/scripts/*.json (one per new era) and checks each against the generator's own validator.

    .venv/bin/python scripts/write_era_scripts.py

Hand-written scripts are used as they are by the pipeline (no model, no fact-check): every fact here was written to be well documented and hedged where historians disagree.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from services.motion_generator import MotionProject, make_validator  # noqa: E402


def shot(place, time, subjects, action=None, view=None, weather=None):
    d = {"place": place, "time": time, "subjects": subjects}
    if weather:
        d["weather"] = weather
    if action:
        d["action"] = action
    if view:
        d["view"] = view
    return d


def scene(kind, narration, art=None, frames=120, **kw):
    d = {"type": kind, "narration": narration, "durationInFrames": frames}
    d.update(kw)
    if art:
        d["art"] = art
    return d


SCRIPTS = {}

# ---------------------------------------------------------------------------------------------------------------------------------------------------------------- prehistory
SCRIPTS["lascaux_painter"] = dict(
    format="dayinlife", look="prehistory", topic="A day in the life of a Lascaux cave painter",
    screen_title="The Cave Painter", title="A Day as a Cave Painter 17,000 Years Ago #history #prehistory",
    description="You are a painter in the Ice Age, climbing into the dark with a lamp of burning fat. This is what historians know about the people who painted Lascaux.",
    tags=["history", "prehistory", "lascaux", "cave painting", "ice age", "stone age", "ancient art"],
    pinned_comment="Ritual or storytelling? Reply with one word.",
    scenes=[
        scene("statement", "Seventeen thousand years ago, someone painted a galloping horse by the light of burning fat.",
              [shot("forest", "dawn", ["cave_painter", "cave", "bison"], "watch", "back"), shot("interior", "night", ["cave_painter", "torch", "horse"], "lift", "side")],
              text="Painted before writing", accentText="Seventeen thousand years", kicker="Lascaux", icon="sun"),
        scene("date", "In nineteen forty, four teenagers and a dog found the hole, and the paintings woke up.",
              [shot("plains", "day", ["cave_painter", "mammoth_hunter", "deer"], "walk", "side")],
              text="1940", value=1940, unit="AD", kicker="Montignac, France", accentText="A hidden cave is found"),
        scene("statement", "Go back: you grind red ochre at dawn. Wait for the last part, nobody expects it.",
              [shot("mountains", "dawn", ["cave_painter", "fire"], "dig", "side"), shot("forest", "dawn", ["shaman", "cave_painter", "bison"], "kneel", "front")],
              text="Red earth, ground fine", accentText="Colour from stone"),
        scene("timeline", "Your day has a rhythm: pigments, fat for the lamps, then the long hours in darkness.",
              [shot("forest", "day", ["cave_painter", "mammoth_hunter", "horse"], "carry", "side")], frames=180,
              text="A day underground", items=["Dawn|Grind the pigments", "Noon|Gather animal fat", "Dusk|Light the lamps", "Night|Paint in the dark"]),
        scene("list", "Your paint box is minerals and charcoal, blown through hollow bones or dabbed with moss.",
              [shot("interior", "dusk", ["cave_painter", "fire"], "crouch", "side")],
              text="Your paint box", items=["Red and yellow ochre", "Black manganese", "Charcoal", "Bone tubes and moss"]),
        scene("statement", "Stone lamps burning animal fat are your only light, and archaeologists found more than a hundred.",
              [shot("interior", "night", ["cave_painter", "torch", "deer"], "stand", "front"), shot("interior", "night", ["shaman", "fire", "cave_painter"], "think", "front")],
              text="One flame in the dark", accentText="A lamp of fat", icon="key"),
        scene("ledger", "Painters and engravers left about two thousand figures on these walls, mostly animals.",
              [shot("interior", "night", ["cave_painter", "bison", "horse"], "point", "side")],
              text="Figures on the walls", value=2000, unit="figures", accentText="mostly animals"),
        scene("statement", "Horses, deer, aurochs and bison gallop across the ceiling, while humans almost never appear.",
              [shot("plains", "dusk", ["cave_painter", "horse", "bison", "deer"], "cheer", "back")],
              text="Animals, almost no people", accentText="The herd, not the hunters"),
        scene("list", "Why you paint is a mystery. Historians suggest ritual, storytelling, or teaching young hunters.",
              [shot("interior", "dawn", ["cave_painter", "shaman", "mammoth_hunter"], "shout", "front")],
              text="Why paint here?", items=["A ritual", "A story", "Teaching hunters", "Nobody knows"]),
        scene("statement", "Then the entrance was sealed, probably by a rockfall, and the darkness kept them safe.",
              [shot("mountains", "night", ["cave_painter", "cave"], "fall", "side", "storm")],
              text="The cave closes", accentText="Silence for millennia"),
        scene("flash", "Only your lamp, and the dark.", text="Dark"),
        scene("statement", "Visitors' breath later damaged the art, so Lascaux closed to the public in nineteen sixty-three.",
              [shot("forest", "day", ["cave_painter", "bison"], "wave", "front")],
              text="Protected by absence", accentText="Closed in 1963"),
        scene("outro", "So why did you paint in the dark: ritual or storytelling?", text="Why paint?", items=["Ritual", "Storytelling"]),
    ],
)

# ---------------------------------------------------------------------------------------------------------------------------------------------------------------- renaissance
SCRIPTS["da_vinci_life"] = dict(
    format="portrait", look="renaissance", topic="Leonardo da Vinci: a life in dates",
    screen_title="Leonardo, in Dates", title="Leonardo da Vinci: A Life in Dates #history #renaissance",
    description="He painted the most famous face on Earth and left most of his projects unfinished. Follow Leonardo da Vinci through the dates that shaped his life.",
    tags=["history", "renaissance", "leonardo da vinci", "mona lisa", "florence", "art history", "inventors"],
    pinned_comment="Artist or inventor? Reply with one word.",
    scenes=[
        scene("statement", "He painted the most famous face on Earth, yet left most of his projects unfinished.",
              [shot("interior", "day", ["renaissance_artist", "duomo"], "write", "side"), shot("plaza", "dawn", ["renaissance_artist", "crowd", "palace"], "watch", "back")],
              text="The most famous face", accentText="Mostly unfinished", kicker="Leonardo", icon="quill"),
        scene("date", "Leonardo is born in fourteen fifty-two, in the little town of Vinci, near Florence.",
              [shot("plains", "dawn", ["renaissance_artist", "farmer", "sheep"], "stand", "front")],
              text="1452", value=1452, unit="AD", kicker="Vinci, near Florence", accentText="A notary's son is born"),
        scene("statement", "As a teenager he joins a Florentine workshop, but wait for the last part, nobody expects it.",
              [shot("city", "day", ["renaissance_artist", "banker", "forge"], "carry", "side"), shot("interior", "dusk", ["renaissance_artist", "printer", "scroll"], "read", "front")],
              text="Apprentice in Florence", accentText="Paint, metal, anatomy"),
        scene("timeline", "His life runs through three cities, and each one gave him a different job.",
              [shot("city", "dawn", ["renaissance_artist", "courtier", "duomo"], "walk", "side")], frames=180,
              text="Three cities", items=["1466|Florence workshop", "1482|Milan court", "1503|Mona Lisa begun", "1516|Moves to France"]),
        scene("statement", "In Milan he offers a duke his skills as a military engineer, not as a painter.",
              [shot("interior", "night", ["renaissance_artist", "condottiero", "fortress"], "point", "side"), shot("plaza", "day", ["inventor", "renaissance_artist", "crowd"], "think", "front")],
              text="A painter who sells war", accentText="Engineer first"),
        scene("date", "Around fourteen ninety-eight, he finishes The Last Supper on a convent wall in Milan.",
              [shot("interior", "dusk", ["renaissance_artist", "monk", "scroll"], "lift", "back")],
              text="1498", value=1498, unit="AD", kicker="Milan, Italy", accentText="The Last Supper is finished"),
        scene("statement", "He never trusts one method: he mixes oil and tempera, and the wall begins to flake.",
              [shot("interior", "day", ["renaissance_artist", "banker"], "shrug", "front")],
              text="Experiments that failed", accentText="The paint flakes"),
        scene("ledger", "About seven thousand pages of his notebooks survive, written backwards in mirror script.",
              [shot("interior", "night", ["renaissance_artist", "inventor", "book" if False else "scroll"], "write", "side")],
              text="Notebook pages that survive", value=7000, unit="pages", accentText="mirror writing"),
        scene("statement", "They hold flying machines, canals, anatomy and water, and most were never built.",
              [shot("mountains", "day", ["inventor", "renaissance_artist", "windmill"], "point", "side")],
              text="Ideas ahead of their time", accentText="Mostly on paper", icon="gear"),
        scene("date", "In fifteen sixteen he follows the French king to Amboise, and dies there in fifteen nineteen.",
              [shot("coast", "dusk", ["renaissance_artist", "courtier", "castle"], "sit", "side")],
              text="1519", value=1519, unit="AD", kicker="Amboise, France", accentText="Leonardo dies, aged sixty-seven"),
        scene("statement", "He leaves behind a handful of paintings and a mountain of questions.",
              [shot("interior", "night", ["renaissance_artist", "monk"], "pray", "front")],
              text="A handful of paintings", accentText="A mountain of questions"),
        scene("list", "Historians still debate which side of him mattered most, the artist or the scientist.",
              [shot("city", "day", ["renaissance_artist", "astronomer", "observatory"], "think", "front")],
              text="His many hats", items=["Painter", "Engineer", "Anatomist", "Dreamer"]),
        scene("outro", "So was he mainly an artist or an inventor?", text="Leonardo?", items=["Artist", "Inventor"]),
    ],
)

# ---------------------------------------------------------------------------------------------------------------------------------------------------------------- orient
SCRIPTS["samurai_shiroyama"] = dict(
    format="turning", look="orient", topic="The last stand of the samurai at Shiroyama",
    screen_title="The Last Samurai", title="The Last Stand of the Samurai, 1877 #history #samurai",
    description="In 1877 a few hundred samurai faced an army of thirty thousand on a hill in Kagoshima. This is the choice that ended an era.",
    tags=["history", "samurai", "japan", "saigo takamori", "meiji", "satsuma rebellion", "shiroyama"],
    pinned_comment="Honor or folly? Reply with one word.",
    scenes=[
        scene("statement", "A few hundred samurai faced thirty thousand soldiers, and they all knew how it would end.",
              [shot("mountains", "dawn", ["samurai", "volcano"], "stand", "back"), shot("battlefield", "dawn", ["soldiers", "cannon", "samurai"], "watch", "side")],
              text="Four hundred against thirty thousand", accentText="They knew", kicker="Shiroyama", icon="sword"),
        scene("date", "It is the twenty-fourth of September, eighteen seventy-seven, on a hill above Kagoshima.",
              [shot("mountains", "dawn", ["samurai", "pagoda"], "kneel", "front")],
              text="1877", value=1877, unit="AD", kicker="Shiroyama, Kagoshima", accentText="Dawn on the last hill"),
        scene("statement", "Saigo helped build modern Japan, yet he rebelled. Stay to the end, the catch comes last.",
              [shot("city", "day", ["samurai", "soldiers", "japanese_castle"], "salute", "side"), shot("interior", "night", ["shogun", "samurai", "dojo"], "think", "front")],
              text="A hero of the new Japan", accentText="Now its rebel"),
        scene("list", "The new army had ended the samurai's privileges, their stipends and even their swords.",
              [shot("plaza", "dusk", ["samurai", "crowd"], "plead", "front")],
              text="What the state took", items=["Their stipends", "Their right to the sword", "Their class itself"]),
        scene("statement", "So he marched, and for months his army fought the government across the island of Kyushu.",
              [shot("plains", "day", ["samurai", "mongol_horseman", "junk" if False else "horse"], "run", "side")],
              text="The rebellion spreads", accentText="Months of war"),
        scene("timeline", "His rebellion burned for most of eighteen seventy-seven, then shrank, step by step.",
              [shot("mountains", "dusk", ["samurai", "fortress"], "sneak", "side")], frames=180,
              text="The rebellion", items=["Jan|Satsuma rises", "Mar|Siege of Kumamoto", "Sep|Retreat to Kagoshima", "24 Sep|Shiroyama"]),
        scene("ledger", "By the end, his army had dwindled to a few hundred men on that single hill.",
              [shot("battlefield", "dawn", ["samurai", "soldiers"], "slash", "side")],
              text="Samurai left on the hill", value=400, unit="samurai", accentText="against about thirty thousand"),
        scene("list", "The army had rifles and artillery, and it bombarded the hill before it attacked.",
              [shot("battlefield", "dusk", ["soldiers", "cannon", "samurai"], "shoot", "side", "smoke")],
              text="Guns against swords", items=["Rifles and artillery", "A bombardment first", "Swords against bullets"]),
        scene("statement", "Saigo was wounded in the final charge, and according to tradition he took his own life.",
              [shot("mountains", "dusk", ["samurai", "volcano", "fire"], "fall", "side")],
              text="The final charge", accentText="Reportedly, his end"),
        scene("date", "The rebellion was over, and it was the last major armed uprising of the samurai.",
              [shot("city", "dusk", ["soldiers", "samurai", "pagoda"], "cheer", "front")],
              text="1877", value=1877, unit="AD", kicker="Japan", accentText="The samurai age ends"),
        scene("statement", "Yet Saigo became a folk hero, and was officially pardoned in eighteen eighty-nine.",
              [shot("plaza", "day", ["samurai", "crowd", "torii"], "pray", "front")],
              text="Honored after all", accentText="Pardoned in 1889"),
        scene("flash", "Honor, to the very end.", text="Honor"),
        scene("outro", "So was his last charge honor or folly?", text="Last charge?", items=["Honor", "Folly"]),
    ],
)

# ---------------------------------------------------------------------------------------------------------------------------------------------------------------- frontier
SCRIPTS["jesse_james_death"] = dict(
    format="mystery", look="frontier", topic="The mystery of Jesse James's death",
    screen_title="Jesse James: Dead?", title="Did Jesse James Fake His Death? #history #wildwest",
    description="In 1882 Jesse James was shot by a member of his own gang. Or was he? Here is what we know, and the rumor that never died.",
    tags=["history", "wild west", "jesse james", "outlaws", "missouri", "mystery", "american history"],
    pinned_comment="Dead in 1882 or alive for decades? Reply with one word.",
    scenes=[
        scene("statement", "America's most famous outlaw was shot by a friend, and some say he survived.",
              [shot("interior", "day", ["outlaw", "sheriff"], "point", "side"), shot("plains", "dusk", ["outlaw", "horse"], "run", "side")],
              text="Shot by a friend", accentText="Or was he?", kicker="Jesse James", icon="key"),
        scene("date", "It is the third of April, eighteen eighty-two, in a small house in Saint Joseph, Missouri.",
              [shot("city", "day", ["outlaw", "saloon", "general_store"], "stand", "back")],
              text="1882", value=1882, unit="AD", kicker="St. Joseph, Missouri", accentText="Jesse James is shot"),
        scene("statement", "Robert Ford shot him from behind. Stay to the end, the catch comes last.",
              [shot("interior", "dusk", ["outlaw", "sheriff", "saloon"], "shrug", "front"), shot("city", "dusk", ["sheriff", "settler", "telegraph"], "shout", "front")],
              text="A bullet from behind", accentText="Robert Ford"),
        scene("list", "A large reward was on his head, and Ford and his brother wanted it.",
              [shot("interior", "dawn", ["outlaw", "sheriff"], "point", "side")],
              text="What we know", items=["A reward on his head", "A friend turned traitor", "A crowd at the funeral"]),
        scene("ledger", "The governor had offered ten thousand dollars for him, a fortune in those days.",
              [shot("plaza", "day", ["sheriff", "settler", "crowd"], "wave", "front")],
              text="The reward", value=10000, unit="dollars", accentText="a fortune in 1882"),
        scene("statement", "One theory says it was him: relatives and neighbors looked at the body and said so.",
              [shot("interior", "day", ["settler", "pioneer_woman", "sheriff"], "pray", "front")],
              text="Theory one", accentText="It was Jesse"),
        scene("timeline", "The doubts began early, and they never fully went away, for decades.",
              [shot("plains", "night", ["outlaw", "horse"], "sneak", "side")], frames=180,
              text="Doubts that lived on", items=["1882|The shooting", "1948|A man claims to be him", "1995|The grave is opened"]),
        scene("statement", "The other theory says he faked his death, and many men later claimed to be Jesse.",
              [shot("plains", "dawn", ["outlaw", "prospector", "wagon"], "walk", "back")],
              text="Theory two", accentText="He escaped"),
        scene("date", "In nineteen ninety-five, scientists opened his grave and tested the remains against his family.",
              [shot("plains", "day", ["surgeon", "settler", "outlaw"], "dig", "side")],
              text="1995", value=1995, unit="AD", kicker="Kearney, Missouri", accentText="The grave is opened"),
        scene("statement", "The DNA matched his family line, which strongly suggests that the dead man was Jesse.",
              [shot("interior", "night", ["surgeon", "pioneer_woman"], "read", "front")],
              text="The science speaks", accentText="A very strong match"),
        scene("list", "Still, the legend lives, because many claimed to be him and no witness remains.",
              [shot("desert", "dusk", ["outlaw", "cowboy", "horse"], "watch", "back")],
              text="Why it lasted", items=["Many false Jesses", "No witness left", "A hungry public"]),
        scene("flash", "Alive? Nobody could say.", text="Alive"),
        scene("outro", "So was he dead in eighteen eighty-two, or alive for decades?", text="Dead or alive?", items=["Dead in 1882", "Alive for decades"]),
    ],
)

# ---------------------------------------------------------------------------------------------------------------------------------------------------------------- space age
SCRIPTS["apollo_11_journey"] = dict(
    format="journey", look="spaceage", topic="Apollo 11: the journey to the Moon",
    screen_title="The Road to the Moon", title="Apollo 11: The Journey to the Moon #history #apollo11",
    description="Eight days, about two hundred and forty thousand miles, and a landing with almost no fuel to spare. This is the route of Apollo 11.",
    tags=["history", "apollo 11", "moon landing", "nasa", "space race", "neil armstrong", "space age"],
    pinned_comment="Courage or luck? Reply with one word.",
    scenes=[
        scene("statement", "They landed on the Moon with seconds of fuel to spare.",
              [shot("plains", "dawn", ["astronaut", "rocket"], "wave", "front"), shot("desert", "night", ["astronaut", "lander"], "stand", "back")],
              text="Seconds of fuel left", accentText="The world held its breath", kicker="Apollo 11", icon="compass"),
        scene("date", "It is the sixteenth of July, nineteen sixty-nine, and a Saturn Five stands at Cape Kennedy.",
              [shot("coast", "dawn", ["astronaut", "rocket", "reporter"], "salute", "side")],
              text="1969", value=1969, unit="AD", kicker="Cape Kennedy, Florida", accentText="Apollo 11 lifts off"),
        scene("map", "The journey runs from Florida to Earth orbit, then to the Moon, then home to the Pacific.",
              None, frames=170,
              text="The route", items=["Cape Kennedy|28.5|-80.6", "Pearl Harbor|21.35|-157.97", "Splashdown|13.3|-169.1"], accentText="Eight days, three men"),
        scene("statement", "Neil Armstrong and Buzz Aldrin would land, while Michael Collins circled alone. Wait for the twist.",
              [shot("desert", "night", ["astronaut", "scientist", "satellite"], "watch", "side"), shot("interior", "night", ["astronaut", "engineer", "radar_dish"], "think", "front")],
              text="Three men, two roles", accentText="One stays above"),
        scene("ledger", "To get there, they crossed about two hundred and forty thousand miles of empty space.",
              [shot("desert", "dusk", ["astronaut", "lander", "satellite"], "walk", "side")],
              text="Miles to the Moon", value=240000, unit="miles", accentText="roughly, one way"),
        scene("statement", "During the descent, alarms flashed in the cockpit, and mission control had seconds to decide.",
              [shot("interior", "night", ["astronaut", "test_pilot", "engineer"], "shout", "front"), shot("interior", "night", ["engineer", "programmer", "reporter"], "think", "front")],
              text="Alarms during landing", accentText="Go or abort?"),
        scene("list", "Armstrong took manual control to avoid a field of boulders, and fuel kept dropping.",
              [shot("desert", "dusk", ["astronaut", "lander"], "point", "side")],
              text="Armstrong's choice", items=["Skip the boulders", "Fly by hand", "Fuel dropping"]),
        scene("date", "At four seventeen in the afternoon, Eastern time, Eagle touched down in the Sea of Tranquility.",
              [shot("desert", "night", ["astronaut", "lander", "eclipse"], "cheer", "front")],
              text="1969", value=1969, unit="AD", kicker="Sea of Tranquility", accentText="The Eagle has landed"),
        scene("timeline", "Then came the steps: the landing, the first walk, and the long way home.",
              [shot("desert", "dawn", ["astronaut", "lander"], "lift", "back")], frames=180,
              text="Twenty-one hours", items=["20 Jul|Eagle lands", "20 Jul|First steps", "21 Jul|Liftoff", "24 Jul|Splashdown"]),
        scene("statement", "They collected about forty-seven pounds of lunar rock, and planted a flag.",
              [shot("desert", "night", ["astronaut", "banner" if False else "lander", "comet"], "dig", "side")],
              text="A bag of Moon rock", accentText="Forty-seven pounds"),
        scene("date", "They splashed down in the Pacific on the twenty-fourth of July, safe and a little stunned.",
              [shot("sea", "dawn", ["astronaut", "navy_sailor", "crowd"], "kneel", "front")],
              text="1969", value=1969, unit="AD", kicker="Pacific Ocean", accentText="Splashdown, safe at last"),
        scene("flash", "Tranquility, and then silence.", text="Tranquility"),
        scene("outro", "So did they succeed through courage or through luck?", text="Courage or luck?", items=["Courage", "Luck"]),
    ],
)


def main() -> int:
    out = ROOT / "data" / "scripts"
    out.mkdir(parents=True, exist_ok=True)
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
