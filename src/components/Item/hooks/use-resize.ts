import type { Cursor, ItemRef, Rectangle, ResizeData } from '~/types/item';
import { useEffect, useRef } from 'react';
import { setStyleProp } from '~/utils/set-style-prop';
import { setStyle } from '~/utils/set-style';

type UseMoveProps = {
  ref: ItemRef;
  item: Rectangle;
  cursor: Cursor | null;
  onResize: (id: string, data: ResizeData) => void;
}

export const useResize = ({ ref, item, cursor, onResize }: UseMoveProps) => {
  const canBeResized = cursor !== null;
  const isResizing = useRef(false);
  const clickTimeout = useRef<number | null>(null);

  const clear = () => {
    isResizing.current = false;

    if (clickTimeout.current !== null) {
      clearTimeout(clickTimeout.current!);
      clickTimeout.current = null;
    }
  }

  const setResize = ({ x, y, width, height }: ResizeData) => {
    setStyleProp(ref, '--resize-x', x + 'px');
    setStyleProp(ref, '--resize-y', y + 'px');
    setStyleProp(ref, '--resize-width', width + 'px');
    setStyleProp(ref, '--resize-height', height + 'px');
  }

  const onResizeStart = ({ target }: MouseEvent) => {
    if (!canBeResized || target !== ref.current) return;

    if (isResizing.current) {
      clear();
    }

    clickTimeout.current = setTimeout(() => {
      isResizing.current = true;

      if (ref.current) {
        const { width, height } = item;

        setStyleProp(ref, '--resize', 'block');
        setStyle(ref, 'z-index', '10000');
        setResize({ x: 0, y: 0, width, height });
      }
    }, 250);
  };

  const onResizeDrag = ({ clientX, clientY }: MouseEvent) => {
    if (isResizing.current) {
      // @todo: make it work for top left corner
      // @todo: make it work for top right corner
      // @todo: make it work for bottom left corner
      // @todo: make it work for edges only
      setResize({
        x: 0,
        y: 0,
        width: clientX - item.x,
        height: clientY - item.y,
      });
    }
  };

  const onResizeEnd = ({ clientX, clientY }: MouseEvent) => {
    if (isResizing.current) {
      onResize(item.id, {
        x: item.x,
        y: item.y,
        width: clientX - item.x,
        height: clientY - item.y,
      });
    }
    clear();

    if (ref.current) {
      setStyleProp(ref, '--resize', 'none');
      setStyle(ref, 'z-index', '');
    }
  };

  // @todo: move to Grid?
  useEffect(() => {
    if (ref.current) {
      window.addEventListener('mousedown', onResizeStart);
      window.addEventListener('mousemove', onResizeDrag);
      window.addEventListener('mouseup', onResizeEnd);
    }

    return () => {
      if (ref.current) {
        window.removeEventListener('mousedown', onResizeStart);
        window.removeEventListener('mousemove', onResizeDrag);
        window.removeEventListener('mouseup', onResizeEnd);
      }
    }
  }, [item]);
}