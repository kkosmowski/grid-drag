import { CSSProperties, useEffect, useRef } from 'react';

import { Position, Rectangle, ResizeData } from '~/types/item';

import styles from './Item.module.css';
import { useEdges } from './hooks/use-edges';
import { useResize } from '~/components/Item/hooks/use-resize';
import { useMove } from '~/components/Item/hooks/use-move';
import { setStyleProp } from '~/utils/set-style-prop';
import { useRemove } from '~/contexts/RemoveItemsContext';
import { setStyle } from '~/utils/set-style';
import { zIndex } from '~/consts';

type ItemProps = Rectangle & {
  onClick?: (id: Rectangle['id']) => void;
  onMove?: (id: Rectangle['id'], position: Position) => void;
  onResize?: (id: Rectangle['id'], data: ResizeData) => void;
};

export const Item = ({ onClick, onMove, onResize, ...item }: ItemProps) => {
  const { id, x, y, width, height, color } = item;
  const ref = useRef<HTMLDivElement | null>(null);
  const freezeCursor = useRef(false);
  const remove = useRemove();

  const handleStart = () => {
    freezeCursor.current = true;
  };

  const handleMove = (id: Rectangle['id'], position: Position) => {
    freezeCursor.current = false;
    onMove?.(id, position);
  };
  const handleResize = (id: Rectangle['id'], data: ResizeData) => {
    freezeCursor.current = false;
    onResize?.(id, data);
  };

  const { cursor } = useEdges(ref, item, freezeCursor);
  // @todo: consider merging these 2 hooks
  useResize({ ref, item, cursor, onStart: handleStart, onResize: handleResize });
  useMove({ ref, item, cursor, onStart: handleStart, onMove: handleMove });

  const itemStyle: CSSProperties = {
    zIndex: zIndex.item(id),
    top: y,
    left: x,
    width,
    height,
  };

  useEffect(() => {
    setStyleProp(ref, '--color', color);
  }, [color]);

  useEffect(() => {
    setStyle(ref, 'opacity', remove.isSelected(id) ? '0.5' : '');
  }, [remove.isSelected]);

  useEffect(() => {
    setStyle(ref, 'cursor', remove.isOn ? 'pointer' : '');
    freezeCursor.current = remove.isOn;
  }, [remove.isOn]);

  return <div ref={ref} className={styles.item} style={itemStyle} onClick={() => onClick?.(id)} />;
};
