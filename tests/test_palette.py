"""The official palette (guide/palette.md, remotion_studio/src/chronicle/palette.ts): every colour in the source is brown, gold, red-brown or a neutral. Never blue, green or purple."""
import colorsys
import re
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "remotion_studio" / "src"
HEX = re.compile(r"#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b")
RGB = re.compile(r"rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)")


def is_warm(r: float, g: float, b: float) -> bool:
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    h *= 360
    return s <= 0.07 or l < 0.015 or l > 0.985 or h <= 62 or h >= 338


def off_palette():
    bad = []
    for f in list(SRC.rglob("*.ts")) + list(SRC.rglob("*.tsx")):
        text = f.read_text(encoding="utf-8")
        for m in HEX.finditer(text):
            h = m.group(1)
            h = "".join(c * 2 for c in h) if len(h) == 3 else h
            r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
            if not is_warm(r, g, b):
                bad.append(f"{f.relative_to(SRC)}: #{m.group(1)}")
        for m in RGB.finditer(text):
            r, g, b = (int(x) / 255 for x in m.groups())
            if not is_warm(r, g, b):
                bad.append(f"{f.relative_to(SRC)}: {m.group(0)}")
    return bad


def test_no_blue_green_or_purple_anywhere_in_the_source():
    assert off_palette() == []


def test_the_palette_file_and_the_guide_agree():
    ts = (SRC / "chronicle" / "palette.ts").read_text(encoding="utf-8")
    guide = (SRC.parent.parent / "guide" / "palette.md").read_text(encoding="utf-8").lower()
    for name, hex_ in re.findall(r"(\w+): '(#[0-9A-Fa-f]{6})'", ts.split("export const ERA_ACCENTS")[0]):
        assert hex_.lower() in guide, f"{name} {hex_} is missing from guide/palette.md"


def test_every_era_has_a_warm_accent_pair():
    ts = (SRC / "chronicle" / "palette.ts").read_text(encoding="utf-8")
    block = ts.split("export const ERA_ACCENTS")[1].split("};")[0]
    for hex_ in re.findall(r"#[0-9A-Fa-f]{6}", block):
        h = hex_[1:]
        assert is_warm(*(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))), hex_
    assert len(re.findall(r"accent: '#", block)) == 11
