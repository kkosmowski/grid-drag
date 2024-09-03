import { Cursor, ItemRef, Position, Rectangle } from '~/types/item';
import { useEffect, useRef } from 'react';
import { setStyle } from '~/utils/set-style';
import { setStyleProp } from '~/utils/set-style-prop';

type UseMoveProps = {
  ref: ItemRef;
  item: Rectangle;
  cursor: Cursor | null;
  onMove: (id: string, pos: Position) => void;
}

const defaultInnerPosition: Position = { x: 0, y: 0 };

export  const useMove = ({ ref, item, cursor, onMove }: UseMoveProps) => {
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
  }

  const onDragStart = ({ clientX, clientY }: MouseEvent) => {
    if (!canBeMoved) return;

    if (isDragging.current) {
      clear();
    }

    clickTimeout.current = setTimeout(() => {
      isDragging.current = true;
      innerPosition.current = {
        x: clientX - item.x,
        y: clientY - item.y,
      }

      if (ref.current) {
        setStyleProp(ref, '--shadow', '0 0 8px 1px #0004');
        setStyle(ref, 'z-index', '10000');
        setStyle(ref, 'cursor', 'move');
      }
    }, 250);
  };

  const onDrag = ({ clientX, clientY }: MouseEvent) => {
    if (isDragging.current) {
      setStyle(ref, 'left', clientX - innerPosition.current.x + 'px');
      setStyle(ref, 'top', clientY - innerPosition.current.y + 'px');
    }
  };
  const onDragEnd = ({ clientX, clientY }: MouseEvent) => {
    if (isDragging.current) {
      onMove(item.id, {
        x: clientX - innerPosition.current.x,
        y: clientY - innerPosition.current.y,
      });
    }
    clear();

    if (ref.current) {
      setStyleProp(ref, '--shadow', 'none');
      setStyle(ref, 'z-index', '');
      setStyle(ref, 'cursor', '');
    }
  };

  useEffect(() => {
    if (ref.current) {
      ref.current!.addEventListener('mousedown', onDragStart);
      ref.current!.addEventListener('mousemove', onDrag);
      ref.current!.addEventListener('mouseup', onDragEnd);
      ref.current!.addEventListener('mouseout', onDragEnd);
    }

    return () => {
      if (ref.current) {
        ref.current!.removeEventListener('mousedown', onDragStart);
        ref.current!.removeEventListener('mousemove', onDrag);
        ref.current!.removeEventListener('mouseup', onDragEnd);
        ref.current!.removeEventListener('mouseout', onDragEnd);
      }
    }
  }, [item]);

  return null;
}