import { MouseEvent, useState } from 'react';

import { Rectangle, TemporaryRectangle } from '~/types/item';

import styles from './CrateItemsOverlay.module.css';
import { ItemOutline } from '~/components/ItemOutline';
import { normalizePosition } from '~/utils/normalize';
import { MIN_ACCEPTABLE_SIZE_TO_CREATE } from '~/consts';
import { mapOutlineToRectangle } from '~/utils/map-outline-to-rectangle';

type CreateItemsOverlayProps = {
  onCreate: (itemWithoutId: Omit<Rectangle, 'id'>) => void;
};

export const CreateItemsOverlay = ({ onCreate }: CreateItemsOverlayProps) => {
  const [temp, setTemp] = useState<TemporaryRectangle | null>(null);

  const startCreatingItem = (e: MouseEvent) => {
    const { x, y } = normalizePosition({ x: e.clientX, y: e.clientY });
    setTemp({ x0: x, y0: y, x1: x, y1: y });
  };

  const updateItem = (e: MouseEvent) => {
    if (temp) {
      setTemp((item) => ({
        ...item!,
        x1: e.clientX,
        y1: e.clientY,
      }));
    }
  };

  const finishCreatingItem = () => {
    if (temp) {
      const itemOutline = mapOutlineToRectangle(temp);

      if (itemOutline.width < MIN_ACCEPTABLE_SIZE_TO_CREATE && itemOutline.height < MIN_ACCEPTABLE_SIZE_TO_CREATE) {
        setTemp(null);
        return;
      }

      // limited to 8-248 to avoid very light, very dark and over-saturated colors
      const getRandomHex = () =>
        Math.max(8, Math.floor(Math.random() * 248))
          .toString(16)
          .padStart(2, '0');

      const itemWithoutId: Omit<Rectangle, 'id'> = {
        ...itemOutline,
        color: '#' + getRandomHex() + getRandomHex() + getRandomHex(),
      };

      onCreate(itemWithoutId);
      setTemp(null);
    }
  };

  return (
    <div
      className={styles.createItemsOverlay}
      onMouseDown={startCreatingItem}
      onMouseMove={updateItem}
      onMouseUp={finishCreatingItem}
    >
      {temp && <ItemOutline {...temp} />}
    </div>
  );
};
