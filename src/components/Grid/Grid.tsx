import { MouseEvent, useCallback, useMemo, useRef, useState } from 'react';

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
import { ContextMenu } from '~/components/ContextMenu/ContextMenu';
import { MenuItem } from '~/types/ui';
import { isDefined } from '~/utils/is-defined';

export const Grid = () => {
  const [items, setItems] = useState<Rectangle[]>(itemsMock);
  const [isAddMode, setIsAddMode] = useState(false);
  const previousItems = useRef(items);
  const remove = useRemove();

  const modifyItem = useCallback(
    (itemId: Rectangle['id'], change: Partial<Rectangle>) => {
      previousItems.current = [...items];
      setItems((current) => current.map((item) => (item.id === itemId ? { ...item, ...change } : item)));
    },
    [items, setItems],
  );

  const moveItemToFront = useCallback(
    (_: MouseEvent, itemId: Rectangle['id']) => {
      const item: Rectangle = items.find((item) => item.id === itemId)!;
      setItems((current) => [...current.filter((item) => item.id !== itemId), { ...item }]);
    },
    [items, setItems],
  );

  const moveItemToBack = useCallback(
    (_: MouseEvent, itemId: Rectangle['id']) => {
      const item: Rectangle = items.find((item) => item.id === itemId)!;
      setItems((current) => [{ ...item }, ...current.filter((item) => item.id !== itemId)]);
    },
    [items, setItems],
  );

  const changeItemColor = useCallback((_: MouseEvent, _itemId: Rectangle['id']) => {}, []);

  const itemMenuOptions: MenuItem[] = useMemo(
    () => [
      { id: 'item-to-top', label: <>Move to front &#x2191;</>, onClick: moveItemToFront.bind(moveItemToFront) },
      { id: 'item-to-bottom', label: <>Move to back &#x2193;</>, onClick: moveItemToBack.bind(moveItemToBack) },
      { id: 'item-change-color', label: <>Set color</>, onClick: changeItemColor.bind(changeItemColor) },
    ],
    [moveItemToFront, moveItemToBack, changeItemColor],
  );
  const { activeItem, menuData, closeMenu } = useContextMenu(items, itemMenuOptions);

  const handleRemoveItems = () => {
    setItems((items) => items.filter(({ id }) => !remove.items.includes(id)));
    remove.onAfterRemove();
  };

  const handleRemoveAll = () => {
    previousItems.current = [...items];
    setItems([]);
  };

  const handleUndoRemoveAll = () => {
    setItems(previousItems.current);
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

      {items.map((item, index) => (
        <Item key={item.id} layer={index} {...item} onClick={handleClick} onMove={handleMove} onResize={handleResize} />
      ))}

      {isAddMode && <CreateItemsOverlay onCreate={handleCreateItem} />}

      {isDefined(activeItem) && menuData && (
        <ContextMenu options={itemMenuOptions} data={menuData} activeItem={activeItem} onClose={closeMenu} />
      )}
    </section>
  );
};
