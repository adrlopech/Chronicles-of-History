import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadFell } from '@remotion/google-fonts/IMFellEnglish';
import { loadFont as loadGaramond } from '@remotion/google-fonts/EBGaramond';
import { loadFont as loadMarcellus } from '@remotion/google-fonts/Marcellus';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadBaskerville } from '@remotion/google-fonts/LibreBaskerville';
import { loadFont as loadElite } from '@remotion/google-fonts/SpecialElite';
import { loadFont as loadCardo } from '@remotion/google-fonts/Cardo';

// Google Fonts only. Loaded once; Remotion waits for them before it renders a frame.
export const CINZEL = loadCinzel('normal', { weights: ['600', '800'], subsets: ['latin'] }).fontFamily;
export const CORMORANT = loadCormorant('normal', { weights: ['600', '700'], subsets: ['latin'] }).fontFamily;
export const FELL = loadFell('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily;
export const FELL_ITALIC = loadFell('italic', { weights: ['400'], subsets: ['latin'] }).fontFamily;
export const GARAMOND = loadGaramond('normal', { weights: ['500', '800'], subsets: ['latin'] }).fontFamily;
export const GARAMOND_ITALIC = loadGaramond('italic', { weights: ['500'], subsets: ['latin'] }).fontFamily;
export const MARCELLUS = loadMarcellus('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily;
export const PLAYFAIR = loadPlayfair('normal', { weights: ['700', '900'], subsets: ['latin'] }).fontFamily;
export const PLAYFAIR_ITALIC = loadPlayfair('italic', { weights: ['700'], subsets: ['latin'] }).fontFamily;
export const BASKERVILLE = loadBaskerville('normal', { weights: ['400', '700'], subsets: ['latin'] }).fontFamily;
export const BASKERVILLE_ITALIC = loadBaskerville('italic', { weights: ['400'], subsets: ['latin'] }).fontFamily;
export const ELITE = loadElite('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily;
export const CARDO = loadCardo('normal', { weights: ['400', '700'], subsets: ['latin'] }).fontFamily;
export const CARDO_ITALIC = loadCardo('italic', { weights: ['400'], subsets: ['latin'] }).fontFamily;
