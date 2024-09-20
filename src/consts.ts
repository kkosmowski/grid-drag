import { Rectangle } from '~/types/item';

export const GRID_SIZE = 10;

export const EDGE_SIZE = 8;

export const MIN_SIZE = GRID_SIZE * 2;
export const MIN_ACCEPTABLE_SIZE_TO_CREATE = MIN_SIZE - 12;

export const HOLD_TIME_MS = 150;

const maxZIndex = 100000;

export const zIndex = {
  item: (id: Rectangle['id']) => Math.min(id, maxZIndex),
  temporaryItem: maxZIndex - 2,
  draggedItem: maxZIndex - 1,
  ui: maxZIndex,
};
