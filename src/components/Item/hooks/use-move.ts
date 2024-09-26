import { useEffect, useRef } from 'react';

import { constrainToBoard } from './use-move.utils';

import type { Cursor, ItemRef, Position, Rectangle } from '~/types/item';
import { setStyle } from '~/utils/set-style';
import { setStyleProp } from '~/utils/set-style-prop';
import { HOLD_TIME_MS, zIndex } from '~/consts';
import { useSettings } from '~/hooks/use-settings';
import { getNewPosition } from '~/utils/get-new-position';

type UseMoveProps = {
  ref: ItemRef;
  item: Rectangle;
  cursor: Cursor | null;
  onStart: VoidFunction;
  onEnd: VoidFunction;
  onMove: (id: Rectangle['id'], pos: Position) => void;
};

const defaultInnerPosition: Position = { x: 0, y: 0 };

export const useMove = ({ ref, item, cursor, onStart, onEnd, onMove }: UseMoveProps) => {
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
      onEnd();
    }

    if (ref.current) {
      setStyleProp(ref, '--shadow', 'none');
      setStyle(ref, 'zIndex', '');
      setStyle(ref, 'cursor', '');
    }
  };

  const onDragStart = (event: MouseEvent) => {
    event.stopPropagation();
    const { button, clientX, clientY } = event;

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
        setStyle(ref, 'zIndex', zIndex.temporaryItem);
        setStyle(ref, 'cursor', 'move');
      }
    }, HOLD_TIME_MS);
  };

  const onDrag = ({ clientX, clientY }: MouseEvent) => {
    if (isDragging.current) {
      const initialPosition = getNewPosition(
        clientX - innerPosition.current.x,
        clientY - innerPosition.current.y,
        settings.isPreviewSnapped,
      );

      const { x, y } = constrainToBoard(initialPosition, item);

      setStyle(ref, 'left', x + 'px');
      setStyle(ref, 'top', y + 'px');
    }
  };
  const onDragEnd = ({ clientX, clientY }: MouseEvent) => {
    if (isDragging.current) {
      const initialPosition = getNewPosition(
        clientX - innerPosition.current.x,
        clientY - innerPosition.current.y,
        settings.isPreviewSnapped,
      );
      const { x, y } = constrainToBoard(initialPosition, item);

      onMove(item.id, { x, y });
      onEnd();

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
