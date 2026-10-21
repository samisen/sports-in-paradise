import { SportSite } from '../content/types';
import { SportId } from '../site/sites';

/**
 * Each sport's content is its own chunk: a visitor to the golf site never
 * downloads the diving copy. The hub is the one place that needs all five.
 */
export const SPORT_LOADERS: Record<SportId, () => Promise<SportSite>> = {
  padel: () => import('./padel').then((m) => m.PADEL),
  tennis: () => import('./tennis').then((m) => m.TENNIS),
  golf: () => import('./golf').then((m) => m.GOLF),
  diving: () => import('./diving').then((m) => m.DIVING),
  hiking: () => import('./hiking').then((m) => m.HIKING),
};
