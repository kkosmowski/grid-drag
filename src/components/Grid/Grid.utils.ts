import type { Rectangle } from '~/types/item';

const getCoordinates = ({ x, y, width, height }: Rectangle): [number, number, number, number] => [
  x,
  y,
  x + width,
  y + height,
];

const isContaining = (possibleParent: Rectangle, possibleChild: Rectangle): boolean => {
  const [pX0, pY0, pX1, pY1] = getCoordinates(possibleParent);
  const [cX0, cY0, cX1, cY1] = getCoordinates(possibleChild);

  // essentially, to be parent its (x0,y0) has to be smaller than child, and (x1,y1) larger
  return pX0 < cX0 && pY0 < cY0 && pX1 > cX1 && pY1 > cY1;
};

export const findParents = (items: Rectangle[]): Rectangle[] => {
  // each item can have only 1 parent, children are always higher than parents.
  // item can be inside multiple items, but its first "container" is the parent
  const fromTopToBottom = items.reverse();

  for (let i = 0; i < fromTopToBottom.length; i++) {
    const item = fromTopToBottom[i];
    const parent = fromTopToBottom.slice(i + 1).find((rectangle) => isContaining(rectangle, item));

    if (parent) {
      item.parent = parent.id;
    }
  }

  return fromTopToBottom.reverse();
};
