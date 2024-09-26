import { EDGE_SIZE } from '~/consts';
import type { Rectangle } from '~/types/item';

export const isLeftEdge = (clientX: number, item: Rectangle, parent?: Rectangle) => {
  const absoluteX = parent ? item.x + parent.x : item.x;
  return clientX < absoluteX + EDGE_SIZE;
};

export const isRightEdge = (clientX: number, item: Rectangle, parent?: Rectangle) => {
  const absoluteX = parent ? item.x + parent.x : item.x;
  return clientX > absoluteX + item.width - EDGE_SIZE;
};
export const isTopEdge = (clientY: number, item: Rectangle, parent?: Rectangle) => {
  const absoluteY = parent ? item.y + parent.y : item.y;
  return clientY < absoluteY + EDGE_SIZE;
};
export const isBottomEdge = (clientY: number, item: Rectangle, parent?: Rectangle) => {
  const absoluteY = parent ? item.y + parent.y : item.y;
  return clientY > absoluteY + item.height - EDGE_SIZE;
};

export const isLeftTopCorner = (clientX: number, clientY: number, item: Rectangle, parent?: Rectangle) =>
  isLeftEdge(clientX, item, parent) && isTopEdge(clientY, item, parent);

export const isLeftBottomCorner = (clientX: number, clientY: number, item: Rectangle, parent?: Rectangle) =>
  isLeftEdge(clientX, item, parent) && isBottomEdge(clientY, item, parent);

export const isRightTopCorner = (clientX: number, clientY: number, item: Rectangle, parent?: Rectangle) =>
  isRightEdge(clientX, item, parent) && isTopEdge(clientY, item, parent);

export const isRightBottomCorner = (clientX: number, clientY: number, item: Rectangle, parent?: Rectangle) =>
  isRightEdge(clientX, item, parent) && isBottomEdge(clientY, item, parent);
