import { Rectangle } from '~/types/item';

export const GRID_SIZE = 10;

export const EDGE_SIZE = 8;

export const MIN_SIZE = GRID_SIZE * 2;
export const MIN_ACCEPTABLE_SIZE_TO_CREATE = MIN_SIZE - 12;

export const HOLD_TIME_MS = 150;

export const MENU_WIDTH = 160;
export const MENU_MARGIN = 10; // additional spacing to avoid menu right next to window's edge
export const MENU_ITEM_HEIGHT = 32;

const maxZIndex = 100000;

export const zIndex = {
  item: (id: Rectangle['id']) => Math.min(id, maxZIndex),
  temporaryItem: maxZIndex - 101,
  draggedItem: maxZIndex - 100,
  ui: maxZIndex - 10,
  backdrop: maxZIndex - 1,
  popover: maxZIndex,
};
