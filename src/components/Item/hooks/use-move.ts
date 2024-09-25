import { useEffect, useRef } from 'react';

import type { Cursor, ItemRef, Position, Rectangle } from '~/types/item';
import { setStyle } from '~/utils/set-style';
import { setStyleProp } from '~/utils/set-style-prop';
import { HOLD_TIME_MS } from '~/consts';
import { useSettings } from '~/hooks/use-settings';
import { getNewPosition } from '~/utils/get-new-position';

type UseMoveProps = {
  ref: ItemRef;
  item: Rectangle;
  cursor: Cursor | null;
  onStart: VoidFunction;
  onMove: (id: Rectangle['id'], pos: Position) => void;
};

const defaultInnerPosition: Position = { x: 0, y: 0 };

export const useMove = ({ ref, item, cursor, onStart, onMove }: UseMoveProps) => {
  const settings = useSettings();
  const canBeMoved = cursor === null;
  const isDragging = useRef(false);
  const innerPosition = useRef<Position>(defaultInnerPosition);
  const clickTimeout = useRef<number | null>(null);

  const clear = () => {
    isDragging.current = false;
    innerPosition.current = defaultInnerPosition;

    if (clickTimeout.current !== null) {
      clearTimeout(clickTimeout.current!);
      clickTimeout.current = null;
    }
  };

  const onDragStart = ({ button, clientX, clientY }: MouseEvent) => {
    if (button !== 0) return; // handle LMB only
    if (!canBeMoved) return;

    if (isDragging.current) {
      clear();
    }

    clickTimeout.current = setTimeout(() => {
      onStart();
      isDragging.current = true;
      innerPosition.current = {
        x: clientX - item.x,
        y: clientY - item.y,
      };

      if (ref.current) {
        setStyleProp(ref, '--shadow', '0 0 8px 1px #0004');
        setStyle(ref, 'zIndex', 10000);
        setStyle(ref, 'cursor', 'move');
      }
    }, HOLD_TIME_MS);
  };

  const onDrag = ({ clientX, clientY }: MouseEvent) => {
    if (isDragging.current) {
      const { x, y } = getNewPosition(
        clientX - innerPosition.current.x,
        clientY - innerPosition.current.y,
        settings.isPreviewSnapped,
      );
      setStyle(ref, 'left', x + 'px');
      setStyle(ref, 'top', y + 'px');
    }
  };
  const onDragEnd = ({ clientX, clientY }: MouseEvent) => {
    if (isDragging.current) {
      onMove(item.id, {
        x: clientX - innerPosition.current.x,
        y: clientY - innerPosition.current.y,
      });

      if (ref.current) {
        setStyleProp(ref, '--shadow', 'none');
        setStyle(ref, 'zIndex', '');
        setStyle(ref, 'cursor', '');
      }
    }
    clear();
  };

  useEffect(() => {
    if (ref.current) {
      ref.current!.addEventListener('mousedown', onDragStart);
      ref.current!.addEventListener('mousemove', onDrag);
      ref.current!.addEventListener('mouseup', onDragEnd);
      ref.current!.addEventListener('mouseout', onDragEnd);
    }

    const nodeRef = ref.current;

    return () => {
      if (nodeRef) {
        nodeRef.removeEventListener('mousedown', onDragStart);
        nodeRef.removeEventListener('mousemove', onDrag);
        nodeRef.removeEventListener('mouseup', onDragEnd);
        nodeRef.removeEventListener('mouseout', onDragEnd);
      }
    };
  }, [item]);

  return null;
};
