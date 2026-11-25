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

/** A COLOUR THEME: one of several brown-and-gold styles a video can be dressed in. Every theme is warm (parchment, leather, gold, brick, ochre); they differ in light and mood.
 *  `paper` is the light stone and parchment of the pictures, `paper2` the dark base of the panels and the backdrop, `accent`/`accent2` the bright accent and the gilt (corners, rules, frames). */
export interface Sky { top: string; mid: string; bottom: string; sun: string }
export interface Theme { name: string; label: string; paper: string; paper2: string; accent: string; accent2: string; sky: Record<'dawn' | 'day' | 'dusk' | 'night', Sky> }

export const THEMES: Record<string, Theme> = {
  // the house style: gold leaf on dark leather, each era with its own accent pair
  gilded: { name: 'gilded', label: 'Gilded', paper: '', paper2: '', accent: '', accent2: '', sky: SKIES },
  // a faded photograph: pale sepia skies, copper and old gold
  sepia: {
    name: 'sepia', label: 'Sepia', paper: '#E8D5A8', paper2: '#7A5A34', accent: '#C8642A', accent2: '#D4A24A',
    sky: { dawn: { top: '#6E5438', mid: '#C99A62', bottom: '#F0D9AA', sun: '#FFF0C8' }, day: { top: '#9B7B52', mid: '#D8BE90', bottom: '#F1E2BC', sun: '#FFF6D6' }, dusk: { top: '#4A3420', mid: '#A8794A', bottom: '#E8C07E', sun: '#FFD79A' }, night: { top: '#1A120A', mid: '#33241A', bottom: '#54402C', sun: '#F3E8CC' } },
  },
  // fire and brass: red-brown grounds, a bright orange accent
  ember: {
    name: 'ember', label: 'Ember', paper: '#EBC9A0', paper2: '#5A2412', accent: '#FF6A3D', accent2: '#FFB04A',
    sky: { dawn: { top: '#5A1E10', mid: '#E05A30', bottom: '#FFC58A', sun: '#FFE7B0' }, day: { top: '#A8602E', mid: '#E8A468', bottom: '#F9DDB0', sun: '#FFF2C4' }, dusk: { top: '#2A0C08', mid: '#A8301C', bottom: '#F59A3A', sun: '#FFC27A' }, night: { top: '#140706', mid: '#2E140C', bottom: '#552A1A', sun: '#F6E4C4' } },
  },
  // oxblood and gold: the colours of courts and crowns
  regal: {
    name: 'regal', label: 'Regal', paper: '#E6C9A0', paper2: '#46141A', accent: '#E0A93C', accent2: '#B8433A',
    sky: { dawn: { top: '#4A1620', mid: '#B8503A', bottom: '#F0BC82', sun: '#FFE6B0' }, day: { top: '#9A5A38', mid: '#DCA876', bottom: '#F4DEB4', sun: '#FFF1C6' }, dusk: { top: '#2E0A10', mid: '#8E2F2A', bottom: '#E8A04A', sun: '#FFCB84' }, night: { top: '#12060A', mid: '#2C1014', bottom: '#4E2424', sun: '#F4E2C6' } },
  },
  // earth and bronze: muted ochre and olive-brown, for roads, camps and fields
  bronze: {
    name: 'bronze', label: 'Bronze', paper: '#DCCB94', paper2: '#3C2E12', accent: '#D9A334', accent2: '#A8793A',
    sky: { dawn: { top: '#4A3A1C', mid: '#B8903E', bottom: '#EBD08C', sun: '#FFF0BE' }, day: { top: '#8A7440', mid: '#D2BC82', bottom: '#EFE0AE', sun: '#FFF5CC' }, dusk: { top: '#2E2210', mid: '#8A6A2E', bottom: '#E0B050', sun: '#FFD88C' }, night: { top: '#110C05', mid: '#2A200F', bottom: '#4A3A1E', sun: '#F2E6C4' } },
  },
  // bone and umber: light, airy, a daylight manuscript
  ivory: {
    name: 'ivory', label: 'Ivory', paper: '#F4EAD2', paper2: '#6A4C30', accent: '#B8532E', accent2: '#C89A4A',
    sky: { dawn: { top: '#9A7650', mid: '#DDB080', bottom: '#F8E6C2', sun: '#FFF4D4' }, day: { top: '#C4A474', mid: '#E6D2A4', bottom: '#FAF1D8', sun: '#FFFAE0' }, dusk: { top: '#6A4A30', mid: '#C48A58', bottom: '#F0CE96', sun: '#FFE0A8' }, night: { top: '#2A1E14', mid: '#4A382A', bottom: '#6E5640', sun: '#F8F0DA' } },
  },
  // ash and umber: charcoal browns, a lantern-orange accent, for wars and winters
  smoke: {
    name: 'smoke', label: 'Smoke', paper: '#D8CDB8', paper2: '#2E241C', accent: '#E39A3B', accent2: '#9C7C58',
    sky: { dawn: { top: '#3E3026', mid: '#9A7852', bottom: '#DCC49C', sun: '#F6E6C0' }, day: { top: '#6A5A48', mid: '#B8A688', bottom: '#E2D6BC', sun: '#F4EAD0' }, dusk: { top: '#1E1610', mid: '#6A4A32', bottom: '#C08A50', sun: '#E8B878' }, night: { top: '#0C0907', mid: '#221A14', bottom: '#3E3024', sun: '#ECE0C4' } },
  },
};
