import { useRef, useState } from 'react';

import { Item } from '~/components/Item';
import { Position, Rectangle, ResizeData, Size } from '~/types/item';
import { GRID_SIZE } from '~/consts';
import { FloatingUI } from '~/components/FloatingUI';
import { useRemove } from '~/contexts/RemoveItemsContext';

import { normalizePosition, normalizeSize } from './Grid.utils';
import  styles from './Grid.module.css';

const itemsMock: Rectangle[] = [
  {
    id: '1',
    x: 120,
    y: 140,
    width: 100,
    height: 70,
    color: '#823751',
  },
  {
    id: '2',
    x: 340,
    y: 290,
    width: 170,
    height: 210,
    color: '#a8dfa1',
  },
  {
    id: '3',
    x: 280,
    y: 130,
    width: 220,
    height: 30,
    color: '#8c81c4',
  },
  {
    id: '4',
    x: 160,
    y: 160,
    width: 40,
    height: 40,
    color: '#eca236',
  },
]

export const Grid = () => {
  const [items, setItems] = useState<Rectangle[]>(itemsMock);
  const previousItems = useRef(items);
  const remove = useRemove();

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

  const handleMove = (id: string, position: Position) => {
    const normalizedPosition = normalizePosition(position);

    previousItems.current = items;
    setItems((current) => current.map(
      (item) => item.id === id ? ({ ...item, ...normalizedPosition }) : item)
    );
  }

  const handleResize = (id: string, resizeData: ResizeData) => {
    const { width, height, ...position } = resizeData;
    const normalizedSize: Size = normalizeSize({ width, height });
    const normalizedPosition = normalizePosition(position);

    previousItems.current = items;
    setItems((current) => current.map(
      (item) => item.id === id ? ({ ...item, ...normalizedSize, ...normalizedPosition }) : item)
    );
  }

  const handleClick = (itemId: string) => {
    if (remove.isOn) {
      remove.select(itemId);
    }
  }

  return (
    <section className={styles.grid} style={{ backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`}}>
      <FloatingUI removeDisabled={!items.length} onRemoveItems={handleRemoveItems} onRemoveAll={handleRemoveAll} onUndoRemoveAll={handleUndoRemoveAll} />
      {items.map((item) => <Item key={item.id} {...item} onClick={handleClick} onMove={handleMove} onResize={handleResize} />)}
    </section>
  )
}