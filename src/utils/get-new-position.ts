import { normalizePosition } from '~/utils/normalize';

export const getNewPosition = (x: number, y: number, isPreviewSnapped = false) =>
  isPreviewSnapped ? normalizePosition({ x, y }) : { x, y };
