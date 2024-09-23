import { MenuData, MenuItem } from '~/types/ui';
import { Rectangle } from '~/types/item';
import { MENU_ITEM_HEIGHT, MENU_WIDTH, zIndex } from '~/consts';

import styles from './ContextMenu.module.css';
import { Backdrop } from '~/components/Backdrop';

type ContextMenuProps = {
  data: MenuData;
  options: MenuItem[];
  activeItem: Rectangle['id'];
  onClose: VoidFunction;
};

const getTransform = (data: MenuData) => {
  const translateX = data.transformX === 'left' ? 0 : '-100%';
  const translateY = data.transformY === 'bottom' ? 0 : '-100%';

  return `translate(${translateX}, ${translateY})`;
};

export const ContextMenu = ({ options, data, activeItem, onClose }: ContextMenuProps) => {
  const style = {
    zIndex: zIndex.popover,
    top: data.y,
    left: data.x,
    transform: getTransform(data),
    width: MENU_WIDTH,
    '--menu-item-height': `${MENU_ITEM_HEIGHT}px`,
  };

  return (
    <>
      <menu className={styles.contextMenu} style={style}>
        {options.map((menuItem) => (
          <li
            key={menuItem.id}
            onClick={(e) => {
              menuItem.onClick?.(e, activeItem);
              onClose();
            }}
          >
            {menuItem.label}
          </li>
        ))}
      </menu>
      <Backdrop onClose={onClose} />
    </>
  );
};
