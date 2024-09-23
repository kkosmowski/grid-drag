import type { Rectangle } from '~/types/item';
import { useCallback, useEffect, useState } from 'react';
import { MENU_MARGIN, MENU_WIDTH } from '~/consts';
import { MenuData, MenuItem } from '~/types/ui';

type UseContextMenuReturnValue = {
  activeItem: Rectangle['id'] | null;
  menuData: MenuData | null;
  closeMenu: VoidFunction;
};

const wasItemClicked = (item: Rectangle, { clientX, clientY }: Pick<MouseEvent, 'clientX' | 'clientY'>) => {
  const isInsideHorizontally = clientX >= item.x && clientX <= item.x + item.width;
  const isInsideVertically = clientY >= item.y && clientY <= item.y + item.height;

  return isInsideHorizontally && isInsideVertically;
};

const getMenuData = ({ clientX, clientY }: MouseEvent, optionsCount: number): MenuData => {
  const xLimit = window.innerWidth - (MENU_WIDTH + MENU_MARGIN);
  const yLimit = window.innerHeight - (optionsCount * MENU_WIDTH + MENU_MARGIN);

  const transformX = clientX > xLimit ? 'right' : 'left';
  const transformY = clientY > yLimit ? 'top' : 'bottom';

  return { x: clientX, y: clientY, transformX, transformY };
};

export const useContextMenu = (items: Rectangle[], options: MenuItem[]): UseContextMenuReturnValue => {
  const [activeItem, setActiveItem] = useState<UseContextMenuReturnValue['activeItem']>(null);
  const [menuData, setMenuData] = useState<UseContextMenuReturnValue['menuData']>(null);

  const openMenu = (e: MouseEvent, itemId: Rectangle['id']) => {
    setActiveItem(itemId);
    setMenuData(getMenuData(e, options.length));
  };

  const tryToOpenMenu = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      const { button, clientX, clientY } = e;

      if (button !== 2) return; // handle RMB only

      const clickedItems = items.filter((item) => wasItemClicked(item, { clientX, clientY }));

      if (clickedItems.length > 1) {
        // more than 1 item: highest zIndex is always the last in the event propagation order
        openMenu(e, clickedItems[clickedItems.length - 1].id);
      } else if (clickedItems.length === 1) {
        openMenu(e, clickedItems[0].id);
      }
    },
    [setActiveItem, items],
  );

  const closeMenu = useCallback(() => {
    setActiveItem(null);
  }, [setActiveItem]);

  useEffect(() => {
    window.addEventListener('contextmenu', tryToOpenMenu);

    return () => {
      window.removeEventListener('contextmenu', tryToOpenMenu);
    };
  }, [items]);

  return { activeItem, menuData, closeMenu };
};
