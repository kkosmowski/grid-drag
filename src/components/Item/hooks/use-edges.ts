import { MouseEvent, useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Cursor, ItemCorners, ItemEdges, ItemRef, Rectangle } from '~/types/item';

import { getCornerCursor, getEdgeCursor } from './use-edges.utils';
import { setStyle } from '~/utils/set-style.ts';

const edgeSize = 8;

// This hook is responsible for listening to mouse on edges and handling correct cursor.
// This cursor is later provided to the component to make decisions such as whether to resize or move.
export const useEdges = (ref: ItemRef, item: Rectangle) => {
  const [cursor, setCursor] = useState<Cursor | null>(null);

  const handleEdgeHover = (edges: ItemEdges) => {
    const { isLeftEdge, isRightEdge, isTopEdge, isBottomEdge} = edges;

    const isLeftTopCorner = isLeftEdge && isTopEdge;
    const isLeftBottomCorner = isLeftEdge && isBottomEdge;
    const isRightTopCorner = isRightEdge && isTopEdge;
    const isRightBottomCorner = isRightEdge && isBottomEdge;

    const corners: ItemCorners = { isLeftTopCorner, isLeftBottomCorner, isRightTopCorner, isRightBottomCorner };

    const newCursor: Cursor | null = getCornerCursor(corners) ?? getEdgeCursor(edges);
    setCursor(newCursor);

    if (ref.current) {
      // change cursor only it's not set to "move", otherwise it means it is being dragged
      if (ref.current!.style.cursor !== 'move') {
        setStyle(ref, 'cursor', newCursor ?? '');
      }
    }
  }

  const edgeListener = useDebouncedCallback(({ clientX, clientY }: MouseEvent<HTMLDivElement>) => {
    const isLeftEdge = clientX < item.x + edgeSize;
    const isRightEdge = clientX > item.x + item.width - edgeSize;
    const isTopEdge = clientY < item.y + edgeSize;
    const isBottomEdge = clientY > item.y + item.height - edgeSize;

    handleEdgeHover({ isLeftEdge, isRightEdge, isTopEdge, isBottomEdge});
  }, 10);

  useEffect(() => {
    if (ref.current) {
      ref.current!.addEventListener('mousemove', edgeListener);
    }

    return () => {
      if (ref.current) {
        ref.current!.removeEventListener('mousemove', edgeListener);
      }
    }
  }, [ref.current]);

  return { cursor };
}
