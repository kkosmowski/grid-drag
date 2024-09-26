import type { Rectangle } from '~/types/item';
import { convertToRelativePosition } from '~/utils/convert-to-relative-position';
import { flattenItems } from '~/utils/flatten-items';

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

export const relateItems = (items: Rectangle[]): Rectangle[] => {
  let fromTopToBottom = flattenItems<Rectangle>(items, { absolutize: true, withContained: true }).reverse();

  for (let i = 0; i < fromTopToBottom.length; i++) {
    const item = fromTopToBottom[i];

    const parentIndex = fromTopToBottom.slice(i + 1).findIndex((rectangle) => isContaining(rectangle, item));

    if (parentIndex !== -1) {
      const relativeItem = convertToRelativePosition(item, {
        x: fromTopToBottom[parentIndex + 1].x,
        y: fromTopToBottom[parentIndex + 1].y,
      });
      fromTopToBottom[parentIndex + 1].contained.push(relativeItem);
      fromTopToBottom = fromTopToBottom.slice(0, i).concat(fromTopToBottom.slice(i + 1));
    }
  }

  return fromTopToBottom.reverse();
};
