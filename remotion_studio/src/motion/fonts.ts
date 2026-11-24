import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadSerif } from '@remotion/google-fonts/InstrumentSerif';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

// Google Fonts only (no external assets). Loaded once; Remotion waits for them before rendering a frame.
export const SANS = loadInter('normal', { weights: ['500', '800', '900'], subsets: ['latin'] }).fontFamily;
export const SERIF = loadSerif('italic', { weights: ['400'], subsets: ['latin'] }).fontFamily;
export const MONO = loadMono('normal', { weights: ['400', '500'], subsets: ['latin'] }).fontFamily;

// Display faces that give each look its own voice (still Google Fonts only).
import { loadFont as loadSpace } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadJakarta } from '@remotion/google-fonts/PlusJakartaSans';
import { loadFont as loadManrope } from '@remotion/google-fonts/Manrope';

export const SPACE = loadSpace('normal', { weights: ['500', '700'], subsets: ['latin'] }).fontFamily;
export const SORA = loadSora('normal', { weights: ['600', '800'], subsets: ['latin'] }).fontFamily;
export const OUTFIT = loadOutfit('normal', { weights: ['600', '800'], subsets: ['latin'] }).fontFamily;
export const JAKARTA = loadJakarta('normal', { weights: ['600', '800'], subsets: ['latin'] }).fontFamily;
export const MANROPE = loadManrope('normal', { weights: ['500', '800'], subsets: ['latin'] }).fontFamily;

import { loadFont as loadLexend } from '@remotion/google-fonts/Lexend';
import { loadFont as loadUrbanist } from '@remotion/google-fonts/Urbanist';
import { loadFont as loadSyne } from '@remotion/google-fonts/Rubik';

export const LEXEND = loadLexend('normal', { weights: ['600', '800'], subsets: ['latin'] }).fontFamily;
export const URBANIST = loadUrbanist('normal', { weights: ['700', '800'], subsets: ['latin'] }).fontFamily;
export const SYNE = loadSyne('normal', { weights: ['500', '800'], subsets: ['latin'] }).fontFamily;

// History channel display faces (serif), Google Fonts only.
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadGaramond } from '@remotion/google-fonts/EBGaramond';
import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadMarcellus } from '@remotion/google-fonts/Marcellus';
import { loadFont as loadSpectral } from '@remotion/google-fonts/Spectral';
import { loadFont as loadBaskerville } from '@remotion/google-fonts/LibreBaskerville';

export const PLAYFAIR = loadPlayfair('normal', { weights: ['700', '900'], subsets: ['latin'] }).fontFamily;
export const CINZEL = loadCinzel('normal', { weights: ['600', '800'], subsets: ['latin'] }).fontFamily;
export const CORMORANT = loadCormorant('normal', { weights: ['600', '700'], subsets: ['latin'] }).fontFamily;
export const GARAMOND = loadGaramond('normal', { weights: ['500', '800'], subsets: ['latin'] }).fontFamily;
export const FRAUNCES = loadFraunces('normal', { weights: ['600', '900'], subsets: ['latin'] }).fontFamily;
export const MARCELLUS = loadMarcellus('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily;
export const SPECTRAL = loadSpectral('normal', { weights: ['600', '800'], subsets: ['latin'] }).fontFamily;
export const BASKERVILLE = loadBaskerville('normal', { weights: ['400', '700'], subsets: ['latin'] }).fontFamily;
