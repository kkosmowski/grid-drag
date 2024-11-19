import type { Position, Rectangle } from '~/types/item';
import { BOARD_PADDING } from '~/consts';

const between = (x: number, y: number, z: number) => Math.max(x, Math.min(y, z));

export const constrainToBoard = ({ x, y }: Position, item: Rectangle, parent?: Rectangle): Position => {
  const minX = (parent ? -parent.x : 0) + BOARD_PADDING;
  const maxX = window.innerWidth - item.width - (parent ? parent.x : 0) - BOARD_PADDING;

  const minY = (parent ? -parent.y : 0) + BOARD_PADDING;
  const maxY = window.innerHeight - item.height - (parent ? parent.y : 0) - BOARD_PADDING;

  return {
    x: between(minX, x, maxX),
    y: between(minY, y, maxY),
  };
};
