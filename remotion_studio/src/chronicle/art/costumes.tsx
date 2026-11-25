import React from 'react';
import { Colors, mix } from './palette';
import { Drawn } from './draw';
import { Person } from './people';
import { PEOPLE, PersonKind as PersonId } from './vocab';
import { Hat } from './hats';
import { Hold } from './items';

/** The hundred historical characters (the PEOPLE list of vocab.ts): each is a costume for the one figure drawn by `Person`. Colours are mixed toward the palette so they follow the time of day. */
interface Costume { hat?: Hat; hold?: Hold; robe?: string; body?: string; cloak?: string; armor?: string; hatColor?: string; skin?: number; beard?: boolean; female?: boolean; shield?: boolean }
const HEX: Record<string, string> = { R: '#a8232b', B: '#825430', W: '#e6dfcc', K: '#2b2623', G: '#6b603a', Y: '#d6b03a', P: '#7a372d', O: '#c8642a', N: '#6a4a2e', S: '#ada29a', T: '#785d2d', KH: '#6b6a45', OL: '#60583d', GR: '#6c6f73' };

/** Leaders and rulers stand alone; everyone else comes with two companions. */
export const SOLO: readonly string[] = ['pharaoh', 'roman_emperor', 'jarl', 'pope', 'queen', 'shogun', 'khan', 'sultan', 'byzantine_emperor', 'chinese_emperor', 'admiral', 'merchant_prince', 'tycoon', 'field_marshal', 'president'];

const COSTUMES: Record<PersonId, (c: Colors, B: (k: string) => string) => Costume> = {
  caveman: (c, B) => ({ body: B('N'), hold: 'club', skin: 1, beard: true }),
  pharaoh: (c, B) => ({ hat: 'nemes', robe: B('W'), armor: c.gold, hold: 'staff', skin: 1 }),
  egyptian_priest: (c, B) => ({ robe: B('W'), hold: 'staff', skin: 1 }),
  scribe: (c, B) => ({ body: B('W'), hold: 'scroll', skin: 1 }),
  pyramid_builder: (c, B) => ({ hat: 'cap', hatColor: B('W'), body: B('W'), hold: 'hammer', skin: 1 }),
  gladiator: (c, B) => ({ hat: 'crest', body: B('N'), armor: B('S'), hold: 'sword', shield: true, skin: 1 }),
  legionary: (c, B) => ({ hat: 'crest', body: B('R'), armor: B('S'), hold: 'spear', shield: true }),
  centurion: (c, B) => ({ hat: 'crest', body: B('R'), armor: c.gold, cloak: B('R'), hold: 'sword' }),
  senator: (c, B) => ({ hat: 'laurel', robe: B('W'), hold: 'scroll' }),
  roman_emperor: (c, B) => ({ hat: 'laurel', robe: B('P'), cloak: B('P'), armor: c.gold }),
  vestal: (c, B) => ({ hat: 'hood', robe: B('W'), hold: 'torch', female: true }),
  hoplite: (c, B) => ({ hat: 'crest', body: B('N'), armor: c.gold, cloak: B('R'), hold: 'spear', shield: true }),
  philosopher: (c, B) => ({ robe: B('W'), beard: true, hold: 'staff' }),
  athlete: (c, B) => ({ hat: 'laurel', body: B('W'), hold: 'torch', skin: 1 }),
  persian_immortal: (c, B) => ({ hat: 'turban', body: B('P'), hold: 'bow', beard: true, skin: 2 }),
  babylonian: (c, B) => ({ hat: 'conical', hatColor: c.gold, robe: B('B'), beard: true, hold: 'staff', skin: 2 }),
  celt: (c, B) => ({ body: B('G'), hold: 'sword', beard: true, shield: true }),
  carthaginian: (c, B) => ({ hat: 'crest', body: B('P'), cloak: B('P'), armor: B('S'), hold: 'sword', skin: 2 }),
  oracle: (c, B) => ({ hat: 'hood', robe: B('T'), hold: 'staff', female: true }),
  druid: (c, B) => ({ hat: 'hood', robe: B('G'), beard: true, hold: 'staff' }),
  qin_warrior: (c, B) => ({ body: B('N'), armor: B('N'), hold: 'spear', skin: 1 }),
  knight: (c, B) => ({ hat: 'greathelm', body: B('S'), armor: B('S'), cloak: B('R'), hold: 'sword', shield: true }),
  crusader: (c, B) => ({ hat: 'greathelm', body: B('W'), armor: B('S'), cloak: B('R'), hold: 'sword', shield: true }),
  templar: (c, B) => ({ hat: 'greathelm', body: B('K'), armor: B('S'), cloak: B('W'), hold: 'sword', shield: true }),
  viking: (c, B) => ({ hat: 'nasal', body: B('B'), armor: B('N'), hold: 'axe', shield: true, beard: true }),
  jarl: (c, B) => ({ hat: 'nasal', body: B('R'), armor: c.gold, cloak: B('N'), hold: 'sword', beard: true }),
  bishop: (c, B) => ({ hat: 'miter', robe: B('P'), hold: 'staff' }),
  pope: (c, B) => ({ hat: 'miter', hatColor: B('W'), robe: B('W'), cloak: B('R'), hold: 'staff' }),
  friar: (c, B) => ({ hat: 'hood', robe: B('N') }),
  peasant: (c, B) => ({ hat: 'straw', body: B('N'), hold: 'tool' }),
  blacksmith: (c, B) => ({ body: B('K'), armor: B('N'), hold: 'hammer', beard: true, skin: 1 }),
  longbowman: (c, B) => ({ hat: 'cap', hatColor: B('G'), body: B('G'), hold: 'bow' }),
  crossbowman: (c, B) => ({ hat: 'helmet', body: B('B'), hold: 'crossbow' }),
  castle_guard: (c, B) => ({ hat: 'helmet', body: B('R'), armor: B('S'), hold: 'spear', shield: true }),
  queen: (c, B) => ({ hat: 'crown', robe: B('P'), cloak: B('R'), female: true }),
  princess: (c, B) => ({ hat: 'crown', robe: B('B'), female: true }),
  jester: (c, B) => ({ hat: 'jester', hatColor: B('R'), body: B('Y'), hold: 'cane' }),
  executioner: (c, B) => ({ hat: 'hood', body: B('K'), hold: 'axe' }),
  alchemist: (c, B) => ({ hat: 'conical', hatColor: B('P'), robe: B('P'), beard: true, hold: 'lantern' }),
  plague_doctor: (c, B) => ({ hat: 'beak', robe: B('K'), hold: 'staff' }),
  samurai: (c, B) => ({ hat: 'kabuto', body: B('K'), armor: B('R'), hold: 'katana' }),
  ninja: (c, B) => ({ hat: 'hood', body: B('K'), hold: 'katana', skin: 1 }),
  shogun: (c, B) => ({ hat: 'kabuto', body: B('K'), armor: c.gold, cloak: B('R'), hold: 'katana' }),
  mongol_horseman: (c, B) => ({ hat: 'mongol', body: B('B'), hold: 'bow', skin: 2 }),
  khan: (c, B) => ({ hat: 'mongol', hatColor: B('R'), robe: B('R'), beard: true, hold: 'sword', skin: 2 }),
  saracen: (c, B) => ({ hat: 'turban', body: B('W'), armor: B('S'), hold: 'sword', shield: true, beard: true, skin: 2 }),
  sultan: (c, B) => ({ hat: 'turban', robe: B('R'), cloak: B('P'), beard: true, hold: 'sword', skin: 2 }),
  byzantine_emperor: (c, B) => ({ hat: 'crown', robe: B('P'), cloak: B('P'), beard: true }),
  aztec_warrior: (c, B) => ({ hat: 'headdress', body: B('O'), hold: 'club', shield: true, skin: 2 }),
  aztec_priest: (c, B) => ({ hat: 'headdress', body: B('K'), hold: 'staff', skin: 2 }),
  inca_noble: (c, B) => ({ hat: 'headdress', hatColor: B('R'), robe: B('R'), hold: 'staff', skin: 2 }),
  maya_priest: (c, B) => ({ hat: 'headdress', robe: B('T'), hold: 'staff', skin: 2 }),
  silk_trader: (c, B) => ({ hat: 'conical', hatColor: B('Y'), robe: B('T'), hold: 'bag', skin: 1 }),
  mandarin: (c, B) => ({ hat: 'mandarin', robe: B('R'), beard: true, hold: 'scroll', skin: 1 }),
  chinese_emperor: (c, B) => ({ hat: 'imperial', robe: B('Y'), cloak: B('R'), skin: 1 }),
  conquistador: (c, B) => ({ hat: 'morion', body: B('S'), armor: B('S'), cloak: B('R'), hold: 'sword', beard: true }),
  explorer: (c, B) => ({ hat: 'wide', body: B('N'), hold: 'scroll', beard: true }),
  navigator: (c, B) => ({ hat: 'tricorn', body: B('B'), hold: 'scroll' }),
  pirate: (c, B) => ({ hat: 'tricorn', body: B('R'), hold: 'sword', beard: true }),
  buccaneer: (c, B) => ({ hat: 'bandana', hatColor: B('R'), body: B('W'), hold: 'pistol', beard: true }),
  sailor: (c, B) => ({ hat: 'cap', hatColor: B('B'), body: B('B'), hold: 'bag' }),
  admiral: (c, B) => ({ hat: 'bicorne', body: B('B'), armor: c.gold, cloak: B('B'), hold: 'sword' }),
  native_chief: (c, B) => ({ hat: 'headdress', body: B('N'), hold: 'staff', skin: 2 }),
  missionary: (c, B) => ({ hat: 'wide', robe: B('K'), hold: 'book' }),
  renaissance_artist: (c, B) => ({ hat: 'beret', hatColor: B('R'), robe: B('R'), hold: 'quill' }),
  inventor: (c, B) => ({ robe: B('N'), hold: 'lantern', beard: true }),
  astronomer: (c, B) => ({ hat: 'conical', hatColor: B('B'), robe: B('B'), beard: true, hold: 'staff' }),
  merchant_prince: (c, B) => ({ hat: 'feather', hatColor: B('P'), robe: B('P'), cloak: B('P'), hold: 'bag' }),
  musketeer: (c, B) => ({ hat: 'feather', hatColor: B('B'), body: B('B'), cloak: B('B'), hold: 'sword', beard: true }),
  redcoat: (c, B) => ({ hat: 'tricorn', body: B('R'), hold: 'rifle' }),
  grenadier: (c, B) => ({ hat: 'bearskin', body: B('B'), hold: 'rifle' }),
  minuteman: (c, B) => ({ hat: 'tricorn', body: B('N'), hold: 'rifle' }),
  general: (c, B) => ({ hat: 'bicorne', body: B('B'), armor: c.gold, cloak: B('B'), hold: 'sword' }),
  nobleman: (c, B) => ({ hat: 'wig', body: B('P'), cloak: B('P'), hold: 'cane' }),
  revolutionary: (c, B) => ({ hat: 'phrygian', body: B('B'), hold: 'banner' }),
  frontiersman: (c, B) => ({ hat: 'fur', body: B('N'), hold: 'rifle', beard: true }),
  cowboy: (c, B) => ({ hat: 'cowboy', body: B('N'), hold: 'whip' }),
  factory_worker: (c, B) => ({ hat: 'flatcap', hatColor: B('N'), body: B('N'), hold: 'hammer' }),
  miner: (c, B) => ({ hat: 'miner', body: B('K'), hold: 'tool' }),
  engineer: (c, B) => ({ hat: 'flatcap', hatColor: B('B'), body: B('B'), hold: 'hammer' }),
  gentleman: (c, B) => ({ hat: 'top', body: B('K'), cloak: B('K'), hold: 'cane', beard: true }),
  lady: (c, B) => ({ hat: 'bonnet', hatColor: B('T'), robe: B('T'), hold: 'cane', female: true }),
  surgeon: (c, B) => ({ body: B('W'), hold: 'bag', beard: true }),
  tycoon: (c, B) => ({ hat: 'top', body: B('K'), cloak: B('K'), hold: 'cane', beard: true }),
  suffragette: (c, B) => ({ hat: 'bonnet', hatColor: B('W'), robe: B('W'), hold: 'banner', female: true }),
  ww1_infantry: (c, B) => ({ hat: 'brodie', body: B('KH'), hold: 'rifle' }),
  ww1_officer: (c, B) => ({ hat: 'peaked', body: B('KH'), hold: 'pistol' }),
  ww2_soldier: (c, B) => ({ hat: 'brodie', body: B('OL'), hold: 'rifle' }),
  paratrooper: (c, B) => ({ hat: 'brodie', body: B('OL'), hold: 'rifle' }),
  pilot: (c, B) => ({ hat: 'aviator', body: B('N'), cloak: B('W') }),
  nurse: (c, B) => ({ hat: 'nurse', robe: B('W'), hold: 'bag', female: true }),
  resistance_fighter: (c, B) => ({ hat: 'beret', hatColor: B('K'), body: B('GR'), hold: 'pistol' }),
  spy: (c, B) => ({ hat: 'fedora', body: B('GR'), cloak: B('GR'), hold: 'bag' }),
  codebreaker: (c, B) => ({ body: B('GR'), hold: 'book' }),
  factory_woman: (c, B) => ({ hat: 'bandana', hatColor: B('R'), body: B('B'), hold: 'hammer', female: true }),
  navy_sailor: (c, B) => ({ hat: 'sailor', body: B('W') }),
  tank_commander: (c, B) => ({ hat: 'beret', hatColor: B('K'), body: B('OL') }),
  field_marshal: (c, B) => ({ hat: 'peaked', body: B('GR'), armor: c.gold, cloak: B('GR'), hold: 'cane' }),
  refugee: (c, B) => ({ hat: 'hood', robe: B('N'), hold: 'bag' }),
  astronaut: (c, B) => ({ hat: 'astro', body: B('W'), armor: B('W') }),
  neanderthal: (c, B) => ({ body: B('N'), hold: 'club', beard: true, skin: 1 }),
  shaman: (c, B) => ({ hat: 'antlers', body: B('N'), cloak: B('R'), hold: 'staff', beard: true, skin: 1 }),
  cave_painter: (c, B) => ({ body: B('N'), hold: 'torch', skin: 1 }),
  mammoth_hunter: (c, B) => ({ hat: 'fur', body: B('N'), hold: 'spear', beard: true, skin: 1 }),
  banker: (c, B) => ({ hat: 'beret', hatColor: B('P'), robe: B('P'), hold: 'bag' }),
  courtier: (c, B) => ({ hat: 'feather', hatColor: B('R'), body: B('P'), cloak: B('B'), hold: 'sword' }),
  condottiero: (c, B) => ({ hat: 'feather', hatColor: B('R'), body: B('S'), armor: B('S'), cloak: B('R'), hold: 'sword', beard: true }),
  printer: (c, B) => ({ hat: 'flatcap', hatColor: B('N'), body: B('W'), hold: 'book' }),
  geisha: (c, B) => ({ hat: 'geisha', robe: B('R'), hold: 'fan', female: true }),
  rice_farmer: (c, B) => ({ hat: 'conical', hatColor: B('Y'), body: B('N'), hold: 'tool', skin: 1 }),
  tang_scholar: (c, B) => ({ hat: 'mandarin', robe: B('T'), hold: 'scroll', skin: 1 }),
  shaolin_monk: (c, B) => ({ robe: B('O'), hold: 'staff', skin: 1 }),
  sheriff: (c, B) => ({ hat: 'cowboy', body: B('N'), hold: 'pistol', beard: true }),
  outlaw: (c, B) => ({ hat: 'cowboy', body: B('K'), cloak: B('K'), hold: 'pistol', beard: true }),
  prospector: (c, B) => ({ hat: 'wide', body: B('N'), hold: 'pickaxe', beard: true }),
  settler: (c, B) => ({ hat: 'straw', body: B('B'), hold: 'tool' }),
  pioneer_woman: (c, B) => ({ hat: 'bonnet', hatColor: B('W'), robe: B('B'), hold: 'bag', female: true }),
  trapper: (c, B) => ({ hat: 'fur', body: B('N'), cloak: B('N'), hold: 'rifle', beard: true }),
  railroad_worker: (c, B) => ({ hat: 'flatcap', hatColor: B('B'), body: B('B'), hold: 'hammer' }),
  native_warrior: (c, B) => ({ hat: 'headdress', body: B('N'), hold: 'bow', skin: 2 }),
  cosmonaut: (c, B) => ({ hat: 'astro', body: B('W'), armor: B('R') }),
  scientist: (c, B) => ({ body: B('W'), hold: 'flask' }),
  programmer: (c, B) => ({ body: B('GR'), hold: 'laptop' }),
  protester: (c, B) => ({ body: B('O'), hold: 'placard' }),
  president: (c, B) => ({ body: B('K'), cloak: B('K') }),
  reporter: (c, B) => ({ body: B('K'), hold: 'mic' }),
  test_pilot: (c, B) => ({ hat: 'aviator', body: B('OL') }),
};

/** Actions one person does while the others look on (a speech, a blow, a letter): the companions turn to the hero instead of repeating the gesture like a chorus. */
const HERO_ACTS: readonly string[] = ['point', 'shout', 'threaten', 'write', 'read', 'think', 'drink', 'lift', 'throw', 'shoot', 'wave', 'plead', 'stab', 'slash', 'fall', 'dance', 'salute', 'shrug'];

export const PersonGroup: React.FC<Drawn & { c: Colors; who: PersonId }> = ({ c, t, seed, dir, act, view, who, since }) => {
  const B = (k: string) => mix(HEX[k] ?? k, c.mid, 0.2);
  const k = COSTUMES[who](c, B);
  const solo = SOLO.includes(who);
  const slots = solo ? [{ x: 0, s: 1.3 }] : [{ x: 0, s: 1.15 }, { x: -66, s: 0.95 }, { x: 62, s: 0.95 }];
  const react = !!act && HERO_ACTS.includes(act);
  return (
    <g transform={`scale(${dir} 1)`}>
      {/* companions first (behind), the hero last (in front) */}
      {slots.map((p, i) => ({ p, i })).reverse().map(({ p, i }) => {
        const lookOn = i > 0 && react;
        const turn = lookOn && p.x > 0 ? -1 : 1; // the companion on the right turns left, toward the hero
        return (
          <g key={i} transform={`translate(${p.x} ${i ? -8 : 0}) scale(${turn} 1)`}>
            <Person c={c} t={t} seed={seed + i * 0.7} scale={p.s} pose={lookOn ? (act === 'fall' || act === 'plead' ? 'cower' : 'stand') : act} view={lookOn ? 'side' : view} since={since} delay={i * 0.18} {...k} />
          </g>
        );
      })}
    </g>
  );
};
export { PEOPLE };

/** One costumed figure alone (no companions), for branding and posters. */
export const Costumed: React.FC<Drawn & { c: Colors; who: PersonId; scale?: number }> = ({ c, t, seed, act, view, who, scale = 1 }) => {
  const B = (k: string) => mix(HEX[k] ?? k, c.mid, 0.2);
  return <Person c={c} t={t} seed={seed} scale={scale} pose={act} view={view} {...COSTUMES[who](c, B)} />;
};
