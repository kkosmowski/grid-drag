import { useEffect, useRef } from 'react';

import styles from './Item.module.css';
import { useEdges } from './hooks/use-edges';
import { useResize } from './hooks/use-resize/use-resize';
import { useMove } from './hooks/use-move';

import type { Position, Rectangle, ResizeData } from '~/types/item';
import { useRemove } from '~/contexts/RemoveItemsContext';
import { setStyle } from '~/utils/set-style';
import { setStyles } from '~/utils/set-styles';
import { setStyleProp } from '~/utils/set-style-prop';
import { stopPropagation } from '~/utils/stop-propagation';

type ItemProps = Rectangle & {
  layer: number;
  parent?: Rectangle;
  onClick?: (id: Rectangle['id']) => void;
  onMove?: (id: Rectangle['id'], position: Position) => void;
  onResize?: (id: Rectangle['id'], data: ResizeData) => void;
};

export const Item = ({ layer, parent, onClick, onMove, onResize, ...item }: ItemProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const freezeCursor = useRef(false);
  const remove = useRemove();

  const handleStart = () => {
    freezeCursor.current = true;
  };

  const handleEnd = () => {
    freezeCursor.current = false;
  };

  const handleMove = (id: Rectangle['id'], position: Position) => {
    freezeCursor.current = false;
    onMove?.(id, position);
  };
  const handleResize = (id: Rectangle['id'], data: ResizeData) => {
    freezeCursor.current = false;
    onResize?.(id, data);
  };

  const { cursor } = useEdges({ ref, item, parent, freezeCursor });
  // @todo: consider merging these 2 hooks
  useResize({ ref, item, cursor, onStart: handleStart, onEnd: handleEnd, onResize: handleResize });
  useMove({ ref, item, parent, cursor, onStart: handleStart, onEnd: handleEnd, onMove: handleMove });

  useEffect(() => {
    setStyles(ref, {
      top: item.y + 'px',
      left: item.x + 'px',
      width: item.width + 'px',
      height: item.height + 'px',
    });
    setStyleProp(ref, '--color', item.color);
  }, [item]);

  useEffect(() => {
    setStyleProp(ref, '--layer', layer);
  }, [layer]);

  useEffect(() => {
    setStyle(ref, 'opacity', remove.isSelected(item.id) ? '0.5' : '');
  }, [item.id, remove]);

  useEffect(() => {
    setStyle(ref, 'cursor', remove.isOn ? 'pointer' : '');
    freezeCursor.current = remove.isOn;
  }, [remove.isOn]);

  return (
    <div
      ref={ref}
      className={styles.item}
      onClick={(e) => {
        stopPropagation(e);
        onClick?.(item.id);
      }}
    >
      {item.contained.map((child, index) => (
        <Item
          key={child.id}
          layer={item.id + index}
          parent={item}
          {...child}
          onMove={onMove}
          onResize={onResize}
          onClick={onClick}
        />
      ))}
    </div>
  );
};
