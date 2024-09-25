import { squared } from './utils/squared';
import type { CreateResizeMapArgs, HorizontalResizeData, ResizeMap, VerticalResizeData } from './types';

import { CornerCursor, EdgeCursor } from '~/types/item';
import { MIN_SIZE } from '~/consts';
import { constrained } from '~/components/Item/hooks/use-resize/utils/constrained';

export const createResizeMap = ({ item, clientX, clientY, isSquare }: CreateResizeMapArgs): ResizeMap => {
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

  const left: HorizontalResizeData = constrained.left({ x: leftX, width: leftWidth }, item);
  const right: HorizontalResizeData = constrained.right({ x: rightX, width: rightWidth }, item.x);
  const top: VerticalResizeData = constrained.top({ y: topY, height: topHeight }, item);
  const bottom: VerticalResizeData = constrained.bottom({ y: bottomY, height: bottomHeight }, item.y);

  return {
    [CornerCursor.LeftTop]: squared.lt({ ...left, ...top }, isSquare),
    [CornerCursor.LeftBottom]: squared.lb({ ...left, ...bottom }, isSquare),
    [CornerCursor.RightTop]: squared.rt({ ...right, ...top }, isSquare),
    [CornerCursor.RightBottom]: squared.rb({ ...right, ...bottom }, isSquare),
    [EdgeCursor.Left]: { ...left, ...defaultVertical },
    [EdgeCursor.Right]: { ...right, ...defaultVertical },
    [EdgeCursor.Top]: { ...defaultHorizontal, ...top },
    [EdgeCursor.Bottom]: { ...defaultHorizontal, ...bottom },
  };
};
