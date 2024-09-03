import { CSSProperties, useEffect, useRef } from 'react';

import { Position, Rectangle, ResizeData } from '~/types/item';

import styles from './Item.module.css';
import { useEdges } from './hooks/use-edges';
import { useResize } from '~/components/Item/hooks/use-resize';
import { useMove } from '~/components/Item/hooks/use-move';
import { setStyleProp } from '~/utils/set-style-prop';

type ItemProps = Rectangle & {
  onMove: (id: string, position: Position) => void;
  onResize: (id: string, data: ResizeData) => void;
};

export const Item = ({ onMove, onResize, ...item }: ItemProps) => {
  const { id, x, y, width, height, color} = item;
  const ref = useRef<HTMLDivElement | null>(null);
  const freezeCursor = useRef(false);

  const handleStart = () => {
    freezeCursor.current = true;
  }

  const handleMove = (id: string, position: Position) => {
    freezeCursor.current = false;
    onMove(id, position);
  }
  const handleResize = (id: string, data: ResizeData) => {
    freezeCursor.current = false;
    onResize(id, data);
  }

  const { cursor } = useEdges(ref, item, freezeCursor);
  // @todo: consider merging these 2 hooks
  useResize({ ref, item, cursor, onStart: handleStart, onResize: handleResize });
  useMove({ ref, item, cursor, onStart: handleStart, onMove: handleMove });

  const itemStyle: CSSProperties = {
    zIndex: id,
    top: y,
    left: x,
    width,
    height,
  };

  useEffect(() => {
    setStyleProp(ref, '--color', color);
  }, [color]);

  return (
    <div ref={ref} className={styles.item} style={itemStyle} />
  )
}
