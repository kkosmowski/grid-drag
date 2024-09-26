import type { HorizontalResizeData, VerticalResizeData } from '../types';

import { BOARD_PADDING } from '~/consts';
import type { Rectangle } from '~/types/item';

const constrainLeft = (rightData: HorizontalResizeData, item: Rectangle): HorizontalResizeData => {
  const constrainedX = Math.max(rightData.x, BOARD_PADDING - item.x);
  const constrainedWidth = Math.min(rightData.width, item.width + item.x - BOARD_PADDING);

  return {
    x: constrainedX,
    width: constrainedWidth,
  };
};

const constrainRight = (rightData: HorizontalResizeData, itemX: number): HorizontalResizeData => {
  const maxX = window.innerWidth - BOARD_PADDING;
  const constrainedWidth = Math.min(rightData.width, maxX - itemX);

  return {
    x: rightData.x,
    width: constrainedWidth,
  };
};

const constrainTop = (rightData: VerticalResizeData, item: Rectangle): VerticalResizeData => {
  const constrainedY = Math.max(rightData.y, BOARD_PADDING - item.y);
  const constrainedHeight = Math.min(rightData.height, item.height + item.y - BOARD_PADDING);

  return {
    y: constrainedY,
    height: constrainedHeight,
  };
};

const constrainBottom = (rightData: VerticalResizeData, itemY: number): VerticalResizeData => {
  const maxY = window.innerHeight - BOARD_PADDING;
  const constrainedHeight = Math.min(rightData.height, maxY - itemY);

  return {
    y: rightData.y,
    height: constrainedHeight,
  };
};

export const constrained = {
  left: constrainLeft,
  right: constrainRight,
  top: constrainTop,
  bottom: constrainBottom,
};
