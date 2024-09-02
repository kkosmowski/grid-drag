import { CSSProperties, useRef } from 'react';

import { Rectangle } from '~/types/item';

import styles from './Item.module.css';

type ItemProps = Rectangle;

export const Item = (props: ItemProps) => {
  const { id, x, y, width, height, color} = props;
  const ref = useRef<HTMLDivElement | null>(null);

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
