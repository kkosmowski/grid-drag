import type { Position, ResizeData } from '~/types/item';

const square = (data: ResizeData): { min: number } & Position => {
  const min = Math.min(data.width, data.height);
  const diff = Math.abs(data.width - data.height);
  const x = data.width > data.height ? data.x + diff : data.x;
  const y = data.height > data.width ? data.y + diff : data.y;

  return { min, x, y };
};

const ltSquared = (data: ResizeData, isSquare: boolean): ResizeData => {
  if (!isSquare) return data;

  const { x, y, min } = square(data);
  return { x, y, width: min, height: min };
};

const rtSquared = (data: ResizeData, isSquare: boolean): ResizeData => {
  if (!isSquare) return data;

  const { y, min } = square(data);
  return { x: data.x, y, width: min, height: min };
};

const lbSquared = (data: ResizeData, isSquare: boolean): ResizeData => {
  if (!isSquare) return data;

  const { x, min } = square(data);
  return { x, y: data.y, width: min, height: min };
};

const rbSquared = (data: ResizeData, isSquare: boolean): ResizeData => {
  if (!isSquare) return data;

  const { min } = square(data);
  return { x: data.x, y: data.y, width: min, height: min };
};

export const squared = {
  lt: ltSquared,
  rt: rtSquared,
  lb: lbSquared,
  rb: rbSquared,
};
