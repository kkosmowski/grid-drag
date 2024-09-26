import type { MutableRefObject } from 'react';

export type TemporaryRectangle = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
};

export type Rectangle = Size &
  Position & {
    id: number;
    color: string;
    parent?: Rectangle['id'];
  };

export type Size = {
  width: number;
  height: number;
};

export type Position = {
  x: number;
  y: number;
};

export type ResizeData = Size & Position;

export type ItemCorners = {
  isLTC: boolean;
  isLBC: boolean;
  isRTC: boolean;
  isRBC: boolean;
};

export type ItemEdges = {
  isLE: boolean;
  isRE: boolean;
  isTE: boolean;
  isBE: boolean;
};

export enum CornerCursor {
  LeftTop = 'nw-resize',
  LeftBottom = 'sw-resize',
  RightTop = 'ne-resize',
  RightBottom = 'se-resize',
}

export enum EdgeCursor {
  Left = 'w-resize',
  Right = 'e-resize',
  Top = 'n-resize',
  Bottom = 's-resize',
}

export type Cursor = CornerCursor | EdgeCursor;

export type ItemRef = MutableRefObject<HTMLDivElement | null>;
