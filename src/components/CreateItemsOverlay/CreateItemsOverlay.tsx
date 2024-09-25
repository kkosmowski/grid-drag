import { MouseEvent, useEffect, useState } from 'react';

import { Rectangle, TemporaryRectangle } from '~/types/item';

import styles from './CrateItemsOverlay.module.css';
import { ItemOutline } from '~/components/ItemOutline';
import { normalizePosition } from '~/utils/normalize';
import { MIN_ACCEPTABLE_SIZE_TO_CREATE, zIndex } from '~/consts';
import { mapOutlineToRectangle } from '~/utils/map-outline-to-rectangle';
import { useSettings } from '~/hooks/use-settings';
import { getNewPosition } from '~/utils/get-new-position';

import { toSquare } from './CreateItemsOverlay.utils';

type CreateItemsOverlayProps = {
  onCreate: (itemWithoutId: Omit<Rectangle, 'id'>) => void;
};

export const CreateItemsOverlay = ({ onCreate }: CreateItemsOverlayProps) => {
  const [temp, setTemp] = useState<TemporaryRectangle | null>(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const settings = useSettings();

  const startCreatingItem = (e: MouseEvent) => {
    const { x, y } = normalizePosition({ x: e.clientX, y: e.clientY });
    setTemp({ x0: x, y0: y, x1: x, y1: y });
  };

  const updateItem = (e: MouseEvent) => {
    if (temp) {
      setTemp((item) => {
        const { x: x1, y: y1 } = getNewPosition(e.clientX, e.clientY, settings.isPreviewSnapped);
        return toSquare({ ...item!, x1, y1 }, isShiftPressed);
      });
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
    window.addEventListener('keydown', onKeydown);
    window.addEventListener('keyup', onKeyup);

    return () => {
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('keyup', onKeyup);
    };
  }, []);

  return (
    <div
      style={{ zIndex: zIndex.createOverlay }}
      className={styles.createItemsOverlay}
      onMouseDown={startCreatingItem}
      onMouseMove={updateItem}
      onMouseUp={finishCreatingItem}
    >
      {temp && <ItemOutline {...temp} />}
    </div>
  );
};
