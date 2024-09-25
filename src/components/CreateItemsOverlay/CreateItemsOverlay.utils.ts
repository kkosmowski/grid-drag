import type { TemporaryRectangle } from '~/types/item';

const getMin = (x0: number, y0: number, x1: number, y1: number): number => {
  const width = Math.abs(x0 - x1);
  const height = Math.abs(y0 - y1);

  return Math.min(width, height);
};

const rbSquare = ({ x0, y0, x1, y1 }: TemporaryRectangle): TemporaryRectangle => {
  const min = getMin(x0, y0, x1, y1);
  return { x0, y0, x1: x0 + min, y1: y0 + min };
};

const lbSquare = ({ x0, y0, x1, y1 }: TemporaryRectangle): TemporaryRectangle => {
  const min = getMin(x0, y0, x1, y1);
  return { x0, y0, x1: x0 - min, y1: y0 + min };
};

const ltSquare = ({ x0, y0, x1, y1 }: TemporaryRectangle): TemporaryRectangle => {
  const min = getMin(x0, y0, x1, y1);
  return { x0, y0, x1: x0 - min, y1: y0 - min };
};

const rtSquare = ({ x0, y0, x1, y1 }: TemporaryRectangle): TemporaryRectangle => {
  const min = getMin(x0, y0, x1, y1);
  return { x0, y0, x1: x0 + min, y1: y0 - min };
};

export const toSquare = (rectangle: TemporaryRectangle, isShiftPressed: boolean): TemporaryRectangle => {
  if (!isShiftPressed) return rectangle;

  const { x0, y0, x1, y1 } = rectangle;

  if (x0 < x1 && y0 < y1) {
    return rbSquare(rectangle);
  }
  if (x0 > x1 && y0 < y1) {
    return lbSquare(rectangle);
  }
  if (x0 > x1 && y0 > y1) {
    return ltSquare(rectangle);
  }
  if (x0 < x1 && y0 > y1) {
    return rtSquare(rectangle);
  }

  // width is 0 or height is 0, make the other 0 as well
  return { x0, y0, x1: x0, y1: y0 };
};
