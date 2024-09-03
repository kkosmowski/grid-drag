import type { CornerCursor, EdgeCursor, ItemCorners, ItemEdges } from '~/types/item';


export const getCornerCursor = ({ isLTC, isLBC, isRTC, isRBC }: ItemCorners): CornerCursor | null => {
  if (isLTC) return 'nw-resize';
  if (isLBC) return 'sw-resize';
  if (isRTC) return 'ne-resize';
  if (isRBC) return 'se-resize';
  return null;
}

export const getEdgeCursor = ({ isLE, isRE, isTE, isBE }: ItemEdges): EdgeCursor | null => {
  if (isLE) return 'w-resize';
  if (isRE) return 'e-resize';
  if (isTE) return 'n-resize';
  if (isBE) return 's-resize';
  return null;
}