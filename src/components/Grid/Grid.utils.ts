import { Position } from '~/types/item.ts';
import { GRID_SIZE } from '~/consts.ts';

const normalize = (value: number): number => Math.round(value / GRID_SIZE) * GRID_SIZE;

export const normalizePosition = (position: Position): Position => ({
  x: normalize(position.x),
  y: normalize(position.y),
});
