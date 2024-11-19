export const GRID_SIZE = 10;

export const EDGE_SIZE = 8;

export const MIN_SIZE = GRID_SIZE * 2;
export const MIN_ACCEPTABLE_SIZE_TO_CREATE = MIN_SIZE - 12;

export const BOARD_PADDING = 10;

export const HOLD_TIME_MS = 150;

export const MENU_WIDTH = 160;
export const MENU_MARGIN = 10; // additional spacing to avoid menu right next to window's edge
export const MENU_ITEM_HEIGHT = 32;

export const ITEM_LEVEL_HEADSTART = 40000;

export const MAX_ITEM_Z_INDEX = 100000;

export const Z_INDEX = {
  temporaryItem: MAX_ITEM_Z_INDEX + 10,
  draggedItem: MAX_ITEM_Z_INDEX + 11,
  createOverlay: MAX_ITEM_Z_INDEX + 100,
  ui: MAX_ITEM_Z_INDEX + 1000,
  backdrop: MAX_ITEM_Z_INDEX + 1100,
  popover: MAX_ITEM_Z_INDEX + 1200,
};
