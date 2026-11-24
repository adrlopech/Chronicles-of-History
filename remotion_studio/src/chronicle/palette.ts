/**
 * THE OFFICIAL PALETTE of The Chronicles of History (the written version, with names and uses, is guide/palette.md).
 * Everything on screen is brown or gold with a historical air: parchment, leather, bronze, ochre, sepia, iron-gall ink, a brick or oxblood red, and gold leaf.
 * There is NO blue, green or purple anywhere in the project: a test (tests/test_palette.py) scans every colour in the source and fails on one that is not warm.
 */
export const PALETTE = {
  // golds
  goldLeaf: '#FFE08A', gold: '#F0C25E', goldDeep: '#B9822A', bronze: '#8A5A2A', goldShadow: '#6B430A',
  // parchment and paper
  vellum: '#F4E6C8', parchment: '#E6D3A0', tea: '#D2B074', sepia: '#A8742E',
  // browns, from light leather to the darkest umber
  leather: '#9A6335', umber: '#6E4224', chocolate: '#40230F', cocoa: '#2A170A', obsidian: '#100B07', ink: '#3B2411',
  // the warm accents
  ember: '#FF7A55', copper: '#C8642A', brick: '#A8442A', oxblood: '#6B2D2A', rust: '#8E2A1C',
  // the neutral cream used for text on dark
  cream: '#FFF4D8',
} as const;

/** The accent pair of each era look (a bright accent and a gilt): all of them warm, each era with its own metal. */
export const ERA_ACCENTS: Record<string, { accent: string; accent2: string }> = {
  antiquity: { accent: '#FF8A55', accent2: '#FFC857' },
  manuscript: { accent: '#E8603A', accent2: '#E8B650' },
  seachart: { accent: '#F0A24A', accent2: '#D9A441' },
  empire: { accent: '#F2B04C', accent2: '#D4743C' },
  industrial: { accent: '#E8734A', accent2: '#C9A66B' },
  wartime: { accent: '#F2B53D', accent2: '#C9823A' },
  prehistory: { accent: '#E4693A', accent2: '#F0C27A' },
  renaissance: { accent: '#E8744C', accent2: '#E6B85C' },
  orient: { accent: '#E85A38', accent2: '#E0A84A' },
  frontier: { accent: '#E8643F', accent2: '#F0BE5A' },
  spaceage: { accent: '#F28A3D', accent2: '#F0C060' },
};

/** The sky at each hour, in sepia: a warm amber dawn, a pale golden day, a copper dusk and a brown night. */
export const SKIES = {
  dawn: { top: '#6B3A24', mid: '#D9824A', bottom: '#FFD9A0', sun: '#FFF0C0' },
  day: { top: '#B8884A', mid: '#E6C27E', bottom: '#F6E6BC', sun: '#FFF7D0' },
  dusk: { top: '#3E1E14', mid: '#B8563A', bottom: '#F2A04A', sun: '#FFC27A' },
  night: { top: '#0E0804', mid: '#2A1A10', bottom: '#4A3020', sun: '#F6EBCC' },
} as const;
