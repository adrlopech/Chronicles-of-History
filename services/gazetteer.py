"""A small gazetteer of places that history videos keep returning to, with their real latitude and longitude.

The `map` scenes are drawn on a real coastline (remotion_studio/src/chronicle/geo). The script writer gives each place as "Name|lat|lon"; a language model is often a few degrees off, and
sometimes far off, so every place that this table knows is snapped to its real position (`fix_map_places`). Unknown places keep the coordinates they came with.
"""
import math
import re
from typing import Any, Dict, Optional, Tuple

# name (lower case, no accents) -> (latitude, longitude)
PLACES: Dict[str, Tuple[float, float]] = {
    # the Mediterranean and the ancient world
    "rome": (41.90, 12.50), "carthage": (36.85, 10.32), "athens": (37.98, 23.73), "sparta": (37.08, 22.43), "alexandria": (31.20, 29.92), "cairo": (30.04, 31.24), "giza": (29.98, 31.13),
    "thebes": (25.72, 32.66), "memphis": (29.85, 31.25), "jerusalem": (31.77, 35.21), "babylon": (32.54, 44.42), "nineveh": (36.36, 43.15), "persepolis": (29.93, 52.89), "troy": (39.96, 26.24),
    "constantinople": (41.01, 28.98), "istanbul": (41.01, 28.98), "byzantium": (41.01, 28.98), "damascus": (33.51, 36.29), "baghdad": (33.31, 44.37), "mecca": (21.42, 39.83), "medina": (24.47, 39.61),
    "syracuse": (37.07, 15.29), "pompeii": (40.75, 14.49), "ravenna": (44.42, 12.20), "milan": (45.46, 9.19), "venice": (45.44, 12.32), "florence": (43.77, 11.26), "genoa": (44.41, 8.93),
    "naples": (40.85, 14.27), "marathon": (38.15, 23.96), "thermopylae": (38.79, 22.54), "salamis": (37.96, 23.50), "delphi": (38.48, 22.50), "olympia": (37.64, 21.63), "knossos": (35.30, 25.16),
    "cannae": (41.30, 16.13), "zama": (36.07, 9.35), "actium": (38.95, 20.76), "rubicon": (44.08, 12.40), "gibraltar": (36.14, -5.35), "cadiz": (36.53, -6.29), "tyre": (33.27, 35.20),
    "petra": (30.33, 35.44), "palmyra": (34.55, 38.27), "antioch": (36.20, 36.16), "ephesus": (37.94, 27.34), "mount vesuvius": (40.82, 14.43), "hippo": (36.90, 7.77),
    # western Europe
    "london": (51.51, -0.13), "londinium": (51.51, -0.10), "paris": (48.86, 2.35), "lutetia": (48.86, 2.35), "madrid": (40.42, -3.70), "lisbon": (38.72, -9.14), "seville": (37.39, -5.98),
    "toledo": (39.86, -4.02), "barcelona": (41.39, 2.17), "granada": (37.18, -3.60), "cordoba": (37.89, -4.78), "berlin": (52.52, 13.40), "vienna": (48.21, 16.37), "prague": (50.08, 14.44),
    "amsterdam": (52.37, 4.90), "brussels": (50.85, 4.35), "waterloo": (50.68, 4.41), "aachen": (50.78, 6.08), "tours": (47.39, 0.69), "hastings": (50.86, 0.58), "york": (53.96, -1.08),
    "edinburgh": (55.95, -3.19), "dublin": (53.35, -6.26), "stonehenge": (51.18, -1.83), "canterbury": (51.28, 1.08), "calais": (50.95, 1.86), "orleans": (47.90, 1.91), "versailles": (48.80, 2.12),
    "marseille": (43.30, 5.37), "lyon": (45.76, 4.84), "bordeaux": (44.84, -0.58), "normandy": (49.18, -0.37), "dunkirk": (51.03, 2.38), "geneva": (46.20, 6.14), "zurich": (47.37, 8.54),
    "munich": (48.14, 11.58), "hamburg": (53.55, 9.99), "cologne": (50.94, 6.96), "frankfurt": (50.11, 8.68), "wittenberg": (51.87, 12.65), "trafalgar": (36.18, -6.03),
    # northern and eastern Europe
    "moscow": (55.76, 37.62), "saint petersburg": (59.93, 30.34), "st petersburg": (59.93, 30.34), "kiev": (50.45, 30.52), "kyiv": (50.45, 30.52), "warsaw": (52.23, 21.01), "stalingrad": (48.71, 44.51),
    "volgograd": (48.71, 44.51), "budapest": (47.50, 19.04), "belgrade": (44.79, 20.45), "athens greece": (37.98, 23.73), "stockholm": (59.33, 18.07), "oslo": (59.91, 10.75), "copenhagen": (55.68, 12.57),
    "lindisfarne": (55.67, -1.80), "novgorod": (58.52, 31.27), "kazan": (55.80, 49.11), "borodino": (55.52, 35.82), "leningrad": (59.93, 30.34), "gdansk": (54.35, 18.65), "auschwitz": (50.03, 19.20),
    # Asia
    "beijing": (39.90, 116.40), "peking": (39.90, 116.40), "xian": (34.34, 108.94), "chang'an": (34.34, 108.94), "nanjing": (32.06, 118.80), "shanghai": (31.23, 121.47), "tokyo": (35.68, 139.69),
    "edo": (35.68, 139.69), "kyoto": (35.01, 135.77), "osaka": (34.69, 135.50), "kagoshima": (31.60, 130.56), "nagasaki": (32.75, 129.88), "hiroshima": (34.39, 132.45), "seoul": (37.57, 126.98),
    "delhi": (28.61, 77.21), "agra": (27.18, 78.02), "mumbai": (19.08, 72.88), "calcutta": (22.57, 88.36), "varanasi": (25.32, 83.01), "samarkand": (39.65, 66.96), "bukhara": (39.77, 64.42),
    "karakorum": (47.20, 102.82), "kabul": (34.53, 69.17), "tehran": (35.69, 51.39), "isfahan": (32.65, 51.67), "mohenjo-daro": (27.33, 68.14), "angkor": (13.41, 103.87), "hanoi": (21.03, 105.85),
    "saigon": (10.82, 106.63), "bangkok": (13.76, 100.50), "singapore": (1.35, 103.82), "malacca": (2.19, 102.25), "kagoshima japan": (31.60, 130.56), "shiroyama": (31.59, 130.55), "kumamoto": (32.80, 130.71),
    "lhasa": (29.65, 91.10), "mount everest": (27.99, 86.93), "dunhuang": (40.14, 94.66), "kashgar": (39.47, 75.99), "great wall": (40.43, 116.57),
    # Africa
    "timbuktu": (16.77, -3.01), "tunis": (36.81, 10.18), "tripoli": (32.89, 13.19), "algiers": (36.75, 3.06), "marrakesh": (31.63, -8.01), "fez": (34.03, -5.00), "luxor": (25.69, 32.64),
    "aswan": (24.09, 32.90), "khartoum": (15.50, 32.56), "addis ababa": (9.03, 38.74), "zanzibar": (-6.17, 39.20), "cape town": (-33.92, 18.42), "cape of good hope": (-34.36, 18.47), "johannesburg": (-26.20, 28.05),
    "great zimbabwe": (-20.27, 30.93), "lagos": (6.52, 3.38), "kilwa": (-8.96, 39.51), "mombasa": (-4.04, 39.67), "meroe": (16.94, 33.75), "axum": (14.13, 38.72), "mali": (17.57, -3.99),
    # the Americas
    "washington": (38.91, -77.04), "new york": (40.71, -74.01), "boston": (42.36, -71.06), "philadelphia": (39.95, -75.17), "jamestown": (37.21, -76.78), "plymouth": (41.96, -70.67),
    "yorktown": (37.24, -76.51), "gettysburg": (39.83, -77.23), "new orleans": (29.95, -90.07), "chicago": (41.88, -87.63), "san francisco": (37.77, -122.42), "los angeles": (34.05, -118.24),
    "st. joseph": (39.77, -94.85), "saint joseph": (39.77, -94.85), "st joseph": (39.77, -94.85), "kearney": (39.37, -94.36), "dodge city": (37.75, -100.02), "tombstone": (31.71, -110.07),
    "the alamo": (29.43, -98.49), "alamo": (29.43, -98.49), "san antonio": (29.42, -98.49), "kitty hawk": (36.07, -75.70), "cape kennedy": (28.49, -80.58), "cape canaveral": (28.39, -80.60),
    "houston": (29.76, -95.37), "havana": (23.11, -82.37), "cuba": (21.52, -77.78), "mexico city": (19.43, -99.13), "tenochtitlan": (19.43, -99.13), "chichen itza": (20.68, -88.57), "tikal": (17.22, -89.62),
    "cusco": (-13.53, -71.97), "machu picchu": (-13.16, -72.55), "lima": (-12.05, -77.04), "cajamarca": (-7.16, -78.51), "buenos aires": (-34.60, -58.38), "rio de janeiro": (-22.91, -43.17),
    "san salvador": (24.05, -74.53), "hispaniola": (19.00, -71.00), "veracruz": (19.20, -96.13), "panama": (8.98, -79.52), "quebec": (46.81, -71.21), "montreal": (45.50, -73.57), "ottawa": (45.42, -75.70),
    "little bighorn": (45.57, -107.43), "oregon": (44.00, -120.50), "sacramento": (38.58, -121.49), "sutter's mill": (38.80, -120.89), "promontory": (41.62, -112.55), "dallas": (32.78, -96.80),
    # oceans, islands and landmarks of the Age of Sail and the Pacific
    "palos": (37.23, -6.89), "palos de la frontera": (37.23, -6.89), "sagres": (37.02, -8.94), "canary islands": (28.29, -16.63), "azores": (37.74, -25.67), "madeira": (32.65, -16.91),
    "cape verde": (16.00, -24.00), "calicut": (11.25, 75.78), "goa": (15.50, 73.83), "macau": (22.20, 113.54), "manila": (14.60, 120.98), "cebu": (10.32, 123.89), "mactan": (10.31, 123.98),
    "tierra del fuego": (-54.00, -69.00), "strait of magellan": (-53.50, -70.50), "cape horn": (-55.98, -67.27), "tahiti": (-17.65, -149.43), "hawaii": (19.90, -155.58), "sydney": (-33.87, 151.21),
    "botany bay": (-34.00, 151.22), "melbourne": (-37.81, 144.96), "auckland": (-36.85, 174.76), "easter island": (-27.11, -109.35), "bering strait": (65.75, -168.50), "galapagos": (-0.95, -90.97),
    "pearl harbor": (21.35, -157.97), "midway": (28.21, -177.38), "iwo jima": (24.78, 141.32), "okinawa": (26.50, 127.95),
    # twentieth century and the space age
    "kennedy space center": (28.57, -80.65), "baikonur": (45.96, 63.31), 
    "chernobyl": (51.39, 30.10), "berlin wall": (52.52, 13.40), "hiroshima japan": (34.39, 132.45), "normandy beaches": (49.37, -0.87), "omaha beach": (49.37, -0.87), "versailles palace": (48.80, 2.12),
    "sarajevo": (43.86, 18.41), "verdun": (49.16, 5.38), "ypres": (50.85, 2.89), "the somme": (50.00, 2.70), "gallipoli": (40.23, 26.28), "dien bien phu": (21.39, 103.02), "yalta": (44.50, 34.17),
    "potsdam": (52.40, 13.07), "munich germany": (48.14, 11.58), "dresden": (51.05, 13.74), "leipzig": (51.34, 12.37), "ulm": (48.40, 9.99), "austerlitz": (49.13, 16.76), "elba": (42.77, 10.27),
    "saint helena": (-15.97, -5.71), "st helena": (-15.97, -5.71), "mont blanc": (45.83, 6.86), "the alps": (46.50, 9.00), "alps": (46.50, 9.00), "pyrenees": (42.70, 0.00), "sahara": (23.00, 12.00),
    "nile": (26.00, 31.50), "the nile": (26.00, 31.50), "silk road": (39.00, 70.00), "rhine": (50.00, 8.00), "danube": (47.00, 18.00), "euphrates": (34.00, 40.00), "tigris": (34.00, 43.00),
}
_ALIASES = {"st.": "saint", "saint": "st"}


def _norm(name: str) -> str:
    import unicodedata
    s = unicodedata.normalize("NFKD", name or "").encode("ascii", "ignore").decode().lower().strip()
    s = re.sub(r"\(.*?\)", "", s)
    return re.sub(r"\s+", " ", s).strip(" ,.")


def lookup(name: str) -> Optional[Tuple[float, float]]:
    """The real (lat, lon) of a place this table knows, by name (accents, case and a trailing "city" or "island" do not matter)."""
    n = _norm(name)
    for cand in (n, re.sub(r"^the ", "", n), re.sub(r" (city|island|islands|ocean|sea)$", "", n), n.replace("saint ", "st. "), n.replace("st. ", "saint ")):
        if cand in PLACES:
            return PLACES[cand]
    return None


def distance_deg(a: Tuple[float, float], b: Tuple[float, float]) -> float:
    return math.hypot(a[0] - b[0], (a[1] - b[1]) * math.cos(math.radians((a[0] + b[0]) / 2)))


def fix_map_places(project: Any, tolerance: float = 2.5) -> int:
    """Snaps the places of every `map` scene that the gazetteer knows to their real coordinates when the script is off by more than `tolerance` degrees. Returns how many were corrected."""
    fixed = 0
    for sc in getattr(project, "scenes", []):
        if getattr(sc, "type", None) != "map" or not sc.items:
            continue
        out = []
        for it in sc.items:
            parts = it.split("|")
            if len(parts) != 3:
                out.append(it)
                continue
            real = lookup(parts[0])
            try:
                got = (float(parts[1]), float(parts[2]))
            except ValueError:
                got = None
            if real and (got is None or distance_deg(real, got) > tolerance):
                out.append(f"{parts[0].strip()}|{real[0]:.2f}|{real[1]:.2f}")
                fixed += 1
            else:
                out.append(it)
        sc.items = out
    return fixed
