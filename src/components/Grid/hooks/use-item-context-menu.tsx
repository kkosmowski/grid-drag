import type { Rectangle } from '~/types/item';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MENU_ITEM_HEIGHT, MENU_MARGIN, MENU_WIDTH } from '~/consts';
import { MenuData, MenuItem } from '~/types/ui';
import { getItem } from '~/utils/get-item';
import { ColorPicker } from '~/components/ColorPicker/ColorPicker';
import { isDefined } from '~/utils/is-defined';

type UseItemContextMenuReturnArgs = {
  items: Rectangle[];
  onLayerChange: (itemId: Rectangle['id'], where: -1 | 1) => void;
  onColorChange: (itemId: Rectangle['id'], color: string) => void;
};

type UseItemContextMenuReturnValue = {
  activeItem: Rectangle['id'] | null;
  menuData: MenuData | null;
  options: MenuItem[];
  closeMenu: VoidFunction;
};

const wasItemClicked = (item: Rectangle, { clientX, clientY }: Pick<MouseEvent, 'clientX' | 'clientY'>) => {
  const isInsideHorizontally = clientX >= item.x && clientX <= item.x + item.width;
  const isInsideVertically = clientY >= item.y && clientY <= item.y + item.height;

  return isInsideHorizontally && isInsideVertically;
};

const getMenuData = ({ clientX, clientY }: MouseEvent, optionsCount: number): MenuData => {
  const xLimit = window.innerWidth - (MENU_WIDTH + MENU_MARGIN);
  const yLimit = window.innerHeight - (optionsCount * MENU_ITEM_HEIGHT + MENU_MARGIN);

  const transformX = clientX > xLimit ? 'right' : 'left';
  const transformY = clientY > yLimit ? 'top' : 'bottom';

  return { x: clientX, y: clientY, transformX, transformY };
};

export const useItemContextMenu = (args: UseItemContextMenuReturnArgs): UseItemContextMenuReturnValue => {
  const { items, onLayerChange, onColorChange } = args;
  const [activeItem, setActiveItem] = useState<UseItemContextMenuReturnValue['activeItem']>(null);
  const [menuData, setMenuData] = useState<UseItemContextMenuReturnValue['menuData']>(null);

  const moveItemToFront = useCallback(() => {
    if (!isDefined(activeItem)) {
      console.error('moveItemToFront: function called, but activeItem is null.');
      return;
    }

    onLayerChange(activeItem, 1);
    closeMenu();
  }, [activeItem, items, onLayerChange]);

  const moveItemToBack = useCallback(() => {
    if (!isDefined(activeItem)) {
      console.error('moveItemToBack: function called, but activeItem is null.');
      return;
    }

    onLayerChange(activeItem, -1);
    closeMenu();
  }, [activeItem, onLayerChange]);

  const changeItemColor = useCallback(
    (color: string) => {
      if (!isDefined(activeItem)) {
        console.error('changeItemColor: function called, but activeItem is null.');
        return;
      }

      onColorChange(activeItem, color);
      closeMenu();
    },
    [activeItem, onColorChange],
  );

  const options: MenuItem[] = useMemo(() => {
    return [
      { id: 'item-to-top', label: <>Move to front &#x2191;</>, onClick: moveItemToFront },
      { id: 'item-to-bottom', label: <>Move to back &#x2193;</>, onClick: moveItemToBack },
      {
        id: 'item-change-color',
        label: (
          <>
            Set color <ColorPicker initialValue={getItem(items, activeItem)?.color ?? ''} onBlur={changeItemColor} />
          </>
        ),
      },
    ];
  }, [activeItem, items, moveItemToFront, moveItemToBack, changeItemColor]);

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
    setMenuData(null);
  }, [setActiveItem, setMenuData]);

  useEffect(() => {
    window.addEventListener('contextmenu', tryToOpenMenu);

    return () => {
      window.removeEventListener('contextmenu', tryToOpenMenu);
    };
  }, [items]);

  return { activeItem, menuData, options, closeMenu };
};
