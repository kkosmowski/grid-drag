import { MutableRefObject } from 'react';

export type Rectangle = Position & {
  id: string;
  width: number;
  height: number;
  color: string;
}

export type Position = {
  x: number;
  y: number;
}

export type ItemCorners = {
  isLeftTopCorner: boolean;
  isLeftBottomCorner: boolean;
  isRightTopCorner: boolean;
  isRightBottomCorner: boolean;
}

export type ItemEdges = {
  isLeftEdge: boolean;
  isRightEdge: boolean;
  isTopEdge: boolean;
  isBottomEdge: boolean;
}

export type CornerCursor = 'nw-resize' | 'sw-resize' | 'ne-resize' | 'se-resize';
export type EdgeCursor = 'n-resize' | 's-resize' | 'w-resize' | 'e-resize';
export type Cursor = CornerCursor | EdgeCursor;

export type ItemRef = MutableRefObject<HTMLDivElement | null>;