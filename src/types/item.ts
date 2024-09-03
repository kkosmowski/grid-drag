import { MutableRefObject } from 'react';

export type Rectangle = Size & Position & {
  id: string;
  color: string;
}

export type Size = {
  width: number;
  height: number;
}

export type Position = {
  x: number;
  y: number;
}

export type ResizeData = Size & Position;

export type ItemCorners = {
  isLTC: boolean;
  isLBC: boolean;
  isRTC: boolean;
  isRBC: boolean;
}

export type ItemEdges = {
  isLE: boolean;
  isRE: boolean;
  isTE: boolean;
  isBE: boolean;
}

export type CornerCursor = 'nw-resize' | 'sw-resize' | 'ne-resize' | 'se-resize';
export type EdgeCursor = 'n-resize' | 's-resize' | 'w-resize' | 'e-resize';
export type Cursor = CornerCursor | EdgeCursor;

export type ItemRef = MutableRefObject<HTMLDivElement | null>;