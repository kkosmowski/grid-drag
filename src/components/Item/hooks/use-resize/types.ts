import type { Cursor, Rectangle, ResizeData } from '~/types/item';

export type CreateResizeMapArgs = {
  item: Rectangle;
  clientX: number;
  clientY: number;
  isSquare: boolean;
};

export type ResizeMap = Record<Cursor, ResizeData>;

export type HorizontalResizeData = Pick<ResizeData, 'x' | 'width'>;
export type VerticalResizeData = Pick<ResizeData, 'y' | 'height'>;
