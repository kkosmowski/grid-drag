import { useCallback, useRef, useState } from 'react';

import styles from './Grid.module.css';
import { useItemContextMenu } from './hooks/use-item-context-menu';
import { relateItems, updateChildrenAfterParentResize } from './Grid.utils';

import { Item } from '~/components/Item';
import type { Position, Rectangle, ResizeData } from '~/types/item';
import { GRID_SIZE, ITEM_LEVEL_HEADSTART, MAX_ITEM_Z_INDEX } from '~/consts';
import { FloatingUI } from '~/components/FloatingUI';
import { useRemove } from '~/contexts/RemoveItemsContext';
import { normalizePosition, normalizeSize } from '~/utils/normalize';
import { CreateItemsOverlay } from '~/components/CreateItemsOverlay';
import { ContextMenu } from '~/components/ContextMenu';
import { getItem } from '~/utils/get-item';
import { useStorage } from '~/hooks/use-storage';
import { useToggle } from '~/hooks/use-toggle';
import { flattenItems } from '~/utils/flatten-items';
import { useNextNumber } from '~/hooks/use-next-number';
import { convertToAbsolutePosition } from '~/utils/convert-to-absolute-position';

export const Grid = () => {
  const storage = useStorage();
  const [items, setItems] = useState(storage.getAll());
  const [isAddMode, toggleAddMode] = useToggle(false);
  const previousItems = useRef(items);
  const remove = useRemove();
  const [getId] = useNextNumber({
    initial: Math.max(0, ...flattenItems(items).map(({ id }) => id)),
    max: MAX_ITEM_Z_INDEX,
  });
  const [getLowestLevel, lowestLevel] = useNextNumber({
    reversed: true,
    initial: Math.min(MAX_ITEM_Z_INDEX, ...flattenItems(items).map(({ level }) => level)),
    min: 0,
  });
  const [getHighestLevel, highestLevel] = useNextNumber({
    initial: Math.max(0, ...flattenItems(items).map(({ level }) => level)),
    max: MAX_ITEM_Z_INDEX,
  });

  const modifyItem = useCallback(
    (itemId: Rectangle['id'], change: Partial<Rectangle>) => {
      previousItems.current = [...items];

      const newItems = relateItems(
        items.map((rectangle) =>
          rectangle.id === itemId
            ? { ...rectangle, ...change }
            : {
                ...rectangle,
                contained: rectangle.contained.map((child) => (child.id === itemId ? { ...child, ...change } : child)),
              },
        ),
      );

      setItems(storage.setAll(newItems));
    },
    [items, storage],
  );

  const handleColorChange = (itemId: Rectangle['id'], color: string) => {
    modifyItem(itemId, { color });
  };

  const handleLayerChange = (itemId: Rectangle['id'], where: -1 | 1) => {
    const item = getItem(items, itemId);

    if (!item) {
      console.error('handleLayerChange: no item found.');
      return;
    }

    setItems((current) => {
      console.log(lowestLevel, item.level);
      const alreadyAtBottom = where === -1 && item.level === lowestLevel;
      const alreadyAtTop = where === 1 && item.level === highestLevel;

      // no change necessary
      if (alreadyAtTop || alreadyAtBottom) return current;

      const parent = current.find(({ contained }) => contained.map(({ id }) => id).includes(itemId));
      const filtered = flattenItems<Rectangle>(current, { absolutize: true, withContained: true }).filter(
        ({ id }) => id !== itemId,
      );
      const newLevel = where === -1 ? getLowestLevel() : getHighestLevel();

      const itemWithModifiedLevel = { ...item, level: newLevel };
      const finalItem: Rectangle = parent
        ? { ...convertToAbsolutePosition(itemWithModifiedLevel, parent), contained: [] }
        : itemWithModifiedLevel;

      return storage.setAll(relateItems([...filtered, finalItem]));
    });
  };

  const { menuData, options, closeMenu } = useItemContextMenu({
    items,
    onColorChange: handleColorChange,
    onLayerChange: handleLayerChange,
  });

  const handleRemoveItems = () => {
    // try to remove level 0 item (parent-less item)
    let newItems = items.filter(({ id }) => !remove.items.includes(id));

    // if parent-less item removed, find the child
    if (newItems.length === items.length) {
      newItems = items.map((item) => ({
        ...item,
        contained: item.contained.filter(({ id }) => !remove.items.includes(id)),
      }));
    }

    setItems(storage.setAll(relateItems(newItems)));
    remove.onAfterRemove();
  };

  const handleRemoveAll = () => {
    previousItems.current = [...items];
    setItems(storage.removeAll());
  };

  const handleUndoRemoveAll = () => {
    setItems(storage.setAll(previousItems.current));
  };

  const handleMove = useCallback(
    (id: Rectangle['id'], position: Position) => {
      const normalizedPosition = normalizePosition(position);

      modifyItem(id, { ...normalizedPosition });
    },
    [modifyItem],
  );

  const handleResize = useCallback(
    (itemId: Rectangle['id'], { width, height, ...position }: ResizeData) => {
      const normalizedResizeData: ResizeData = {
        ...normalizeSize({ width, height }),
        ...normalizePosition(position),
      };
      const updatedChildren = updateChildrenAfterParentResize(
        items.find(({ id }) => id === itemId),
        normalizedResizeData,
      );

      modifyItem(itemId, { ...normalizedResizeData, contained: updatedChildren });
    },
    [items, modifyItem],
  );

  const handleClick = (id: Rectangle['id']) => {
    if (remove.isOn) {
      remove.select(id);
    }
  };

  const handleCreateItem = (itemWithoutId: Omit<Rectangle, 'id'>) => {
    const id = getId();

    const normalizedItem: Rectangle = {
      id,
      level: ITEM_LEVEL_HEADSTART + id,
      contained: [],
      color: itemWithoutId.color,
      ...normalizePosition(itemWithoutId),
      ...normalizeSize(itemWithoutId),
    };

    previousItems.current = [...items];
    setItems(storage.setAll(relateItems([...items, normalizedItem])));
  };

  const removeDisabled = !items.length || isAddMode;

  return (
    <section className={styles.grid} style={{ backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px` }}>
      <FloatingUI
        isAddMode={isAddMode}
        removeDisabled={removeDisabled}
        onRemoveItems={handleRemoveItems}
        onRemoveAll={handleRemoveAll}
        onUndoRemoveAll={handleUndoRemoveAll}
        onToggleAddMode={toggleAddMode}
      />

      {items.map((item) => (
        <Item key={item.id} {...item} onClick={handleClick} onMove={handleMove} onResize={handleResize} />
      ))}

      {isAddMode && <CreateItemsOverlay onCreate={handleCreateItem} />}

      {menuData && <ContextMenu options={options} data={menuData} onClose={closeMenu} />}
    </section>
  );
};
