import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { getCornerCursor, getEdgeCursor } from './use-edges.utils';

import type { Cursor, ItemCorners, ItemEdges, ItemRef, Rectangle } from '~/types/item';
import { setStyle } from '~/utils/set-style';
import { isBottomEdge, isLeftEdge, isRightEdge, isTopEdge } from '~/utils/edges-and-corners';

const LISTEN_DEBOUNCE = 10;

// This hook is responsible for listening to mouse on edges and handling correct cursor.
// This cursor is later provided to the component to make decisions such as whether to resize or move.
export const useEdges = (ref: ItemRef, item: Rectangle, freezeCursor: MutableRefObject<boolean>) => {
  const [cursor, setCursor] = useState<Cursor | null>(null);

  const handleEdgeHover = (edges: ItemEdges) => {
    const { isLE, isBE, isTE, isRE } = edges;

    const isLTC = isLE && isTE;
    const isLBC = isLE && isBE;
    const isRTC = isRE && isTE;
    const isRBC = isRE && isBE;

    const corners: ItemCorners = { isLTC, isLBC, isRTC, isRBC };

    const newCursor: Cursor | null = getCornerCursor(corners) ?? getEdgeCursor(edges);

    if (ref.current && !freezeCursor.current) {
      setCursor(newCursor);
      setStyle(ref, 'cursor', newCursor ?? '');
    }
  };

  const edgeListener = useDebouncedCallback(({ clientX, clientY }: MouseEvent) => {
    const isLE = isLeftEdge(clientX, item);
    const isRE = isRightEdge(clientX, item);
    const isTE = isTopEdge(clientY, item);
    const isBE = isBottomEdge(clientY, item);

    handleEdgeHover({ isLE, isRE, isTE, isBE });
  }, LISTEN_DEBOUNCE);

  const resetCursor = useCallback(() => {
    if (!freezeCursor.current) {
      setTimeout(() => {
        setCursor(null);
        setStyle(ref, 'cursor', '');
      }, LISTEN_DEBOUNCE);
    }
  }, [freezeCursor, ref]);

  useEffect(() => {
    if (ref.current) {
      ref.current!.addEventListener('mousemove', edgeListener);
      ref.current!.addEventListener('mouseleave', resetCursor);
    }

    const itemRef = ref.current;

    return () => {
      if (itemRef) {
        itemRef.removeEventListener('mousemove', edgeListener);
        itemRef.removeEventListener('mouseleave', resetCursor);
      }
    };
  }, [ref.current]);

  return { cursor };
};
