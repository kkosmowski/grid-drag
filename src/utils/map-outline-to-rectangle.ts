import type { Rectangle, TemporaryRectangle } from '~/types/item';

export const mapOutlineToRectangle = (outline: TemporaryRectangle): Omit<Rectangle, 'id' | 'color'> => ({
  x: Math.min(outline.x0, outline.x1),
  y: Math.min(outline.y0, outline.y1),
  width: Math.abs(outline.x0 - outline.x1),
  height: Math.abs(outline.y0 - outline.y1),
});
