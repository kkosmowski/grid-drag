import { EDGE_SIZE } from '~/consts';
import { Rectangle } from '~/types/item';

export const isLeftEdge = (clientX: number, item: Rectangle) => clientX < item.x + EDGE_SIZE;
export const isRightEdge = (clientX: number, item: Rectangle) => clientX > item.x + item.width - EDGE_SIZE;
export const isTopEdge = (clientY: number, item: Rectangle) => clientY < item.y + EDGE_SIZE;
export const isBottomEdge = (clientY: number, item: Rectangle) => clientY > item.y + item.height - EDGE_SIZE;

export const isLeftTopCorner = (clientX: number, clientY: number, item: Rectangle) =>
  isLeftEdge(clientX, item) && isTopEdge(clientY, item);
export const isLeftBottomCorner = (clientX: number, clientY: number, item: Rectangle) =>
  isLeftEdge(clientX, item) && isBottomEdge(clientY, item);
export const isRightTopCorner = (clientX: number, clientY: number, item: Rectangle) =>
  isRightEdge(clientX, item) && isTopEdge(clientY, item);
export const isRightBottomCorner = (clientX: number, clientY: number, item: Rectangle) =>
  isRightEdge(clientX, item) && isBottomEdge(clientY, item);
