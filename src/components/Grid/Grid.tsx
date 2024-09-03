import  styles from './Grid.module.css';
import { Item } from '~/components/Item';
import { Position, Rectangle } from '~/types/item.ts';
import { useEffect, useState } from 'react';
import { normalizePosition } from '~/components/Grid/Grid.utils.ts';

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
    x: 240,
    y: 190,
    width: 70,
    height: 110,
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

  const handleMove = (id: string, position: Position) => {
    console.log(id, position);
    const normalized = normalizePosition(position);
    setItems((current) => current.map((item) => item.id === id ? ({ ...item, ...normalized }) : item));
  }

  return (
    <section className={styles.grid}>
      {items.map((item) => <Item key={item.id} {...item} onMove={handleMove} />)}
    </section>
  )
}