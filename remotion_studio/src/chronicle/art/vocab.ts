/** The vocabulary of the vector illustrations. The script writer picks places, times, weather and subjects from these lists (services/motion_generator.py repeats them; a test keeps both in step). */
export const PLACES = ['desert', 'sea', 'coast', 'plains', 'mountains', 'forest', 'snow', 'city', 'plaza', 'interior', 'battlefield'] as const;
export const TIMES = ['dawn', 'day', 'dusk', 'night'] as const;
export const WEATHERS = ['clear', 'rain', 'snow', 'storm', 'smoke'] as const;

export const STRUCTURES = ['castle', 'temple', 'pyramids', 'tower', 'gate', 'windmill', 'factory', 'lighthouse', 'tents', 'bridge', 'ruins', 'ziggurat', 'colosseum', 'aqueduct', 'obelisk', 'sphinx', 'great_wall', 'triumphal_arch', 'stonehenge', 'hut', 'palisade', 'harbor', 'market', 'well', 'library', 'theater', 'adobe', 'tomb', 'palace', 'cathedral', 'church', 'mosque', 'pagoda', 'monastery', 'longhouse', 'fortress', 'siege_tower', 'catapult', 'trebuchet', 'forge', 'tavern', 'village', 'tipi', 'yurt', 'igloo', 'torii', 'japanese_castle', 'star_fort', 'observatory', 'printing_press', 'gallows', 'guillotine', 'clocktower', 'mine', 'skyscraper', 'derrick', 'barn', 'telegraph', 'bunker', 'radiotower', 'rocket', 'cave', 'menhir', 'duomo', 'pavilion', 'dojo', 'saloon', 'general_store', 'water_tower', 'radar_dish', 'cooling_tower'] as const;
export const ACTORS = ['soldiers', 'cavalry', 'king', 'crowd', 'caravan', 'scholar', 'monk', 'farmer', 'merchant', 'ship', 'fleet', 'galley', 'elephants', 'train', 'tank', 'plane', 'wagon', 'junk', 'lander', 'satellite'] as const;
/** A hundred historical characters, each a costume of the one drawn figure (art/costumes.tsx): leaders alone, everybody else with two companions. */
export const PEOPLE = ['caveman', 'pharaoh', 'egyptian_priest', 'scribe', 'pyramid_builder', 'gladiator', 'legionary', 'centurion', 'senator', 'roman_emperor', 'vestal', 'hoplite', 'philosopher', 'athlete', 'persian_immortal', 'babylonian', 'celt', 'carthaginian', 'oracle', 'druid', 'qin_warrior', 'knight', 'crusader', 'templar', 'viking', 'jarl', 'bishop', 'pope', 'friar', 'peasant', 'blacksmith', 'longbowman', 'crossbowman', 'castle_guard', 'queen', 'princess', 'jester', 'executioner', 'alchemist', 'plague_doctor', 'samurai', 'ninja', 'shogun', 'mongol_horseman', 'khan', 'saracen', 'sultan', 'byzantine_emperor', 'aztec_warrior', 'aztec_priest', 'inca_noble', 'maya_priest', 'silk_trader', 'mandarin', 'chinese_emperor', 'conquistador', 'explorer', 'navigator', 'pirate', 'buccaneer', 'sailor', 'admiral', 'native_chief', 'missionary', 'renaissance_artist', 'inventor', 'astronomer', 'merchant_prince', 'musketeer', 'redcoat', 'grenadier', 'minuteman', 'general', 'nobleman', 'revolutionary', 'frontiersman', 'cowboy', 'factory_worker', 'miner', 'engineer', 'gentleman', 'lady', 'surgeon', 'tycoon', 'suffragette', 'ww1_infantry', 'ww1_officer', 'ww2_soldier', 'paratrooper', 'pilot', 'nurse', 'resistance_fighter', 'spy', 'codebreaker', 'factory_woman', 'navy_sailor', 'tank_commander', 'field_marshal', 'refugee', 'astronaut', 'neanderthal', 'shaman', 'cave_painter', 'mammoth_hunter', 'banker', 'courtier', 'condottiero', 'printer', 'geisha', 'rice_farmer', 'tang_scholar', 'shaolin_monk', 'sheriff', 'outlaw', 'prospector', 'settler', 'pioneer_woman', 'trapper', 'railroad_worker', 'native_warrior', 'cosmonaut', 'scientist', 'programmer', 'protester', 'president', 'reporter', 'test_pilot'] as const;
/** Twenty animals (art/animals.tsx). */
export const ANIMALS = ['dog', 'wolf', 'fox', 'lion', 'tiger', 'bear', 'deer', 'boar', 'pig', 'cow', 'ox', 'sheep', 'goat', 'donkey', 'rat', 'eagle', 'raven', 'snake', 'crocodile', 'whale', 'mammoth', 'sabertooth', 'bison', 'horse', 'camel'] as const;
export const PROPS = ['scroll', 'crown', 'sword', 'chest', 'torch', 'banner', 'throne', 'map', 'cannon'] as const;
export const EFFECTS = ['fire', 'smoke', 'birds', 'comet', 'eclipse', 'volcano'] as const;

/** What a person in the picture is doing: seven everyday ones plus thirty more (art/people.tsx draws each, services/motion_generator.py repeats the list). */
export const ACTIONS = [
  'stand', 'walk', 'run', 'sit', 'point', 'wave', 'cheer',
  'kneel', 'bow', 'pray', 'salute', 'slash', 'stab', 'fall', 'lie', 'crouch', 'carry', 'push', 'dig', 'hammer',
  'write', 'read', 'think', 'shout', 'plead', 'threaten', 'shrug', 'lift', 'throw', 'shoot', 'drink', 'dance', 'sneak', 'surrender', 'cower', 'lean', 'watch',
] as const;
/** Which way the people are turned: toward us, in profile or away from us. */
export const VIEWS = ['front', 'side', 'back'] as const;
/** How the shot is filmed: wide (the whole place), medium (the group), close (the hero's face), push (moves in to the hero), pull (moves back to reveal the place), follow (tracks the hero walking). Optional: art/Stage.tsx picks one from the story. */
export const CAMERAS = ['wide', 'medium', 'close', 'push', 'pull', 'follow'] as const;

export const SUBJECTS = [...STRUCTURES, ...ACTORS, ...PEOPLE, ...ANIMALS, ...PROPS, ...EFFECTS] as const;

export type Place = (typeof PLACES)[number];
export type TimeOfDay = (typeof TIMES)[number];
export type Weather = (typeof WEATHERS)[number];
export type Structure = (typeof STRUCTURES)[number];
export type Actor = (typeof ACTORS)[number];
export type PersonKind = (typeof PEOPLE)[number];
export type AnimalKind = (typeof ANIMALS)[number];
export type Prop = (typeof PROPS)[number];
export type Effect = (typeof EFFECTS)[number];
export type Action = (typeof ACTIONS)[number];
export type View = (typeof VIEWS)[number];
export type Camera = (typeof CAMERAS)[number];
export type Subject = (typeof SUBJECTS)[number];

export interface ArtShot {
  place: Place;
  time: TimeOfDay;
  weather?: Weather;
  subjects: Subject[];
  /** What the people in the picture are doing (soldiers, king, crowd, scholar, monk, farmer, merchant) and which way they face; both optional. */
  action?: Action;
  view?: View;
  /** How it is filmed (CAMERAS); optional. */
  camera?: Camera;
}

export const kindOf = (s: Subject): 'structure' | 'actor' | 'prop' | 'effect' =>
  (STRUCTURES as readonly string[]).includes(s) ? 'structure' : (ACTORS as readonly string[]).includes(s) || (PEOPLE as readonly string[]).includes(s) || (ANIMALS as readonly string[]).includes(s) ? 'actor' : (PROPS as readonly string[]).includes(s) ? 'prop' : 'effect';
