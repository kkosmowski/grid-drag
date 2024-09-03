import { Position, Size } from '~/types/item';
import { GRID_SIZE, MIN_SIZE } from '~/consts';

const normalize = (value: number): number => Math.round(value / GRID_SIZE) * GRID_SIZE;

export const normalizePosition = ({ x, y }: Position): Position => ({
  x: normalize(x),
  y: normalize(y),
});
export const normalizeSize = ({ width, height }: Size): Size => ({
  width: Math.max(normalize(width), MIN_SIZE),
  height: Math.max(normalize(height), MIN_SIZE),
});
