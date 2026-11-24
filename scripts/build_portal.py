"""Builds the web portal (docs/): index, privacy, terms, 404, site.css and site.js.

Run: python3 scripts/build_portal.py   (then python3 docs/check_portal.py). The portal is plain static files for GitHub Pages: no cookies, no analytics, nothing loaded from other hosts.
"""
from pathlib import Path

D = Path(__file__).resolve().parent.parent / "docs"
BASE = "https://adrlopech.github.io/Chronicles-of-History"
YT = "https://www.youtube.com/@chroniclesofhistorytv"
TT = "https://www.tiktok.com/@chroniclesofhistorytv"
REPO = "https://github.com/adrlopech/Chronicles-of-History"


# ---------------------------------------------------------------- the skyline: monuments of every age, drawn as silhouettes
def skyline() -> str:
    far, mid, near = [], [], []
    pyr = lambda x, w, h: f'<polygon points="{x},400 {x + w / 2},{400 - h} {x + w},400"/>'
    obelisk = lambda x, h: f'<polygon points="{x},400 {x + 9},{400 - h + 46} {x + 16},{400 - h} {x + 23},{400 - h + 46} {x + 32},400"/>'

    def pagoda(x, s=1.0):
        out, y, w = "", 400, 78 * s
        for i in range(5):
            h = 34 * s
            out += f'<rect x="{x - w / 2 + 10}" y="{y - h}" width="{w - 20}" height="{h}"/>'
            out += f'<polygon points="{x - w / 2 - 14},{y - h} {x + w / 2 + 14},{y - h} {x + w / 2 - 6},{y - h - 14 * s} {x - w / 2 + 6},{y - h - 14 * s}"/>'
            y -= h + 14 * s
            w *= 0.82
        return out + f'<rect x="{x - 2}" y="{y - 40 * s}" width="4" height="{40 * s}"/>'

    def temple(x, w):
        cols = "".join(f'<rect x="{x + 14 + i * (w - 28) / 7}" y="318" width="9" height="74"/>' for i in range(8))
        return (f'<polygon points="{x - 6},302 {x + w / 2},262 {x + w + 6},302"/><rect x="{x - 8}" y="302" width="{w + 16}" height="14"/>{cols}'
                f'<rect x="{x - 14}" y="392" width="{w + 28}" height="8"/><rect x="{x - 8}" y="384" width="{w + 16}" height="8"/>')

    def colosseum(x, w):
        arches = "".join(f'<path d="M{x + 18 + i * 34},{310 + r * 30} v-14 a9,9 0 0 1 18,0 v14z" fill="black"/>' for r in range(3) for i in range(int((w - 30) / 34)))
        return (f'<mask id="colo"><rect x="{x}" y="270" width="{w}" height="130" fill="white"/>{arches}</mask>'
                f'<rect x="{x}" y="270" width="{w}" height="130" rx="6" mask="url(#colo)"/>')

    def castle(x):
        def tower(tx, tw, th):
            cren = "".join(f'<rect x="{tx + k * tw / 5}" y="{400 - th - 12}" width="{tw / 8}" height="12"/>' for k in range(5))
            return f'<rect x="{tx}" y="{400 - th}" width="{tw}" height="{th}"/>{cren}'
        return (tower(x, 38, 150) + tower(x + 118, 38, 150) + tower(x + 38, 80, 110)
                + f'<polygon points="{x + 52},{400 - 150} {x + 71},{400 - 205} {x + 90},{400 - 150}"/>'
                + f'<polygon points="{x + 130 - 14},{400 - 150} {x + 137},{400 - 190} {x + 156 - 12},{400 - 150}"/>')

    def windmill(x):
        blades = "".join(f'<rect x="-4" y="-78" width="8" height="78" transform="rotate({a})"/><rect x="4" y="-78" width="26" height="22" transform="rotate({a})"/>' for a in (0, 90, 180, 270))
        return (f'<polygon points="{x - 22},400 {x - 12},300 {x + 12},300 {x + 22},400"/><polygon points="{x - 15},300 {x},284 {x + 15},300"/>'
                f'<g class="blades" style="transform-origin:{x}px 296px;transform-box:view-box"><g transform="translate({x},296)">{blades}</g></g>')

    def rocket(x):
        return (f'<path d="M{x},206 C{x + 16},238 {x + 16},300 {x + 14},350 L{x - 14},350 C{x - 16},300 {x - 16},238 {x},206z"/>'
                f'<polygon points="{x - 14},316 {x - 34},364 {x - 14},350"/><polygon points="{x + 14},316 {x + 34},364 {x + 14},350"/>'
                f'<rect x="{x - 40}" y="350" width="80" height="50"/><rect x="{x - 4}" y="350" width="8" height="50" fill="#D9A441" opacity=".25"/>')

    def clock(x):
        return (f'<rect x="{x}" y="256" width="46" height="144"/><polygon points="{x - 4},256 {x + 23},206 {x + 50},256"/>'
                f'<circle cx="{x + 23}" cy="288" r="14" fill="#D9A441" opacity=".5"/><rect x="{x - 6}" y="380" width="58" height="20"/>')

    far += pyr(120, 300, 170) + pyr(330, 220, 120) + obelisk(760, 250) + pagoda(1180, 1.0) + pyr(1520, 260, 140) + obelisk(1940, 210) + pagoda(2250, 0.8)
    mid += temple(260, 250) + colosseum(640, 340) + castle(1090) + clock(1380) + windmill(1560) + rocket(1830) + pyr(1960, 200, 110) + temple(2080, 180)
    near += ('<rect x="0" y="378" width="2400" height="22"/>' + "".join(f'<polygon points="{x},378 {x + 7},{352 - (x % 3) * 8} {x + 14},378"/>' for x in range(30, 2400, 78)))
    return (
        '<svg class="sky-svg" viewBox="0 0 2400 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true">'
        '<defs><linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9A441" stop-opacity=".55"/><stop offset="1" stop-color="#D9A441" stop-opacity="0"/></linearGradient></defs>'
        f'<g fill="#3a2514" opacity=".85" class="far">{"".join(far)}</g>'
        f'<g fill="#1d130a" stroke="url(#gd)" stroke-width="1.5" class="mid">{"".join(mid)}</g>'
        f'<g fill="#0c0805" class="near">{"".join(near)}</g></svg>'
    )


# ---------------------------------------------------------------- content
ICONS = {
    "Prehistory": '<path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 2 2 1-1-2-1-3 0-5z"/><path d="M6 21h12"/>',
    "Antiquity": '<path d="M3 8l9-5 9 5zM5 8v10M9.5 8v10M14.5 8v10M19 8v10M3 21h18"/>',
    "Middle Ages": '<path d="M5 21V9h3V6h3v3h2V6h3v3h3v12zM10 21v-5h4v5"/>',
    "The Orient": '<path d="M12 2v3M5 8h14l-2-3H7zM7 13h10l-2-3H9zM8 18h8l-1.5-2h-5zM6 21h12"/>',
    "Renaissance": '<path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1zM12 6v13"/>',
    "Age of Sail": '<path d="M12 3v14M12 4l7 9h-7M12 7l-5 6h5M3 17h18l-3 4H6z"/>',
    "Empires": '<path d="M3 18l1-10 5 5 3-8 3 8 5-5 1 10zM3 21h18"/>',
    "Industrial Age": '<circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    "The Frontier": '<path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.5 6.8 19.2l1-5.9L3.5 9.2l5.9-.8z"/>',
    "World Wars": '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM12 8v8M8.5 12h7"/>',
    "Space Age": '<path d="M12 2c3 3 4 7 4 11l-4 3-4-3c0-4 1-8 4-11zM8 14l-3 4 4-1M16 14l3 4-4-1M12 17v4"/><circle cx="12" cy="10" r="1.6"/>',
}

ERAS = [
    ("Prehistory", "before 3000 BC", "Cave painters, mammoth hunters and the first fires.", "#E4693A", "#F0C27A"),
    ("Antiquity", "3000 BC – 476 AD", "Pharaohs, legions and philosophers: Egypt, Greece and Rome.", "#FF8A55", "#FFC857"),
    ("Middle Ages", "476 – 1450", "Castles, crusades, Vikings and the Black Death.", "#E8603A", "#E8B650"),
    ("The Orient", "every age", "Samurai, dynasties and the roads of the East.", "#E85A38", "#E0A84A"),
    ("Renaissance", "1400 – 1600", "Painters, printers and the birth of modern science.", "#E8744C", "#E6B85C"),
    ("Age of Sail", "1450 – 1750", "Explorers, pirates and maps that led to treasure.", "#F0A24A", "#D9A441"),
    ("Empires", "1600 – 1800", "Crowns, revolutions and the court of Versailles.", "#F2B04C", "#D4743C"),
    ("Industrial Age", "1760 – 1914", "Steam, rails, telegraphs and a world speeding up.", "#E8734A", "#C9A66B"),
    ("The Frontier", "1800 – 1890", "Outlaws, gold rushes and the Wild West.", "#E8643F", "#F0BE5A"),
    ("World Wars", "1914 – 1945", "Trenches, turning points and the weight of choices.", "#F2B53D", "#C9823A"),
    ("Space Age", "1945 – today", "Rockets, satellites and the road to the Moon.", "#F28A3D", "#F0C060"),
]
STEPS = [
    ("Pick", "A format and a topic, balanced by what viewers really watch to the end."),
    ("Write", "An AI-drafted script that must pass strict checks: story first, people in every picture, 150–190 words."),
    ("Fact-check", "A second pass verifies dates, names, figures and quotes and rewrites whatever is wrong."),
    ("Narrate", "A synthetic voice reads the script and the subtitles follow every word."),
    ("Draw", "Remotion paints each scene with a cast of historical characters, animals and buildings of the right era."),
    ("Check &amp; publish", "A technical gate checks length, format and sound before the story is scheduled."),
]
COVERS = [
    ("cave-painter", "A Day In", "A Day as a Cave Painter, 17,000 Years Ago"),
    ("da-vinci", "Life in Dates", "Leonardo da Vinci: A Life in Dates"),
    ("apollo", "The Route", "Apollo 11: The Journey to the Moon"),
    ("samurai", "Turning Point", "The Last Stand of the Samurai, 1877"),
    ("jesse-james", "Unsolved", "Did Jesse James Fake His Death?"),
]
FORMATS = [("Unsolved", "One mystery, two theories, what is missing"), ("A Day In", "An ordinary day, one place, one year"), ("Turning Point", "The moment that changed everything"),
           ("History Lies", "Myth, fact or partly?"), ("What If History", "Counterfactuals on a real hinge"), ("History Duel", "Two contenders, round by round"),
           ("The Route", "Expeditions on a treasure map"), ("Life in Dates", "A life told through its dates")]
THEMES = [("gilded", "Gilded"), ("sepia", "Sepia"), ("ember", "Ember"), ("regal", "Regal"), ("bronze", "Bronze"), ("ivory", "Ivory"), ("smoke", "Smoke")]
THEME_DOT = {"gilded": "#D9A441", "sepia": "#C8642A", "ember": "#FF6A3D", "regal": "#B8433A", "bronze": "#A8793A", "ivory": "#F4EAD2", "smoke": "#E39A3B"}
FAQ = [
    ("Is it made with AI?", "The scripts are drafted with AI language models and then checked by an automated fact-check pass; the owner picks the formats. The narration is a synthetic voice and every picture is drawn by code. Nothing is filmed and no archive footage is used."),
    ("Are the stories true?", "Facts come first: every date, name and figure must be real and well documented, and where historians disagree the video says so. Mistakes can still happen: if you spot one, tell us and we will correct or remove the video."),
    ("Why just over a minute?", "Every story runs between 62 and 90 seconds: long enough for a beginning, a turn and an ending, short enough to watch in one go."),
    ("Where do the maps come from?", "They are drawn from real coastlines (Natural Earth, public domain) in the style of an old treasure map, with the real position of every place in the story."),
    ("Do you collect data about me?", "No. This site has no cookies, no analytics and loads nothing from other companies. Read the Privacy Policy."),
]


def head(title: str, desc: str, fname: str) -> str:
    canon = f"{BASE}/" + ("" if fname == "index.html" else fname)
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#100B07">
<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="canonical" href="{canon}">
<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:image" content="{BASE}/og-image.png"><meta property="og:type" content="website"><meta property="og:url" content="{canon}">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="site.css">
<noscript><style>.rv{{opacity:1;transform:none}}.title .w{{opacity:1;transform:none;animation:none}}</style></noscript>
</head>
<body>
<a class="skip" href="#main">Skip to content</a><div id="progress"></div><div class="grain"></div><div class="glow" id="glow"></div><canvas id="embers" aria-hidden="true"></canvas>
<header class="top"><nav aria-label="Main"><a href="index.html" class="brand"><img src="logo.png" alt="" width="40" height="40"><span>The Chronicles <b>of History</b></span></a>
<ul id="menu"><li><a href="index.html#stories">Stories</a></li><li><a href="index.html#eras">Eras</a></li><li><a href="index.html#how">How it&rsquo;s made</a></li><li><a href="index.html#colour">Colours</a></li><li><a href="index.html#faq">FAQ</a></li></ul>
<a class="btn sm" href="{YT}" target="_blank" rel="noopener"><span>Watch</span></a><button class="burger" type="button" aria-label="Menu" aria-controls="menu" aria-expanded="false"><i></i><i></i></button></nav></header>
'''


def foot() -> str:
    return f'''<footer><div class="container foot"><div class="fbrand"><img src="logo.png" alt="" width="54" height="54"><div>&copy; 2026 The Chronicles of History. All rights reserved.<br><small>Narrated, hand-drawn history. Facts first.</small></div></div>
<ul><li><a href="index.html">Home</a></li><li><a href="terms.html">Terms of Service</a></li><li><a href="privacy.html">Privacy Policy</a></li><li><a href="{REPO}/issues" target="_blank" rel="noopener">Contact</a></li><li><a href="{REPO}" target="_blank" rel="noopener">GitHub</a></li><li><a href="{TT}" target="_blank" rel="noopener">TikTok</a></li><li><a href="{YT}" target="_blank" rel="noopener">YouTube</a></li></ul></div></footer>
<button class="backtop" type="button" aria-label="Back to top">&#8593;</button>
<script src="site.js"></script>
</body>
</html>
'''


def kicker(n: str, text: str) -> str:
    return f'<p class="kicker rv"><i></i>Chapter {n} &middot; {text}<i></i></p>'


def index() -> str:
    ring = "TRUE STORIES &#10022; DRAWN ALIVE &#10022; A NEW STORY EVERY DAY &#10022;"
    hero = f'''<section class="hero" id="top">
<div class="rays"></div><div class="sun" data-speed="0.12"></div>
<div class="skyline s1" data-speed="0.10" data-mx="10">{skyline()}</div>
<div class="hero-in">
<div class="seal rv zoom" data-mx="-14"><svg class="ring" viewBox="0 0 300 300" aria-hidden="true"><defs><path id="circ" d="M150,150 m-122,0 a122,122 0 1,1 244,0 a122,122 0 1,1 -244,0"/></defs><text><textPath href="#circ" startOffset="0" textLength="765" lengthAdjust="spacing">{ring}</textPath></text></svg><img src="logo.png" alt="The Chronicler, mascot of The Chronicles of History" width="220" height="220"></div>
<h1 class="title"><span class="w">The</span> <span class="w">Chronicles</span> <span class="w">of</span> <span class="w">History</span></h1>
<p class="tag rv" style="--d:.7s">Short, narrated, hand-drawn stories from every age of the world.<br>A new true story every day, in just over a minute.</p>
<div class="cta rv" style="--d:.9s"><a class="btn" href="{YT}" target="_blank" rel="noopener"><span>Watch on YouTube</span></a><a class="btn ghost" href="{TT}" target="_blank" rel="noopener"><span>Follow on TikTok</span></a></div>
</div>
<a class="cue" href="#stories" aria-label="Scroll to the stories"><i></i></a>
</section>
<div class="ribbon" aria-hidden="true"><div class="track">{"".join(f"<span>{e[0]}</span><b>&#10022;</b>" for e in ERAS * 2)}</div></div>'''

    phones = "".join(
        f'<a class="phone" style="--i:{i - 2}" href="{YT}/shorts" target="_blank" rel="noopener"><div class="bezel"><img src="assets/covers/{s}.jpg" alt="Cover: {t}" width="540" height="960"><span class="shine"></span></div><div class="cap"><b>{k}</b><span>{t}</span></div></a>'
        for i, (s, k, t) in enumerate(COVERS)
    )
    stories = f'''<section class="pin" id="stories"><div class="stick"><div class="container">{kicker("I", "The stories")}
<h2 class="rv">One true story, <em>every day</em></h2><p class="sub rv">Each story is a series of its own: a day in the life, a turning point, an unsolved mystery, a journey, a life in dates.</p></div>
<div class="fan">{phones}</div><p class="fanhint">Scroll &#8595; the stories unfold</p></div></section>'''

    nums = [(127, "historical characters"), (25, "animals"), (71, "structures"), (37, "actions"), (11, "eras"), (7, "colour themes")]
    numbers = f'''<section class="block numbers" id="numbers"><div class="container">{kicker("II", "The workshop")}<h2 class="rv">A whole world, <em>drawn by code</em></h2>
<div class="nums">{"".join(f'<div class="num rv" style="--d:{i * .08}s"><strong data-to="{n}">0</strong><span>{t}</span></div>' for i, (n, t) in enumerate(nums))}</div>
<div class="fmts rv">{"".join(f"<div><b>{a}</b><span>{b}</span></div>" for a, b in FORMATS)}</div></div></section>'''

    eras = "".join(
        f'<article class="era rv {"l" if i % 2 == 0 else "r"}" style="--a:{a};--b:{b}"><span class="dot"></span><div class="card"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true">{ICONS[n]}</svg><small>{yrs}</small><h3>{n}</h3><p>{d}</p><i class="bar"></i></div></article>'
        for i, (n, yrs, d, a, b) in enumerate(ERAS)
    )
    era_sec = f'''<section class="block" id="eras"><div class="container">{kicker("III", "Eleven eras")}<h2 class="rv">Travel through <em>time</em></h2>
<p class="sub rv">Each story is drawn in the look of its own age: its typefaces, frames and buildings, with every anachronism removed.</p>
<div class="tl" id="tl"><div class="line"><i id="tlfill"></i></div>{eras}</div></div></section>'''

    steps = "".join(f'<li class="step rv" style="--d:.05s"><span class="n">{i + 1}</span><div><b>{t}</b><p>{d}</p></div></li>' for i, (t, d) in enumerate(STEPS))
    how = f'''<section class="block" id="how"><div class="container">{kicker("IV", "How it&rsquo;s made")}<h2 class="rv">From a spark to a <em>scroll</em></h2>
<p class="sub rv">One person, a pipeline of software and a strict editor: no story leaves without passing every gate.</p>
<ol class="steps" id="steps"><div class="sline"><i id="sfill"></i></div>{steps}</ol></div></section>'''

    mapsec = '''<section class="block mapsec" id="maps"><div class="container two"><div class="copy">''' + kicker("V", "The maps") + '''
<h2 class="rv">Maps like <em>buried treasure</em></h2><p class="sub rv">Journeys are inked on parchment over real coastlines: a dashed trail walks from place to place, X marks the spot and the compass keeps its watch.</p>
<ul class="ticks rv"><li>Real coastlines from public-domain Natural Earth data</li><li>Every place at its true latitude and longitude</li><li>Aged paper, red trail, hand-lettered labels</li></ul></div>
<div class="map rv zoom"><svg viewBox="0 0 560 460" aria-label="Illustration of a treasure map with a dashed route"><defs>
<filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="16"/></filter>
<radialGradient id="pap" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#F6E7BF"/><stop offset=".7" stop-color="#E2C990"/><stop offset="1" stop-color="#B98F4F"/></radialGradient></defs>
<g filter="url(#rough)"><rect x="24" y="24" width="512" height="412" fill="url(#pap)"/></g>
<g fill="#D8BB84" stroke="#8A6A34" stroke-width="2" stroke-linejoin="round" opacity=".95"><path d="M70,120 C90,80 150,70 190,96 C230,120 210,170 170,190 C130,210 120,250 80,240 C50,220 50,160 70,120z"/><path d="M300,90 C350,60 430,80 450,130 C470,180 420,200 400,240 C380,280 330,260 320,220 C310,180 270,130 300,90z"/><path d="M150,330 C200,300 270,320 290,360 C300,400 240,410 190,400 C150,390 120,350 150,330z"/><path d="M400,320 C440,300 500,320 500,360 C490,400 430,410 410,380 C396,360 388,336 400,320z"/></g>
<mask id="rm"><path id="rmask" pathLength="1" d="M120,170 C170,230 230,230 260,190 C300,150 360,170 370,230 C378,290 330,300 270,340 C230,370 280,330 440,350" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" stroke-dasharray="1 1" stroke-dashoffset="1"/></mask>
<path pathLength="1" mask="url(#rm)" d="M120,170 C170,230 230,230 260,190 C300,150 360,170 370,230 C378,290 330,300 270,340 C230,370 280,330 440,350" fill="none" stroke="#9B2D1F" stroke-width="4" stroke-linecap="round" stroke-dasharray=".012 .02"/>
<g class="x" transform="translate(440,350)"><path d="M-14,-14 L14,14 M14,-14 L-14,14" stroke="#9B2D1F" stroke-width="7" stroke-linecap="round"/></g>
<g fill="#6A4A20" font-family="Georgia,serif" font-style="italic" font-size="15"><text x="80" y="108">Start</text><text x="330" y="82">Port Royal</text><text x="170" y="388">Lost Isle</text><text x="410" y="316">Treasure</text></g>
<g transform="translate(86,370)" class="compass"><circle r="34" fill="none" stroke="#6A4A20" stroke-width="2"/><path d="M0,-44 L7,0 L0,44 L-7,0z" fill="#9B2D1F"/><path d="M-44,0 L0,-7 L44,0 L0,7z" fill="#6A4A20"/><text y="-50" text-anchor="middle" font-size="14" fill="#6A4A20" font-family="Georgia,serif">N</text></g>
</svg></div></div></section>'''

    thumbs = "".join(f'<img src="assets/themes/{k}.jpg" alt="Cover in the {n} colour theme" class="tsl{" on" if i == 0 else ""}" data-k="{k}" loading="lazy" width="540" height="960">' for i, (k, n) in enumerate(THEMES))
    btns = "".join(f'<button type="button" class="tb{" on" if i == 0 else ""}" data-k="{k}"><i style="background:{THEME_DOT[k]}"></i>{n}</button>' for i, (k, n) in enumerate(THEMES))
    colour = f'''<section class="block colour" id="colour"><div class="container two rev">
<div class="phone big rv zoom"><div class="bezel"><div class="stack">{thumbs}</div><span class="shine"></span></div></div>
<div class="copy">{kicker("VI", "Seven colour styles")}<h2 class="rv">Always brown and gold, <em>never the same</em></h2>
<p class="sub rv">A palette of parchment, leather, brick and gold leaf, dressed in seven moods that rotate from video to video. Pick one and watch the cover change.</p>
<div class="tbs rv" id="tbs">{btns}</div><p class="tname rv" id="tname">Gilded &mdash; gold leaf on dark leather, each era with its own accents.</p></div></div></section>'''

    faq = "".join(f'<details class="rv" style="--d:{i * .05}s"><summary>{q}</summary><p>{a}</p></details>' for i, (q, a) in enumerate(FAQ))
    faq_sec = f'<section class="block" id="faq"><div class="container narrow">{kicker("VII", "Questions")}<h2 class="rv">Before you <em>ask</em></h2>{faq}</div></section>'

    cta = f'''<section class="finale"><div class="container"><div class="medal"><div class="rays small"></div><img class="rv zoom" src="logo.png" alt="" width="120" height="120"></div>
<h2 class="rv">History is better<br><em>when it is told well</em></h2><p class="sub rv">Join the chronicle. A new story every day, on both channels.</p>
<div class="cta rv"><a class="btn" href="{YT}" target="_blank" rel="noopener"><span>Subscribe on YouTube</span></a><a class="btn ghost" href="{TT}" target="_blank" rel="noopener"><span>Follow on TikTok</span></a></div></div></section>'''

    return (head("The Chronicles of History | true stories, drawn alive", "Narrated, hand-drawn history shorts of just over a minute on YouTube and TikTok. A new real story every day.", "index.html")
            + hero + '<main id="main">' + stories + numbers + era_sec + how + mapsec + colour + faq_sec + cta + "</main>" + foot())


def legal(fname: str, title: str, desc: str, intro: str, body: str, meta: str) -> str:
    return (head(f"{title} | The Chronicles of History", desc, fname)
            + f'<main id="main" class="legalpage"><section class="lhero"><div class="rays small"></div><div class="container narrow"><p class="kicker"><i></i>The fine print<i></i></p><h1>{title}</h1><p class="sub">{intro}</p><p class="meta">{meta}</p></div></section>'
            + f'<div class="container doc">{body}</div></main>' + foot())


CONTACT = f'Contact: open an issue at <a href="{REPO}/issues" target="_blank" rel="noopener">{REPO.replace("https://", "")}/issues</a> or write in the comments of the channel.'
PRIVACY = f'''<section class="rv"><h2><i>01</i>Who we are and what this covers</h2><p>This policy explains what data The Chronicles of History handles: this website, the YouTube channel <a href="{YT}">@chroniclesofhistorytv</a>, the TikTok account <a href="{TT}">@chroniclesofhistorytv</a> and the software that produces and publishes the videos. The project is run by one person, who is responsible for the data described here. {CONTACT}</p></section>
<section class="rv"><h2><i>02</i>Visitors to this website</h2><p>The site sets no cookies and uses no analytics or tracking tools. It loads no scripts, fonts or images from other companies: every file is served from this site. It is hosted on GitHub Pages; GitHub may record technical data such as your IP address in its server logs to run the service, under the <a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">GitHub Privacy Statement</a>. We do not receive those logs. Links to YouTube, TikTok and other sites lead to places where their own policies apply.</p></section>
<section class="rv"><h2><i>03</i>Viewers of the videos</h2><p>YouTube and TikTok handle your viewing data under their own policies (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google</a>, <a href="https://www.tiktok.com/legal/page/row/privacy-policy/en" target="_blank" rel="noopener">TikTok</a>). From YouTube we only receive the channel&rsquo;s own statistics through the YouTube Analytics API: views, watch time, audience retention, subscribers gained and traffic sources, as totals per video and per day. These numbers do not identify any viewer and are used only to decide which kinds of stories to make next.</p></section>
<section class="rv"><h2><i>04</i>Comments</h2><p>If comment replies are enabled, the software reads the public comments on the channel&rsquo;s own videos and lists the ones without a reply. Only the comment text, the public display name, the video and the date are used, to answer them. Suggested replies are drafted by an AI model from the comment text (without your name) and a person reads and approves each one: nothing is posted automatically. The working list stays on the owner&rsquo;s computer and is never shared or sold; ask and it will be deleted.</p></section>
<section class="rv"><h2><i>05</i>Google and YouTube API data</h2><p>The software signs in only to its own Google account and channel. It uses the permissions to upload and schedule the channel&rsquo;s videos and thumbnails, read the channel&rsquo;s own videos, and read the channel&rsquo;s own statistics. It does not access anyone else&rsquo;s account. The use and transfer to any other app of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener">Google API Services User Data Policy</a>, including the Limited Use requirements. Access can be revoked at any time in your Google account&rsquo;s security settings.</p></section>
<section class="rv"><h2><i>06</i>TikTok</h2><p>Videos are published to the account <a href="{TT}">@chroniclesofhistorytv</a>. We do not collect or store data about TikTok viewers.</p></section>
<section class="rv"><h2><i>07</i>Services used to make the videos</h2><p>Scripts are drafted with AI language models (Google Gemini) and narrated with a synthetic voice (ElevenLabs). Only the text of the script is sent to them: no personal data of viewers or visitors.</p></section>
<section class="rv"><h2><i>08</i>Keys and security</h2><p>API keys and sign-in tokens stay in files on the owner&rsquo;s computer that are excluded from the public source code.</p></section>
<section class="rv"><h2><i>09</i>How long data is kept, and your choices</h2><p>Statistics are kept as long as they help decide what to make next. You can ask for any comment data about you to be deleted, and you can manage your data on YouTube and TikTok in their own settings.</p></section>
<section class="rv"><h2><i>10</i>Children</h2><p>The videos are general-audience history. The site and the software collect no data from anyone, including children.</p></section>
<section class="rv"><h2><i>11</i>Changes to this policy</h2><p>If this policy changes, the date above changes with it.</p></section>
<section class="rv"><h2><i>12</i>Contact</h2><p>{CONTACT}</p></section>'''
TERMS = f'''<section class="rv"><h2><i>01</i>Acceptance of these terms</h2><p>These terms apply to this website and to the channels YouTube <a href="{YT}">@chroniclesofhistorytv</a> and TikTok <a href="{TT}">@chroniclesofhistorytv</a> (together, &ldquo;The Chronicles of History&rdquo;). By reading the site or watching the videos you accept them. If you do not, please do not use them.</p></section>
<section class="rv"><h2><i>02</i>What The Chronicles of History is</h2><p>A one-person studio that makes short vertical videos (just over a minute) telling real stories from history. Most of the work is automated by software the owner wrote and runs: scripts are drafted by AI language models and checked by an automated fact-check pass; the narration is a synthetic voice; the pictures are drawn by code. There is no sign-up, no user account, nothing to buy and no service for third parties. The software only publishes to the channel&rsquo;s own accounts.</p></section>
<section class="rv"><h2><i>03</i>The videos are information, not advice</h2><ul><li><b>Stories simplify.</b> A video of a minute cannot hold every detail. Where historians disagree, the video says so.</li><li><b>Illustrations are artistic.</b> Characters, buildings and maps are stylised drawings, not historical photographs or surveys.</li><li><b>Mistakes can happen.</b> If you spot an error, write to us and we will correct or remove the video.</li><li><b>Not professional advice.</b> Nothing in the videos is legal, medical, financial or academic advice.</li></ul></section>
<section class="rv"><h2><i>04</i>YouTube and TikTok</h2><p>Watching the videos there is also subject to each platform&rsquo;s terms (<a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener">YouTube</a>, <a href="https://www.tiktok.com/legal/page/row/terms-of-service/en" target="_blank" rel="noopener">TikTok</a>). The YouTube API Services are used only for the channel&rsquo;s own account. How data is handled is explained in the <a href="privacy.html">Privacy Policy</a>.</p></section>
<section class="rv"><h2><i>05</i>Intellectual property</h2><p>The scripts, narration, drawings, logos and software made for The Chronicles of History belong to the owner, except where an open-source licence applies to a component. You may share links to the videos and quote short passages with credit. Please do not re-upload the videos as your own. Names of real people, peoples and places in the stories are used for education and commentary.</p></section>
<section class="rv"><h2><i>06</i>Using the site and the channels</h2><p>Be respectful in comments. Spam, harassment and attempts to disrupt the site are not allowed, and comments may be removed.</p></section>
<section class="rv"><h2><i>07</i>No warranty and limits of liability</h2><p>The site and the videos are provided &ldquo;as is&rdquo;, without warranties of any kind. To the extent the law allows, the owner is not liable for any loss arising from their use.</p></section>
<section class="rv"><h2><i>08</i>Changes to these terms</h2><p>If the terms change, the date above changes with them.</p></section>
<section class="rv"><h2><i>09</i>Contact</h2><p>{CONTACT}</p></section>'''


CSS = r'''*{box-sizing:border-box;margin:0}
:root{--ink:#100B07;--leather:#1E140C;--panel:#2A1C10;--line:#5A4126;--gold:#D9A441;--gold2:#F0CB7A;--gold3:#FFE9A8;--paper:#F2E3BF;--paper2:#C9B38A;--brick:#B8533A;--disp:"Cinzel","Trajan Pro","Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif;--body:"Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif}
html{scroll-behavior:smooth;scroll-padding-top:70px}
html,body{overflow-x:clip}
body{background:var(--ink);color:var(--paper);font:18px/1.7 var(--body);-webkit-font-smoothing:antialiased}
a{color:var(--gold2);text-underline-offset:3px}a:hover{color:#fff}
.container{max-width:1120px;margin:0 auto;padding:0 24px}.narrow{max-width:800px}
#progress{position:fixed;left:0;top:0;height:3px;width:0;z-index:60;background:linear-gradient(90deg,var(--brick),var(--gold),var(--gold3));box-shadow:0 0 14px var(--gold)}
.grain{position:fixed;inset:0;z-index:50;pointer-events:none;opacity:.07;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .9  0 0 0 0 .75  0 0 0 0 .5  0 0 0 .9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.glow{position:fixed;width:520px;height:520px;margin:-260px 0 0 -260px;left:0;top:0;z-index:1;pointer-events:none;background:radial-gradient(circle,rgba(240,203,122,.13),transparent 62%);transition:opacity .4s}
#embers{position:fixed;inset:0;width:100%;height:100%;z-index:2;pointer-events:none}
header.top{position:fixed;top:0;left:0;right:0;z-index:40;transition:background .3s,backdrop-filter .3s,border-color .3s;border-bottom:1px solid transparent}
header.top.stuck{background:rgba(16,11,7,.82);backdrop-filter:blur(10px);border-color:var(--line)}
nav{display:flex;align-items:center;gap:22px;max-width:1220px;margin:0 auto;padding:10px 24px}
.brand{white-space:nowrap;display:flex;align-items:center;gap:11px;color:var(--gold2);text-decoration:none;font:700 17px var(--disp);letter-spacing:.06em}
.brand b{color:var(--paper);font-weight:600}.brand img{border-radius:50%;border:2px solid var(--gold);box-shadow:0 0 18px rgba(217,164,65,.5)}
nav ul{display:flex;gap:6px;list-style:none;padding:0;margin-left:auto}
nav ul a{white-space:nowrap;color:var(--paper2);text-decoration:none;font:600 13px var(--disp);letter-spacing:.12em;text-transform:uppercase;padding:8px 12px;border-radius:999px;transition:.25s}
nav ul a:hover{color:var(--gold3);background:rgba(217,164,65,.14)}
.burger{display:none;background:none;border:1px solid var(--line);border-radius:10px;width:42px;height:38px;margin-left:auto;cursor:pointer;flex-direction:column;gap:6px;align-items:center;justify-content:center}.burger i{display:block;width:20px;height:2px;background:var(--gold2)}
.btn{position:relative;display:inline-block;overflow:hidden;background:linear-gradient(180deg,var(--gold3),var(--gold) 60%,#B07F22);color:#2A1A08!important;font:700 14px var(--disp);letter-spacing:.14em;text-transform:uppercase;padding:15px 30px;border-radius:999px;text-decoration:none;border:1px solid #8a6420;box-shadow:0 8px 30px rgba(217,164,65,.35),inset 0 1px 0 #fff8;transition:transform .25s,box-shadow .25s}
.btn:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 14px 40px rgba(217,164,65,.55),inset 0 1px 0 #fff8}
.btn:after{content:"";position:absolute;top:0;left:-70%;width:45%;height:100%;background:linear-gradient(100deg,transparent,#fff9,transparent);transform:skewX(-20deg);animation:sweep 3.6s infinite}
@keyframes sweep{0%,55%{left:-70%}100%{left:130%}}
.btn.ghost{background:rgba(16,11,7,.5);color:var(--gold2)!important;border:1px solid var(--gold);box-shadow:inset 0 0 0 1px rgba(217,164,65,.15)}.btn.ghost:after{display:none}
.btn.ghost:hover{background:rgba(217,164,65,.16)}.btn.sm{padding:10px 20px;font-size:12px}
.cta{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
a:focus-visible,button:focus-visible,summary:focus-visible{outline:2px solid var(--gold3);outline-offset:3px;border-radius:6px}
.skip{position:fixed;left:12px;top:-60px;z-index:100;background:var(--gold);color:#2A1A08;padding:10px 16px;border-radius:8px;font:700 13px var(--disp);transition:top .2s}.skip:focus{top:12px}
.block+.block:before{content:"";position:absolute;top:0;left:50%;width:min(520px,70%);height:1px;transform:translateX(-50%);background:linear-gradient(90deg,transparent,var(--gold),transparent);opacity:.7}
.backtop{position:fixed;right:20px;bottom:20px;z-index:45;width:48px;height:48px;border-radius:50%;border:1px solid var(--gold);background:rgba(16,11,7,.85);color:var(--gold2);font-size:20px;cursor:pointer;opacity:0;transform:translateY(20px);pointer-events:none;transition:.3s;backdrop-filter:blur(6px)}.backtop.show{opacity:1;transform:none;pointer-events:auto}.backtop:hover{background:var(--gold);color:#2A1A08}
nav ul a.on{color:var(--gold3);background:rgba(217,164,65,.18)}
.burger i{transition:.3s}.burger[aria-expanded=true] i:first-child{transform:translateY(4px) rotate(45deg)}.burger[aria-expanded=true] i:last-child{transform:translateY(-4px) rotate(-45deg)}
/* reveal */
.rv{opacity:0;transform:translateY(34px);transition:opacity .9s cubic-bezier(.2,.7,.2,1) var(--d,0s),transform .9s cubic-bezier(.2,.7,.2,1) var(--d,0s)}
.rv.zoom{transform:scale(.8)}.rv.in{opacity:1;transform:none}
/* hero */
.hero{position:relative;min-height:100vh;min-height:100svh;display:grid;place-items:center;overflow:hidden;background:radial-gradient(1000px 700px at 50% 62%,#6B4220 0,#2A190C 45%,var(--ink) 80%);padding:110px 0 190px}
.rays{position:absolute;left:50%;top:62%;width:260vmax;height:260vmax;margin:-130vmax 0 0 -130vmax;background:repeating-conic-gradient(from 0deg,rgba(240,203,122,.16) 0 3deg,transparent 3deg 9deg);-webkit-mask:radial-gradient(circle,#000 0,transparent 36%);mask:radial-gradient(circle,#000 0,transparent 36%);animation:spin 160s linear infinite;pointer-events:none}
.rays.small{top:50%;width:150vmax;height:150vmax;margin:-75vmax 0 0 -75vmax;opacity:.55}
@keyframes spin{to{transform:rotate(360deg)}}
.sun{position:absolute;left:50%;top:62%;width:560px;height:560px;margin:-280px 0 0 -280px;border-radius:50%;background:radial-gradient(circle,#FFE9A8 0,#F0B952 32%,rgba(217,164,65,.0) 68%);filter:blur(4px);opacity:.85;animation:pulse 7s ease-in-out infinite}
@keyframes pulse{50%{transform:scale(1.07);opacity:1}}
.skyline{position:absolute;left:-4vw;right:-4vw;bottom:-2px;height:46vh;min-height:260px;pointer-events:none}.sky-svg{width:100%;height:100%;display:block}
.sky-svg .blades{animation:spin 14s linear infinite}
.hero:after{content:"";position:absolute;left:0;right:0;bottom:0;height:90px;background:linear-gradient(transparent,var(--ink))}
.hero-in{position:relative;z-index:5;text-align:center;padding:0 22px}.hero-in:before{content:"";position:absolute;inset:-40px -10%;z-index:-1;background:radial-gradient(closest-side,rgba(16,11,7,.62),transparent);pointer-events:none}
.seal{position:relative;width:min(300px,64vw);aspect-ratio:1;margin:0 auto 14px}.seal img{position:absolute;left:15%;top:15%;width:70%;height:70%;display:block;border-radius:50%;border:4px solid var(--gold);box-shadow:0 0 0 8px rgba(217,164,65,.18),0 0 60px rgba(240,203,122,.6),0 20px 50px #000a;animation:float 6s ease-in-out infinite}
.seal .ring{position:absolute;inset:0;width:100%;height:100%;animation:spin 44s linear infinite}.ring text{fill:var(--gold2);font:700 13px var(--disp)}
@keyframes float{50%{transform:translateY(-12px)}}
.title{font:900 clamp(40px,8.6vw,108px)/1 var(--disp);letter-spacing:.03em;text-transform:uppercase;margin:6px 0 20px;filter:drop-shadow(0 4px 0 #3b230b) drop-shadow(0 12px 30px rgba(0,0,0,.6))}
.title .w{background:linear-gradient(180deg,#FFF3C8 0,var(--gold2) 38%,var(--gold) 62%,#8F5F18);-webkit-background-clip:text;background-clip:text;color:transparent;display:inline-block;opacity:0;transform:translateY(60px) rotateX(-70deg);animation:word 1s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(.12s * var(--k,0) + .25s)}
@keyframes word{to{opacity:1;transform:none}}
.tag{font-size:clamp(17px,2.2vw,23px);color:var(--paper);max-width:720px;margin:0 auto 32px;text-shadow:0 2px 14px #000}
.cue{position:absolute;bottom:34px;left:50%;margin-left:-14px;width:28px;height:46px;border:2px solid var(--gold2);border-radius:20px;z-index:6;opacity:.9}.cue i{position:absolute;left:50%;top:8px;width:4px;height:9px;margin-left:-2px;border-radius:2px;background:var(--gold2);animation:wheel 1.8s infinite}
@keyframes wheel{0%{opacity:0;transform:translateY(0)}30%{opacity:1}100%{opacity:0;transform:translateY(16px)}}
/* ribbon */
.ribbon{position:relative;z-index:6;overflow:hidden;background:linear-gradient(180deg,#3a2412,#1E140C);border-block:1px solid var(--gold);padding:14px 0;transform:rotate(-1.2deg);margin:-26px -20px 0;box-shadow:0 10px 40px #000a}
.track{display:flex;gap:30px;width:max-content;animation:marq 55s linear infinite;font:700 22px var(--disp);letter-spacing:.2em;text-transform:uppercase;color:var(--gold2)}.track b{color:var(--brick)}
@keyframes marq{to{transform:translateX(-50%)}}
/* sections */
main{position:relative;z-index:3}
.block{position:relative;padding:120px 0}
.kicker{display:flex;align-items:center;justify-content:center;gap:14px;font:700 13px var(--disp);letter-spacing:.3em;text-transform:uppercase;color:var(--gold);margin-bottom:16px}
.kicker i{display:block;width:64px;height:1px;background:linear-gradient(90deg,transparent,var(--gold))}.kicker i:last-child{transform:scaleX(-1)}
h2,.sub,.tag{text-wrap:balance}
h2{font:800 clamp(32px,5.4vw,62px)/1.08 var(--disp);text-align:center;color:var(--paper);margin-bottom:16px;text-transform:uppercase;letter-spacing:.02em}
h2 em{font-style:normal;background:linear-gradient(180deg,#FFF3C8,var(--gold) 70%,#9A6B1F);-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{color:var(--paper2);text-align:center;max-width:680px;margin:0 auto 40px;font-size:19px}
/* pinned fan */
.pin{position:relative;height:300vh}.stick{position:sticky;top:0;height:100vh;display:flex;flex-direction:column;justify-content:center;overflow:hidden;padding-top:70px;background:radial-gradient(900px 500px at 50% 80%,rgba(120,70,25,.45),transparent 70%)}
.stick .sub{margin-bottom:10px}
.fan{position:relative;height:min(62vh,640px);margin-top:10px}
.phone{position:absolute;left:50%;top:0;width:min(30vh,290px);margin-left:calc(min(30vh,290px) / -2);display:block;text-decoration:none;color:inherit;transform:translateX(calc(var(--i) * var(--p,0) * 1.08 * min(30vh,290px) + var(--i) * var(--p,0) * 18px)) translateY(calc(var(--p,0) * (var(--i) * var(--i)) * 14px)) rotate(calc(var(--i) * var(--p,0) * 6deg));transition:filter .3s;z-index:calc(10 - var(--i) * var(--i))}
.phone:hover{filter:brightness(1.12);z-index:30}.phone:hover .bezel{transform:translateY(-14px) scale(1.06)}
.bezel{position:relative;overflow:hidden;aspect-ratio:9/16;border-radius:24px;padding:5px;background:linear-gradient(145deg,#6a4a20,#2a1a0a 40%,#8a6420);box-shadow:0 22px 50px #000c,0 0 0 1px #000;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
.bezel img{display:block;width:100%;height:100%;object-fit:cover;border-radius:19px}.bezel:before{content:"";position:absolute;z-index:3;top:11px;left:50%;width:34%;height:7px;margin-left:-17%;border-radius:6px;background:#000a}
.shine{position:absolute;inset:5px;border-radius:19px;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.22) 45%,transparent 60%);transform:translateX(-120%);transition:transform .9s}.phone:hover .shine{transform:translateX(120%)}
.cap{position:absolute;left:50%;top:100%;width:260px;margin:16px 0 0 -130px;text-align:center;opacity:0;transition:opacity .3s;pointer-events:none;background:rgba(16,11,7,.9);border:1px solid var(--line);border-radius:12px;padding:8px 12px}.phone:hover .cap{opacity:1}.cap b{display:block;font:700 11px var(--disp);letter-spacing:.2em;color:var(--gold);text-transform:uppercase}.cap span{display:block;font-size:14px;line-height:1.35;color:var(--paper)}
.fanhint{text-align:center;font:600 12px var(--disp);letter-spacing:.25em;text-transform:uppercase;color:var(--paper2);margin-top:36px;opacity:calc(1 - var(--p,0) * 3)}
/* numbers */
.numbers{background:linear-gradient(180deg,transparent,rgba(42,26,12,.8) 20%,rgba(42,26,12,.8) 80%,transparent)}
.nums{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:18px;margin:46px 0 50px}
.num{text-align:center;padding:26px 10px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(180deg,rgba(255,233,168,.06),rgba(255,233,168,0));position:relative;overflow:hidden}
.num:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 0,rgba(217,164,65,.28),transparent 65%);opacity:0;transition:.4s}.num:hover:before{opacity:1}
.num strong{display:block;font:900 clamp(44px,6vw,70px)/1 var(--disp);background:linear-gradient(180deg,#FFF3C8,var(--gold) 70%,#9A6B1F);-webkit-background-clip:text;background-clip:text;color:transparent}.num span{display:block;font:600 12px var(--disp);letter-spacing:.2em;text-transform:uppercase;color:var(--paper2);margin-top:6px}
.fmts{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}.fmts div{padding:14px 18px;border-left:3px solid var(--gold);background:rgba(255,233,168,.05);border-radius:0 12px 12px 0;transition:.3s}.fmts div:hover{background:rgba(217,164,65,.16);transform:translateX(6px)}
.fmts b{display:block;font:700 15px var(--disp);color:var(--gold2);letter-spacing:.06em}.fmts span{font-size:15px;color:var(--paper2)}
/* timeline */
.tl{position:relative;max-width:980px;margin:60px auto 0}.tl .line{position:absolute;left:50%;top:0;bottom:0;width:3px;margin-left:-1.5px;background:var(--line);border-radius:2px}
.tl .line i{display:block;width:100%;height:0;background:linear-gradient(180deg,var(--gold3),var(--gold),var(--brick));box-shadow:0 0 16px var(--gold);border-radius:2px}
.era{position:relative;width:50%;padding:0 46px 30px 0;margin-bottom:4px}.era.r{margin-left:50%;padding:0 0 30px 46px}
.era .dot{position:absolute;top:26px;right:-9px;width:18px;height:18px;border-radius:50%;background:var(--ink);border:3px solid var(--b);box-shadow:0 0 0 0 var(--b);transition:.5s}.era.r .dot{right:auto;left:-9px}
.era.in .dot{background:var(--a);box-shadow:0 0 22px 4px var(--b)}
.era .card{position:relative;padding:22px 24px;border-radius:16px;border:1px solid color-mix(in srgb,var(--b) 45%,transparent);background:linear-gradient(145deg,rgba(42,28,16,.95),rgba(24,15,8,.95));overflow:hidden;transition:transform .35s,box-shadow .35s}
.era .card:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 18px 50px color-mix(in srgb,var(--b) 30%,transparent)}
.era .ico{position:absolute;right:18px;top:18px;width:38px;height:38px;fill:none;stroke:var(--b);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;opacity:.75;transition:.4s}.era .card:hover .ico{opacity:1;transform:rotate(-8deg) scale(1.12)}
.era small{font:700 12px var(--disp);letter-spacing:.22em;text-transform:uppercase;color:var(--b)}.era h3{font:800 28px/1.1 var(--disp);letter-spacing:.03em;margin:4px 0 6px;color:var(--paper);text-transform:uppercase}.era p{color:var(--paper2);font-size:16px;line-height:1.5}
.era .bar{position:absolute;left:0;bottom:0;height:4px;width:100%;background:linear-gradient(90deg,var(--a),var(--b));transform:scaleX(0);transform-origin:left;transition:transform 1.2s .3s}.era.in .bar{transform:scaleX(1)}
.rv.l:not(.in){transform:translateX(-70px)}.rv.r:not(.in){transform:translateX(70px)}
/* steps */
.steps{position:relative;list-style:none;max-width:760px;margin:50px auto 0;padding:0}.sline{position:absolute;left:25px;top:20px;bottom:20px;width:3px;background:var(--line)}.sline i{display:block;width:100%;height:0;background:linear-gradient(180deg,var(--gold3),var(--gold));box-shadow:0 0 14px var(--gold)}
.step{position:relative;display:flex;gap:26px;padding:0 0 38px;align-items:flex-start}.step .n{flex:none;display:grid;place-items:center;width:52px;height:52px;border-radius:50%;border:2px solid var(--line);background:var(--ink);font:800 20px var(--disp);color:var(--paper2);z-index:2;transition:.5s}
.step.in .n{background:linear-gradient(180deg,var(--gold3),var(--gold));color:#2a1a08;border-color:var(--gold2);box-shadow:0 0 26px rgba(240,203,122,.65)}
.step b{display:block;font:800 22px var(--disp);letter-spacing:.05em;text-transform:uppercase;color:var(--gold2)}.step p{color:var(--paper2);margin-top:2px}
/* map */
.two{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}.two.rev .copy{order:2}
.two .copy .kicker{justify-content:flex-start}.two .copy h2,.two .copy .sub{text-align:left;margin-left:0}
.ticks{list-style:none;padding:0}.ticks li{padding:8px 0 8px 34px;position:relative;color:var(--paper)}.ticks li:before{content:"\2726";position:absolute;left:0;color:var(--gold);font-size:20px}
.map{filter:drop-shadow(0 30px 40px #000c);transform-style:preserve-3d}.map svg{width:100%;display:block}
.map .x{opacity:var(--xo,0);transform-origin:center;transform-box:fill-box;animation:throb 1.4s ease-in-out infinite}@keyframes throb{50%{transform:scale(1.25)}}
.compass{animation:wob 8s ease-in-out infinite;transform-box:fill-box;transform-origin:center}@keyframes wob{50%{transform:rotate(14deg)}}
/* colour */
.colour .phone.big{position:relative;left:auto;top:auto;margin:0 auto;width:min(320px,70vw);transform:none}
.stack{position:relative;width:100%;height:100%;border-radius:19px;overflow:hidden}.stack img{position:absolute;inset:0;opacity:0;transform:scale(1.06);transition:opacity .7s,transform 1.2s}.stack img.on{opacity:1;transform:none}
.tbs{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px}.tb{cursor:pointer;display:flex;align-items:center;gap:9px;padding:10px 18px;border-radius:999px;border:1px solid var(--line);background:rgba(255,233,168,.05);color:var(--paper);font:700 13px var(--disp);letter-spacing:.12em;text-transform:uppercase;transition:.25s}
.tb i{width:16px;height:16px;border-radius:50%;box-shadow:0 0 0 2px rgba(255,255,255,.25)}.tb:hover{border-color:var(--gold);transform:translateY(-2px)}.tb.on{background:linear-gradient(180deg,var(--gold3),var(--gold));color:#2A1A08;border-color:var(--gold2);box-shadow:0 8px 28px rgba(217,164,65,.4)}
.tname{color:var(--paper2);min-height:56px}
/* faq */
details{border:1px solid var(--line);border-radius:14px;background:rgba(42,28,16,.7);margin-bottom:12px;overflow:hidden;transition:.3s}details[open]{border-color:var(--gold);box-shadow:0 10px 40px rgba(217,164,65,.14)}
summary{cursor:pointer;list-style:none;padding:20px 56px 20px 24px;font:700 18px var(--disp);letter-spacing:.04em;color:var(--gold2);position:relative}summary::-webkit-details-marker{display:none}
summary:after{content:"+";position:absolute;right:24px;top:50%;margin-top:-16px;font:400 30px/1 var(--disp);color:var(--gold);transition:transform .3s}details[open] summary:after{transform:rotate(45deg)}
details p{padding:0 24px 22px;color:var(--paper2);animation:drop .4s}@keyframes drop{from{opacity:0;transform:translateY(-8px)}}
/* finale */
.finale{position:relative;z-index:3;text-align:center;padding:150px 0 130px;overflow:hidden;background:radial-gradient(800px 500px at 50% 50%,rgba(150,90,30,.5),transparent 70%)}
.finale .container{position:relative;z-index:2}.medal{position:relative;width:120px;height:120px;margin:0 auto 26px}.medal img{position:relative;z-index:2;display:block;border-radius:50%;border:3px solid var(--gold);box-shadow:0 0 70px rgba(240,203,122,.7);animation:float 6s ease-in-out infinite}.medal .rays{z-index:0;opacity:.7}
.finale:before,.finale:after{content:"";position:absolute;left:0;right:0;z-index:1;pointer-events:none}.finale:before{top:0;height:240px;background:linear-gradient(var(--ink),transparent)}.finale:after{bottom:0;height:160px;background:linear-gradient(transparent,#0b0705)}
/* footer */
footer{position:relative;z-index:3;border-top:1px solid var(--gold);background:#0b0705;padding:34px 0 40px;color:var(--paper2);font-size:15px}
.foot{display:flex;gap:26px;justify-content:space-between;flex-wrap:wrap;align-items:center}.fbrand{display:flex;gap:16px;align-items:center}.fbrand img{border-radius:50%;border:2px solid var(--gold)}
.foot ul{list-style:none;padding:0;display:flex;gap:18px;flex-wrap:wrap}.foot a{color:var(--paper2);text-decoration:none;font:600 13px var(--disp);letter-spacing:.1em;text-transform:uppercase}.foot a:hover{color:var(--gold3)}
/* legal pages */
.lhero{position:relative;overflow:hidden;padding:150px 0 50px;text-align:center;background:radial-gradient(900px 400px at 50% 100%,rgba(150,90,30,.45),transparent 70%)}
.lhero h1{font:900 clamp(38px,7vw,78px)/1.05 var(--disp);text-transform:uppercase;background:linear-gradient(180deg,#FFF3C8,var(--gold) 70%,#9A6B1F);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:12px;position:relative}
.lhero .container{position:relative}.lhero .sub{margin-bottom:10px}.meta{font:600 12px var(--disp);letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}
.doc{max-width:820px;padding-bottom:70px;position:relative;z-index:3}.doc section{margin:0 0 18px;padding:26px 30px;border:1px solid var(--line);border-radius:16px;background:rgba(42,28,16,.7)}
.doc h2{text-align:left;font-size:22px;margin:0 0 10px;color:var(--gold2);display:flex;gap:14px;align-items:baseline}.doc h2 i{font:700 14px var(--disp);color:var(--brick);font-style:normal}
.doc p,.doc li{color:#E8D8B2;margin:8px 0}.doc ul{padding-left:22px}
.e404{min-height:100vh;display:grid;place-items:center;text-align:center;padding:120px 24px}
@media(max-width:1020px){
 nav ul{position:fixed;left:0;right:0;top:62px;flex-direction:column;background:rgba(16,11,7,.97);padding:16px;border-bottom:1px solid var(--gold);transform:translateY(-130%);transition:.35s;margin:0}nav ul.open{transform:none}nav .btn.sm{display:none}.burger{display:flex}}
@media(max-width:860px){
 .brand span{font-size:14px}.block{padding:80px 0}.two{grid-template-columns:1fr;gap:30px}.two.rev .copy{order:0}.two .copy .kicker{justify-content:center}.two .copy h2,.two .copy .sub{text-align:center}
 .pin{height:auto}.stick{position:static;height:auto;display:block;padding:100px 0 40px}.fan{height:auto;display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:20px 24px 30px}
 .phone{position:static;flex:none;width:200px;margin:0;transform:none!important;scroll-snap-align:center}.cap{position:static;opacity:1;width:auto;margin:12px 0 0;background:none;border:0}.fanhint{display:none}
 .tl .line{left:18px}.era,.era.r{width:100%;margin-left:0;padding:0 0 22px 48px}.era .dot,.era.r .dot{left:9px;right:auto}.rv.l:not(.in),.rv.r:not(.in){transform:translateY(34px)}
 .skyline{height:34vh}.ribbon{margin-top:-14px}.sun{width:360px;height:360px;margin:-180px 0 0 -180px;opacity:.5}.kicker{letter-spacing:.18em;font-size:11px}.kicker i{width:22px}.track{font-size:17px}h2{overflow-wrap:anywhere}.btn{padding:14px 24px}.cta .btn{width:100%;max-width:340px;text-align:center}.fanhint2{display:block}}
@media(hover:none){.glow{display:none}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.rv{opacity:1;transform:none}.title .w{opacity:1;transform:none}.rays,.sun{animation:none}#embers{display:none}}
'''

JS = r'''(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var vh = function () { return window.innerHeight; };

  // title words: stagger index
  $$('.title .w').forEach(function (w, i) { w.style.setProperty('--k', i); });

  // reveal on scroll
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  // counters
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, to = +el.dataset.to, t0 = performance.now();
      (function tick(t) { var k = clamp((t - t0) / 1600, 0, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 4))); if (k < 1 && !reduce) requestAnimationFrame(tick); else el.textContent = to; })(t0);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-to]').forEach(function (el) { cio.observe(el); });

  // header, progress, parallax, scroll-linked sections
  var bar = $('#progress'), head = $('header.top'), hero = $('.hero');
  var pin = $('.pin'), fan = $('.fan'), tl = $('#tl'), tlf = $('#tlfill'), st = $('#steps'), stf = $('#sfill'), map = $('.map'), trail = $('#rmask');
  var par = $$('[data-speed]'), mx = 0, my = 0, ticking = false;
  var stepsEls = st ? $$('.step', st) : [];
  function frac(el, start, end) { var r = el.getBoundingClientRect(); return clamp((vh() * start - r.top) / (r.height + vh() * (start - end)), 0, 1); }
  function frame() {
    ticking = false;
    var y = window.scrollY, h = document.documentElement;
    if (bar) bar.style.width = (y / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%';
    if (head) head.classList.toggle('stuck', y > 40);
    if (!reduce) {
      par.forEach(function (el) { var s = +el.dataset.speed, m = +el.dataset.mx || 0; el.style.transform = 'translate3d(' + (mx * m) + 'px,' + (y * s + my * m * 0.5) + 'px,0)'; });
      $$('[data-mx]:not([data-speed])').forEach(function (el) { var m = +el.dataset.mx; el.style.translate = (mx * m) + 'px ' + (my * m * .5) + 'px'; });
    }
    if (pin && fan && window.innerWidth > 860) { var r = pin.getBoundingClientRect(); var p = clamp(-r.top / (r.height - vh()) * 1.3, 0, 1); fan.parentNode.style.setProperty('--p', reduce ? 1 : p.toFixed(3)); }
    else if (fan) fan.parentNode.style.setProperty('--p', 1);
    if (tl && tlf) tlf.style.height = (frac(tl, 0.65, 0.35) * 100) + '%';
    if (st && stf) { var f = frac(st, 0.7, 0.4); stf.style.height = (f * 100) + '%'; }
    if (map && trail) { var q = clamp(frac(map, 0.85, 0.35) * 1.15, 0, 1); trail.setAttribute('stroke-dashoffset', (1 - q).toFixed(3)); map.querySelector('.x').style.opacity = q > 0.97 ? 1 : 0; }
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  window.addEventListener('mousemove', function (e) {
    mx = (e.clientX / window.innerWidth - 0.5); my = (e.clientY / window.innerHeight - 0.5);
    var g = $('#glow'); if (g) g.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
    if (hero) req();
  });
  frame();

  // 3D tilt on cards
  $$('.era .card, .num').forEach(function (c) {
    c.addEventListener('mousemove', function (e) { var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = 'perspective(700px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-4px)'; });
    c.addEventListener('mouseleave', function () { c.style.transform = ''; });
  });

  // back to top and menu scroll-spy
  var bt = $('.backtop');
  if (bt) { bt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); }); addEventListener('scroll', function () { bt.classList.toggle('show', scrollY > 900); }, { passive: true }); }
  var links = $$('#menu a'), secs = links.map(function (a) { var h = a.getAttribute('href'); return h.indexOf('#') > -1 && h.indexOf('index.html') === 0 ? $(h.slice(h.indexOf('#'))) : null; });
  if (secs.some(Boolean) && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a, i) { a.classList.toggle('on', secs[i] === e.target); }); }); }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { if (s) spy.observe(s); });
  }

  // menu
  var bg = $('.burger'), menu = $('#menu');
  if (bg) { bg.addEventListener('click', function () { var o = menu.classList.toggle('open'); bg.setAttribute('aria-expanded', o); }); $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); }); }); }

  // colour themes
  var names = {
    gilded: 'Gilded — gold leaf on dark leather, each era with its own accents.', sepia: 'Sepia — a faded photograph, copper and old gold.', ember: 'Ember — fire and brass on red-brown grounds.',
    regal: 'Regal — oxblood and gold, the colours of courts and crowns.', bronze: 'Bronze — ochre and olive-brown, roads and camps.', ivory: 'Ivory — bone and umber, a daylight manuscript.', smoke: 'Smoke — ash and umber with a lantern glow.'
  };
  var tbs = $$('.tb'), sls = $$('.tsl'), tn = $('#tname'), auto = true, idx = 0;
  function pick(k) { tbs.forEach(function (b) { b.classList.toggle('on', b.dataset.k === k); }); sls.forEach(function (s) { s.classList.toggle('on', s.dataset.k === k); }); if (tn) tn.textContent = names[k]; }
  tbs.forEach(function (b, i) { b.addEventListener('click', function () { auto = false; idx = i; pick(b.dataset.k); }); });
  if (tbs.length && !reduce) setInterval(function () { if (!auto) return; idx = (idx + 1) % tbs.length; pick(tbs[idx].dataset.k); }, 3200);

  // embers (a glow sprite drawn once and stamped per frame; paused while the tab is hidden)
  var cv = $('#embers');
  if (cv && !reduce) {
    var cx = cv.getContext('2d'), W, H, P = [], dpr = Math.min(2, window.devicePixelRatio || 1), spr = document.createElement('canvas');
    spr.width = spr.height = 64; var sg = spr.getContext('2d'), gr = sg.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,225,150,1)'); gr.addColorStop(0.35, 'rgba(240,180,80,.45)'); gr.addColorStop(1, 'rgba(217,164,65,0)'); sg.fillStyle = gr; sg.fillRect(0, 0, 64, 64);
    function size() { W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr; }
    size(); addEventListener('resize', size);
    var n = innerWidth < 700 ? 34 : 64;
    for (var i = 0; i < n; i++) P.push({ x: Math.random(), y: Math.random(), r: Math.random() * 12 + 5, v: Math.random() * .00035 + .00012, a: Math.random() * 6.28, s: Math.random() * .7 + .25 });
    (function loop() {
      if (!document.hidden) {
        cx.clearRect(0, 0, W, H);
        P.forEach(function (p) {
          p.y -= p.v * 16; p.a += .01; if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
          cx.globalAlpha = p.s; var r = p.r * dpr; cx.drawImage(spr, (p.x + Math.sin(p.a) * .02) * W - r, p.y * H - r, r * 2, r * 2);
        });
      }
      requestAnimationFrame(loop);
    })();
  }
})();
'''


def build() -> None:
    (D / "site.css").write_text(CSS, encoding="utf-8")
    (D / "site.js").write_text(JS, encoding="utf-8")
    (D / "index.html").write_text(index(), encoding="utf-8")
    (D / "privacy.html").write_text(legal("privacy.html", "Privacy Policy", "Privacy Policy: no accounts, cookies or trackers; which YouTube data the channel uses and why.",
                                          "What data The Chronicles of History handles and why. The short version: no accounts, no cookies, no trackers, and nothing is ever sold.", PRIVACY, "Last updated: 24 November 2026"), encoding="utf-8")
    (D / "terms.html").write_text(legal("terms.html", "Terms of Service", "The rules for the Chronicles of History website and channels, in plain words.",
                                        "The rules for this website and the channels, in plain words: what the project is and how to read the videos.", TERMS, "Last updated: 24 November 2026"), encoding="utf-8")
    e404 = (head("Page not found | The Chronicles of History", "Page not found.", "404.html")
            + '<main id="main" class="e404"><div><div class="rays small"></div><p class="kicker"><i></i>Error 404<i></i></p><h1 class="title" style="font-size:clamp(40px,9vw,100px)"><span class="w">Lost</span> <span class="w">to</span> <span class="w">history</span></h1><p class="sub">This page is not in the archive.</p><div class="cta"><a class="btn" href="index.html"><span>Back to the chronicles</span></a></div></div></main>' + foot())
    (D / "404.html").write_text(e404, encoding="utf-8")
    (D / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {BASE}/sitemap.xml\n", encoding="utf-8")
    (D / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"  <url><loc>{BASE}/{p}</loc></url>\n" for p in ["", "terms.html", "privacy.html"]) + "</urlset>\n", encoding="utf-8")


if __name__ == "__main__":
    build()
