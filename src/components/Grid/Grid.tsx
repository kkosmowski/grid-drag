import { useCallback, useRef, useState } from 'react';

import styles from './Grid.module.css';
import { useItemContextMenu } from './hooks/use-item-context-menu';
import { relateItems } from './Grid.utils';

import { Item } from '~/components/Item';
import type { Position, Rectangle, ResizeData, Size } from '~/types/item';
import { GRID_SIZE } from '~/consts';
import { FloatingUI } from '~/components/FloatingUI';
import { useRemove } from '~/contexts/RemoveItemsContext';
import { normalizePosition, normalizeSize } from '~/utils/normalize';
import { CreateItemsOverlay } from '~/components/CreateItemsOverlay';
import { ContextMenu } from '~/components/ContextMenu';
import { getItem } from '~/utils/get-item';
import { useStorage } from '~/hooks/use-storage';
import { useToggle } from '~/hooks/use-toggle';

export const Grid = () => {
  const storage = useStorage();
  const [items, setItems] = useState(storage.getAll());
  const [isAddMode, toggleAddMode] = useToggle(false);
  const previousItems = useRef(items);
  const remove = useRemove();

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
      const filtered = current.filter(({ id }) => id !== itemId);
      return storage.setAll(relateItems(where === -1 ? [item, ...filtered] : [...filtered, item]));
    });
  };

  const { menuData, options, closeMenu } = useItemContextMenu({
    items,
    onColorChange: handleColorChange,
    onLayerChange: handleLayerChange,
  });

  const handleRemoveItems = () => {
    const newItems = relateItems(items.filter(({ id }) => remove.items.includes(id)));
    setItems(storage.setAll(newItems));
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
    (id: Rectangle['id'], { width, height, ...position }: ResizeData) => {
      const normalizedSize: Size = normalizeSize({ width, height });
      const normalizedPosition = normalizePosition(position);

      modifyItem(id, { ...normalizedSize, ...normalizedPosition });
    },
    [modifyItem],
  );

  const handleClick = (id: Rectangle['id']) => {
    if (remove.isOn) {
      remove.select(id);
    }
  };

  const handleCreateItem = (itemWithoutId: Omit<Rectangle, 'id'>) => {
    const normalizedItem: Rectangle = {
      id: items.length,
      contained: [],
      color: itemWithoutId.color,
      ...normalizePosition(itemWithoutId),
      ...normalizeSize(itemWithoutId),
    };

    previousItems.current = [...items];
    setItems(storage.add(normalizedItem));
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

      {items.map((item, index) => (
        <Item key={item.id} layer={index} {...item} onClick={handleClick} onMove={handleMove} onResize={handleResize} />
      ))}

      {isAddMode && <CreateItemsOverlay onCreate={handleCreateItem} />}

      {menuData && <ContextMenu options={options} data={menuData} onClose={closeMenu} />}
    </section>
  );
};
