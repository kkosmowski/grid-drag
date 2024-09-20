import { CSSProperties, useRef } from 'react';

import { TemporaryRectangle } from '~/types/item';

import styles from './ItemOutline.module.css';
import { zIndex } from '~/consts';
import { mapOutlineToRectangle } from '~/utils/map-outline-to-rectangle';

type ItemOutlineProps = TemporaryRectangle;

export const ItemOutline = (temp: ItemOutlineProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const { x, y, width, height } = mapOutlineToRectangle(temp);

  const outlineStyle: CSSProperties = {
    zIndex: zIndex.temporaryItem,
    top: y,
    left: x,
    width,
    height,
  };

  return <div ref={ref} className={styles.itemOutline} style={outlineStyle} />;
};
