import type { FlatRectangle, Position } from '~/types/item';

export const convertToAbsolutePosition = (item: FlatRectangle, position: Position): FlatRectangle => ({
  ...item,
  x: item.x + position.x,
  y: item.y + position.y,
});
