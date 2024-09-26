import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { getCornerCursor, getEdgeCursor } from './use-edges.utils';

import type { Cursor, ItemCorners, ItemEdges, ItemRef, Rectangle } from '~/types/item';
import { setStyle } from '~/utils/set-style';
import { isBottomEdge, isLeftEdge, isRightEdge, isTopEdge } from '~/utils/edges-and-corners';

const LISTEN_DEBOUNCE = 10;

type UseEdgesProps = {
  ref: ItemRef;
  item: Rectangle;
  parent?: Rectangle;
  freezeCursor: MutableRefObject<boolean>;
};

// This hook is responsible for listening to mouse on edges and handling correct cursor.
// This cursor is later provided to the component to make decisions such as whether to resize or move.
export const useEdges = ({ ref, item, parent, freezeCursor }: UseEdgesProps) => {
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

  const debouncedEdgeListener = useDebouncedCallback(({ clientX, clientY }: MouseEvent) => {
    const isLE = isLeftEdge(clientX, item, parent);
    const isRE = isRightEdge(clientX, item, parent);
    const isTE = isTopEdge(clientY, item, parent);
    const isBE = isBottomEdge(clientY, item, parent);

    handleEdgeHover({ isLE, isRE, isTE, isBE });
  }, LISTEN_DEBOUNCE);

  const edgeListener = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      debouncedEdgeListener(event);
    },
    [debouncedEdgeListener],
  );

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
  }, [edgeListener, ref, resetCursor]);

  return { cursor };
};
