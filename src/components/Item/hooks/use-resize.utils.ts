import { CornerCursor, Cursor, EdgeCursor, Rectangle, ResizeData } from '~/types/item';
import { MIN_SIZE } from '~/consts.ts';

type CreateResizeMapArgs = {
  item: Rectangle;
  clientX: number;
  clientY: number;
}

type ResizeMap = Record<Cursor, { pending: ResizeData, done: ResizeData }>;


// @todo: make it work for edges only
export const createResizeMap = ({ item, clientX, clientY }: CreateResizeMapArgs): ResizeMap => {
  const limitX = Math.min(clientX - item.x, item.width - MIN_SIZE);
  const limitY = Math.min(clientY - item.y, item.height - MIN_SIZE);
  const limitWidthFromLeft = Math.max(item.width - clientX + item.x, MIN_SIZE);
  const limitWidthFromRight = Math.max(clientX - item.x, MIN_SIZE);
  const limitHeightFromTop = Math.max(item.height - clientY + item.y, MIN_SIZE);
  const limitHeightFromBottom = Math.max(clientY - item.y, MIN_SIZE);

  return {
    [CornerCursor.LeftTop]: {
      pending: {
        x: limitX,
        y: limitY,
        width: limitWidthFromLeft,
        height: limitHeightFromTop,
      },
      done: {
        x: item.x + limitX,
        y: item.y + limitY,
        width: limitWidthFromLeft,
        height: limitHeightFromTop,
      },
    },
    [CornerCursor.LeftBottom]: {
      pending: {
        x: limitX,
        y: 0,
        width: limitWidthFromLeft,
        height: limitHeightFromBottom,
      },
      done: {
        x: item.x + limitX,
        y: item.y,
        width: limitWidthFromLeft,
        height: limitHeightFromBottom,
      },
    },
    [CornerCursor.RightTop]: {
      pending: {
        x: 0,
        y: limitY,
        width: limitWidthFromRight,
        height: limitHeightFromTop,
      },
      done: {
        x: item.x,
        y: item.y + limitY,
        width: limitWidthFromRight,
        height: limitHeightFromTop,
      },
    },
    [CornerCursor.RightBottom]: {
      pending: {
        x: 0,
        y: 0,
        width: limitWidthFromRight,
        height: limitHeightFromBottom,
      },
      done: {
        x: item.x,
        y: item.y,
        width: limitWidthFromRight,
        height: limitHeightFromBottom,
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
  };
};
