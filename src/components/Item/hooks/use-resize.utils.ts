import { CornerCursor, Cursor, EdgeCursor, Rectangle, ResizeData } from '~/types/item';
import { MIN_SIZE } from '~/consts.ts';

type CreateResizeMapArgs = {
  item: Rectangle;
  clientX: number;
  clientY: number;
}

type ResizeMap = Record<Cursor, { pending: ResizeData, done: ResizeData }>;


// @todo: make it work for top left corner
// @todo: make it work for bottom left corner
// @todo: make it work for edges only
export const createResizeMap = ({ item, clientX, clientY }: CreateResizeMapArgs): ResizeMap => ({
  [CornerCursor.LeftTop]: {
    pending: {
      x: 0,
      y: 0,
      width: item.width,
      height: item.height,
    },
    done: {
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
    },
  },
  [CornerCursor.LeftBottom]: {
    pending: {
      x: 0,
      y: 0,
      width: item.width,
      height: item.height,
    },
    done: {
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
    },
  },
  [CornerCursor.RightTop]: {
    pending: {
      x: 0,
      y: Math.min(clientY - item.y, item.height - MIN_SIZE),
      width: Math.max(clientX - item.x, MIN_SIZE),
      height: Math.max(item.height - clientY + item.y, MIN_SIZE),
    },
    done: {
      x: item.x,
      y: item.y + Math.min(clientY - item.y, item.height - MIN_SIZE),
      width: Math.max(clientX - item.x, MIN_SIZE),
      height: Math.max(item.height - clientY + item.y, MIN_SIZE),
    },
  },
  [CornerCursor.RightBottom]: {
    pending: {
      x: 0,
      y: 0,
      width: clientX - item.x,
      height: clientY - item.y,
    },
    done: {
      x: item.x,
      y: item.y,
      width: clientX - item.x,
      height: clientY - item.y,
    },
  },
  [EdgeCursor.Left]: {
    pending: {
      x: 0,
      y: 0,
      width: item.width,
      height: item.height,
    },
    done: {
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
    },
  },
  [EdgeCursor.Right]: {
    pending: {
      x: 0,
      y: 0,
      width: item.width,
      height: item.height,
    },
    done: {
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
    },
  },
  [EdgeCursor.Top]: {
    pending: {
      x: 0,
      y: 0,
      width: item.width,
      height: item.height,
    },
    done: {
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
    },
  },
  [EdgeCursor.Bottom]: {
    pending: {
      x: 0,
      y: 0,
      width: item.width,
      height: item.height,
    },
    done: {
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
    },
  },
});
