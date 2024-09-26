import type { Position, Rectangle } from '~/types/item';

export const convertToAbsolutePosition = (item: Rectangle, position: Position): Rectangle => ({
  ...item,
  x: item.x + position.x,
  y: item.y + position.y,
});
