import { CornerCursor, Cursor, EdgeCursor, Rectangle, ResizeData } from '~/types/item';
import { MIN_SIZE } from '~/consts.ts';

type CreateResizeMapArgs = {
  item: Rectangle;
  clientX: number;
  clientY: number;
}

type ResizeMap = Record<Cursor, ResizeData>;

type HorizontalResizeData = Pick<ResizeData, 'x' | 'width'>;
type VerticalResizeData = Pick<ResizeData, 'y' | 'height'>;

export const createResizeMap = ({ item, clientX, clientY }: CreateResizeMapArgs): ResizeMap => {
  const leftX = Math.min(clientX - item.x, item.width - MIN_SIZE);
  const rightX = 0;
  const topY = Math.min(clientY - item.y, item.height - MIN_SIZE);
  const bottomY = 0;
  const leftWidth = Math.max(item.width - clientX + item.x, MIN_SIZE);
  const rightWidth = Math.max(clientX - item.x, MIN_SIZE);
  const topHeight = Math.max(item.height - clientY + item.y, MIN_SIZE);
  const bottomHeight = Math.max(clientY - item.y, MIN_SIZE);

  const defaultHorizontal: HorizontalResizeData = { x: 0, width: item.width };
  const defaultVertical: VerticalResizeData = { y: 0, height: item.height };

  const left: HorizontalResizeData = { x: leftX, width: leftWidth };
  const right: HorizontalResizeData = { x: rightX, width: rightWidth };
  const top: VerticalResizeData = { y: topY, height: topHeight };
  const bottom: VerticalResizeData = { y: bottomY, height: bottomHeight };

  return {
    [CornerCursor.LeftTop]: { ...left, ...top },
    [CornerCursor.LeftBottom]: { ...left, ...bottom },
    [CornerCursor.RightTop]: { ...right, ...top, },
    [CornerCursor.RightBottom]: { ...right, ...bottom },
    [EdgeCursor.Left]: { ...left, ...defaultVertical, },
    [EdgeCursor.Right]: { ...right, ...defaultVertical, },
    [EdgeCursor.Top]: { ...defaultHorizontal, ...top, },
    [EdgeCursor.Bottom]: { ...defaultHorizontal, ...bottom },
  };
};
