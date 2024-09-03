import { CSSProperties, useEffect, useRef } from 'react';

import { Position, Rectangle } from '~/types/item';

import styles from './Item.module.css';
import { useEdges } from './hooks/use-edges';
import { useResize } from '~/components/Item/hooks/use-resize';
import { useMove } from '~/components/Item/hooks/use-move';

type ItemProps = Rectangle & {
  onMove: (id: string, position: Position) => void;
};

export const Item = ({ onMove, ...item }: ItemProps) => {
  const { id, x, y, width, height, color} = item;
  const ref = useRef<HTMLDivElement | null>(null);
  const { cursor } = useEdges(ref, item);

  if (item.id === '2') console.log('item', item);

  useResize({ ref, item, cursor });
  useMove({ ref, item, cursor, onMove });

  const itemStyle: CSSProperties = {
    zIndex: id,
    top: y,
    left: x,
    width,
    height,
    backgroundColor: color,
  };

  return (
    <div ref={ref} className={styles.item} style={itemStyle} />
  )
}
