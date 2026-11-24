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

// Modern faces for the illustrated style.
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { loadFont as loadSpace } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadManrope } from '@remotion/google-fonts/Manrope';
export const SORA = loadSora('normal', { weights: ['600', '800'], subsets: ['latin'] }).fontFamily;
export const SPACE = loadSpace('normal', { weights: ['500', '700'], subsets: ['latin'] }).fontFamily;
export const MANROPE = loadManrope('normal', { weights: ['500', '800'], subsets: ['latin'] }).fontFamily;

// Poster and documentary display faces.
import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';
import { loadFont as loadBebas } from '@remotion/google-fonts/BebasNeue';
import { loadFont as loadAbril } from '@remotion/google-fonts/AbrilFatface';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
export const ANTON = loadAnton('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily;
export const BEBAS = loadBebas('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily;
export const ABRIL = loadAbril('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily;
export const OSWALD = loadOswald('normal', { weights: ['500', '700'], subsets: ['latin'] }).fontFamily;
