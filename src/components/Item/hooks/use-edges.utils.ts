import type { CornerCursor, EdgeCursor, ItemCorners, ItemEdges } from '~/types/item';


export const getCornerCursor = ({isLeftTopCorner, isLeftBottomCorner, isRightTopCorner, isRightBottomCorner }: ItemCorners): CornerCursor | null => {
  if (isLeftTopCorner) return 'nw-resize';
  if (isLeftBottomCorner) return 'sw-resize';
  if (isRightTopCorner) return 'ne-resize';
  if (isRightBottomCorner) return 'se-resize';
  return null;
}

export const getEdgeCursor = ({isLeftEdge, isRightEdge, isTopEdge, isBottomEdge }: ItemEdges): EdgeCursor | null => {
  if (isLeftEdge) return 'w-resize';
  if (isRightEdge) return 'e-resize';
  if (isTopEdge) return 'n-resize';
  if (isBottomEdge) return 's-resize';
  return null;
}