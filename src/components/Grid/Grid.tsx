import { useCallback, useRef, useState } from 'react';

import { Item } from '~/components/Item';
import { Position, Rectangle, ResizeData, Size } from '~/types/item';
import { GRID_SIZE } from '~/consts';
import { FloatingUI } from '~/components/FloatingUI';
import { useRemove } from '~/contexts/RemoveItemsContext';

import { normalizePosition, normalizeSize } from '~/utils/normalize';
import styles from './Grid.module.css';
import { CreateItemsOverlay } from '../CreateItemsOverlay';
import { useItemContextMenu } from '~/components/Grid/hooks/use-item-context-menu';
import { ContextMenu } from '~/components/ContextMenu/ContextMenu';
import { getItem } from '~/utils/get-item';
import { useStorage } from '~/hooks/use-storage';

export const Grid = () => {
  const storage = useStorage();
  const [items, setItems] = useState(storage.getAll());
  const [isAddMode, setIsAddMode] = useState(false);
  const previousItems = useRef(items);
  const remove = useRemove();

  const modifyItem = useCallback(
    (itemId: Rectangle['id'], change: Partial<Rectangle>) => {
      previousItems.current = [...items];
      setItems(storage.patch(itemId, { ...change }));
    },
    [items, storage.patch],
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
      return storage.setAll(where === -1 ? [item, ...filtered] : [...filtered, item]);
    });
  };

  const { menuData, options, closeMenu } = useItemContextMenu({
    items,
    onColorChange: handleColorChange,
    onLayerChange: handleLayerChange,
  });

  const handleRemoveItems = () => {
    setItems(storage.remove(remove.items));
    remove.onAfterRemove();
  };

  const handleRemoveAll = () => {
    previousItems.current = [...items];
    setItems(storage.removeAll());
  };

  const handleUndoRemoveAll = () => {
    previousItems.current = [];
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
      color: itemWithoutId.color,
      ...normalizePosition(itemWithoutId),
      ...normalizeSize(itemWithoutId),
    };

    previousItems.current = [...items];
    setItems(storage.add(normalizedItem));
  };

  return (
    <section className={styles.grid} style={{ backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px` }}>
      <FloatingUI
        isAddMode={isAddMode}
        removeDisabled={!items.length}
        onRemoveItems={handleRemoveItems}
        onRemoveAll={handleRemoveAll}
        onUndoRemoveAll={handleUndoRemoveAll}
        onEnableAddMode={() => setIsAddMode(true)}
        onDisableAddMode={() => setIsAddMode(false)}
      />

      {items.map((item, index) => (
        <Item key={item.id} layer={index} {...item} onClick={handleClick} onMove={handleMove} onResize={handleResize} />
      ))}

      {isAddMode && <CreateItemsOverlay onCreate={handleCreateItem} />}

      {menuData && <ContextMenu options={options} data={menuData} onClose={closeMenu} />}
    </section>
  );
};
