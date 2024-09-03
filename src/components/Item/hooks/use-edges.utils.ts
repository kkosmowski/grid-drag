import { CornerCursor, EdgeCursor, type ItemCorners, type ItemEdges } from '~/types/item';

export const getCornerCursor = ({ isLTC, isLBC, isRTC, isRBC }: ItemCorners): CornerCursor | null => {
  if (isLTC) return CornerCursor.LeftTop;
  if (isLBC) return CornerCursor.LeftBottom;
  if (isRTC) return CornerCursor.RightTop;
  if (isRBC) return CornerCursor.RightBottom;
  return null;
}

export const getEdgeCursor = ({ isLE, isRE, isTE, isBE }: ItemEdges): EdgeCursor | null => {
  if (isLE) return EdgeCursor.Left;
  if (isRE) return EdgeCursor.Right;
  if (isTE) return EdgeCursor.Top;
  if (isBE) return EdgeCursor.Bottom;
  return null;
}
