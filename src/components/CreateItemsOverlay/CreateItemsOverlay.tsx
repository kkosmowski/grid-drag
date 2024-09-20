import { MouseEvent, useRef } from 'react';

import { Position, Rectangle } from '~/types/item';

import styles from './CrateItemsOverlay.module.css';

type CreateItemsOverlayProps = {
  onCreate: (itemWithoutId: Omit<Rectangle, 'id'>) => void;
};

export const CreateItemsOverlay = ({ onCreate }: CreateItemsOverlayProps) => {
  const partialItem = useRef<Position | null>(null);

  const startCreatingItem = (e: MouseEvent) => {
    partialItem.current = { x: e.clientX, y: e.clientY };
  };

  const finishCreatingItem = (e: MouseEvent) => {
    const itemWithoutIdAndColor: Omit<Rectangle, 'id' | 'color'> = {
      x: Math.min(partialItem.current!.x, e.clientX),
      y: Math.min(partialItem.current!.y, e.clientY),
      width: Math.abs(partialItem.current!.x - e.clientX),
      height: Math.abs(partialItem.current!.y - e.clientY),
    };

    // limited to 8-248 to avoid very light, very dark and over-saturated colors
    const getRandomHex = () => Math.max(8, Math.floor(Math.random() * 248)).toString(16);

    const itemWithoutId: Omit<Rectangle, 'id'> = {
      ...itemWithoutIdAndColor,
      color: '#' + getRandomHex() + getRandomHex() + getRandomHex(),
    };

    onCreate(itemWithoutId);
  };

  return <div className={styles.createItemsOverlay} onMouseDown={startCreatingItem} onMouseUp={finishCreatingItem} />;
};
