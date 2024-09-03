import type { Cursor, ItemRef, Rectangle } from '~/types/item';

type UseMoveProps = {
  ref: ItemRef;
  item: Rectangle;
  cursor: Cursor | null;
}

export const useResize = ({ ref, item, cursor }: UseMoveProps) => {
  if (cursor === null) {
    return null;
  }

  return null;
}