import { CSSProperties, useEffect, useRef } from 'react';

import { Position, Rectangle, ResizeData } from '~/types/item';

import styles from './Item.module.css';
import { useEdges } from './hooks/use-edges';
import { useResize } from '~/components/Item/hooks/use-resize.ts';
import { useMove } from '~/components/Item/hooks/use-move';
import { setStyleProp } from '~/utils/set-style-prop';

type ItemProps = Rectangle & {
  onMove: (id: string, position: Position) => void;
  onResize: (id: string, data: ResizeData) => void;
};

export const Item = ({ onMove, onResize, ...item }: ItemProps) => {
  const { id, x, y, width, height, color} = item;
  const ref = useRef<HTMLDivElement | null>(null);
  const { cursor } = useEdges(ref, item);
  useResize({ ref, item, cursor, onResize });
  useMove({ ref, item, cursor, onMove });

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
