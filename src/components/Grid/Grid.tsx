import { useRef, useState } from 'react';

import { Item } from '~/components/Item';
import { Position, Rectangle, ResizeData, Size } from '~/types/item';
import { GRID_SIZE } from '~/consts';
import { FloatingUI } from '~/components/FloatingUI';
import { useRemove } from '~/contexts/RemoveItemsContext';

import { normalizePosition, normalizeSize } from '~/utils/normalize';
import styles from './Grid.module.css';
import { itemsMock } from './Grid.mock';
import { CreateItemsOverlay } from '../CreateItemsOverlay';
import { useContextMenu } from '~/components/Grid/hooks/use-context-menu';

export const Grid = () => {
  const [items, setItems] = useState<Rectangle[]>(itemsMock);
  const [isAddMode, setIsAddMode] = useState(false);
  const previousItems = useRef(items);
  const remove = useRemove();
  const { activeItem, closeMenu } = useContextMenu(items);

  const handleRemoveItems = () => {
    setItems((items) => items.filter(({ id }) => !remove.items.includes(id)));
    remove.onAfterRemove();
  };

  const handleRemoveAll = () => {
    previousItems.current = items;
    setItems([]);
  };

  const handleUndoRemoveAll = () => {
    setItems(previousItems.current);
  };

  const handleMove = (id: Rectangle['id'], position: Position) => {
    const normalizedPosition = normalizePosition(position);

    previousItems.current = items;
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...normalizedPosition } : item)));
  };

  const handleResize = (id: Rectangle['id'], resizeData: ResizeData) => {
    const { width, height, ...position } = resizeData;
    const normalizedSize: Size = normalizeSize({ width, height });
    const normalizedPosition = normalizePosition(position);

    previousItems.current = items;
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...normalizedSize, ...normalizedPosition } : item)),
    );
  };

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

    setItems((items) => [...items, normalizedItem]);
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

      {items.map((item) => (
        <Item key={item.id} {...item} onClick={handleClick} onMove={handleMove} onResize={handleResize} />
      ))}

      {isAddMode && <CreateItemsOverlay onCreate={handleCreateItem} />}
    </section>
  );
};
