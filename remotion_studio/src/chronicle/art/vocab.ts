/** The vocabulary of the vector illustrations. The script writer picks places, times, weather and subjects from these lists (services/motion_generator.py repeats them; a test keeps both in step). */
export const PLACES = ['desert', 'sea', 'coast', 'plains', 'mountains', 'forest', 'snow', 'city', 'plaza', 'interior', 'battlefield'] as const;
export const TIMES = ['dawn', 'day', 'dusk', 'night'] as const;
export const WEATHERS = ['clear', 'rain', 'snow', 'storm', 'smoke'] as const;

export const STRUCTURES = ['castle', 'temple', 'pyramids', 'tower', 'gate', 'windmill', 'factory', 'lighthouse', 'tents', 'bridge', 'ruins'] as const;
export const ACTORS = ['soldiers', 'cavalry', 'king', 'crowd', 'caravan', 'scholar', 'monk', 'farmer', 'merchant', 'ship', 'fleet', 'galley', 'elephants', 'train', 'tank', 'plane'] as const;
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

export const SUBJECTS = [...STRUCTURES, ...ACTORS, ...PROPS, ...EFFECTS] as const;

export type Place = (typeof PLACES)[number];
export type TimeOfDay = (typeof TIMES)[number];
export type Weather = (typeof WEATHERS)[number];
export type Structure = (typeof STRUCTURES)[number];
export type Actor = (typeof ACTORS)[number];
export type Prop = (typeof PROPS)[number];
export type Effect = (typeof EFFECTS)[number];
export type Action = (typeof ACTIONS)[number];
export type View = (typeof VIEWS)[number];
export type Subject = (typeof SUBJECTS)[number];

export interface ArtShot {
  place: Place;
  time: TimeOfDay;
  weather?: Weather;
  subjects: Subject[];
  /** What the people in the picture are doing (soldiers, king, crowd, scholar, monk, farmer, merchant) and which way they face; both optional. */
  action?: Action;
  view?: View;
}

export const kindOf = (s: Subject): 'structure' | 'actor' | 'prop' | 'effect' =>
  (STRUCTURES as readonly string[]).includes(s) ? 'structure' : (ACTORS as readonly string[]).includes(s) ? 'actor' : (PROPS as readonly string[]).includes(s) ? 'prop' : 'effect';
