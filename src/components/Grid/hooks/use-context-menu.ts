import type { Rectangle } from '~/types/item';
import { useCallback, useEffect, useState } from 'react';

type UseContextMenuReturnValue = {
  activeItem: Rectangle['id'] | null;
  closeMenu: VoidFunction;
};

const wasItemClicked = (item: Rectangle, { clientX, clientY }: Pick<MouseEvent, 'clientX' | 'clientY'>) => {
  const isInsideHorizontally = clientX >= item.x && clientX <= item.x + item.width;
  const isInsideVertically = clientY >= item.y && clientY <= item.y + item.height;

  return isInsideHorizontally && isInsideVertically;
};

export const useContextMenu = (items: Rectangle[]): UseContextMenuReturnValue => {
  const [activeItem, setActiveItem] = useState<UseContextMenuReturnValue['activeItem']>(null);

  const tryToOpenMenu = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      const { button, clientX, clientY } = e;

      if (button !== 2) return; // handle RMB only

      const clickedItems = items.filter((item) => wasItemClicked(item, { clientX, clientY }));

      if (clickedItems.length > 1) {
        // more than 1 item: highest zIndex is always the last in the event propagation order
        setActiveItem(clickedItems[clickedItems.length - 1].id);
      } else if (clickedItems.length === 1) {
        setActiveItem(clickedItems[0].id);
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

  return { activeItem, closeMenu };
};
