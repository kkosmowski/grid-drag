import { CornerCursor, Cursor, EdgeCursor, Rectangle, ResizeData } from '~/types/item';

type CreateResizeMapArgs = {
  item: Rectangle;
  clientX: number;
  clientY: number;
}

type ResizeMap = Record<Cursor, { pending: ResizeData, done: ResizeData }>;
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
