import type { Cursor, ItemRef, Rectangle, ResizeData } from '~/types/item';
import { useEffect, useRef } from 'react';
import { setStyleProp } from '~/utils/set-style-prop';
import { setStyle } from '~/utils/set-style';
import { createResizeMap } from '~/components/Item/hooks/use-resize.utils';

type UseMoveProps = {
  ref: ItemRef;
  item: Rectangle;
  cursor: Cursor | null;
  onStart: VoidFunction;
  onResize: (id: string, data: ResizeData) => void;
}

export const useResize = ({ ref, item, cursor, onStart, onResize }: UseMoveProps) => {
  const canBeResized = cursor !== null;
  const isResizing = useRef(false);
  const clickTimeout = useRef<number | null>(null);

  const resizeMap = (clientX: number, clientY: number) => createResizeMap({ item, clientX, clientY });

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
      onStart();
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
      setResize(resizeMap(clientX, clientY)[cursor].pending);
    }
  };

  const onResizeEnd = ({ clientX, clientY }: MouseEvent) => {
    if (isResizing.current) {
      onResize(item.id, resizeMap(clientX, clientY)[cursor].done);
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