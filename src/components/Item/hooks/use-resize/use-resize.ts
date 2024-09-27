import { useEffect, useRef, useState } from 'react';

import { createResizeMap } from './use-resize.utils';

import type { Cursor, ItemRef, Rectangle, ResizeData } from '~/types/item';
import { setStyleProp } from '~/utils/set-style-prop';
import { setStyle } from '~/utils/set-style';
import { HOLD_TIME_MS, Z_INDEX } from '~/consts';
import { useSettings } from '~/hooks/use-settings';
import { getNewPosition } from '~/utils/get-new-position';

type UseResizeProps = {
  ref: ItemRef;
  item: Rectangle;
  parent?: Rectangle;
  cursor: Cursor | null;
  onStart: VoidFunction;
  onEnd: VoidFunction;
  onResize: (id: Rectangle['id'], data: ResizeData) => void;
};

export const useResize = ({ ref, item, parent, cursor, onStart, onEnd, onResize }: UseResizeProps) => {
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const settings = useSettings();
  const canBeResized = cursor !== null;
  const isResizing = useRef(false);
  const clickTimeout = useRef<number | null>(null);

  const resizeMap = (clientX: number, clientY: number, isSquare: boolean) =>
    createResizeMap({ item, clientX, clientY, isSquare });

  const clear = () => {
    isResizing.current = false;

    if (clickTimeout.current !== null) {
      clearTimeout(clickTimeout.current!);
      clickTimeout.current = null;
      onEnd();
    }

    if (ref.current) {
      setStyleProp(ref, '--resize', 'none');
      setStyle(ref, 'zIndex', '');
      setStyleProp(ref, '--resize-x', '');
      setStyleProp(ref, '--resize-y', '');
      setStyleProp(ref, '--resize-width', '');
      setStyleProp(ref, '--resize-height', '');
    }
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setIsShiftPressed(true);
    }
  };

  const onKeyup = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setIsShiftPressed(false);
    }
  };

  useEffect(() => {
    clear();
  }, [cursor]);

  const setResize = ({ x, y, width, height }: ResizeData) => {
    setStyleProp(ref, '--resize-x', x + 'px');
    setStyleProp(ref, '--resize-y', y + 'px');
    setStyleProp(ref, '--resize-width', width + 'px');
    setStyleProp(ref, '--resize-height', height + 'px');
  };

  const onResizeStart = ({ button, target }: MouseEvent) => {
    if (target !== ref.current) return;
    if (button !== 0) return; // handle LMB only
    if (!canBeResized) return;

    if (isResizing.current) {
      clear();
    }

    clickTimeout.current = setTimeout(() => {
      onStart();
      isResizing.current = true;

      if (ref.current) {
        const { width, height } = item;

        setStyleProp(ref, '--resize', 'block');
        setStyle(ref, 'zIndex', Z_INDEX.draggedItem);
        setResize({ x: 0, y: 0, width, height });
      }
    }, HOLD_TIME_MS);
  };

  const onResizeDrag = ({ clientX, clientY }: MouseEvent) => {
    if (isResizing.current && cursor) {
      const realX = clientX - (parent?.x ?? 0);
      const realY = clientY - (parent?.y ?? 0);
      const { x, y } = getNewPosition(realX, realY, settings.isPreviewSnapped);

      setResize(resizeMap(x, y, isShiftPressed)[cursor]);
    }
  };

  const onResizeEnd = ({ clientX, clientY }: MouseEvent) => {
    if (isResizing.current && cursor) {
      const realX = clientX - (parent?.x ?? 0);
      const realY = clientY - (parent?.y ?? 0);
      const relativeResizeData = resizeMap(realX, realY, isShiftPressed)[cursor];

      // resize map contains position of pseudo element (relative to item), but absolute position must be passed to grid
      const absoluteResizeData: ResizeData = {
        x: relativeResizeData.x + item.x,
        y: relativeResizeData.y + item.y,
        width: relativeResizeData.width,
        height: relativeResizeData.height,
      };

      onResize(item.id, absoluteResizeData);
    }

    clear();
  };

  // @todo: move to Grid?
  useEffect(() => {
    if (ref.current) {
      window.addEventListener('mousedown', onResizeStart);
      window.addEventListener('mousemove', onResizeDrag);
      window.addEventListener('mouseup', onResizeEnd);
      window.addEventListener('keydown', onKeydown);
      window.addEventListener('keyup', onKeyup);
    }

    const nodeRef = ref.current;

    return () => {
      if (nodeRef) {
        window.removeEventListener('mousedown', onResizeStart);
        window.removeEventListener('mousemove', onResizeDrag);
        window.removeEventListener('mouseup', onResizeEnd);
        window.removeEventListener('keydown', onKeydown);
        window.removeEventListener('keyup', onKeyup);
      }
    };
  }, [item]);
};
