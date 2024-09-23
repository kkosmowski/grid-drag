import { MenuData, MenuItem } from '~/types/ui';
import { MENU_ITEM_HEIGHT, MENU_WIDTH, zIndex } from '~/consts';

import styles from './ContextMenu.module.css';
import { Backdrop } from '~/components/Backdrop';

type ContextMenuProps = {
  data: MenuData;
  options: MenuItem[];
  onClose: VoidFunction;
};

const getTransform = (data: MenuData) => {
  const translateX = data.transformX === 'left' ? 0 : '-100%';
  const translateY = data.transformY === 'bottom' ? 0 : '-100%';

  return `translate(${translateX}, ${translateY})`;
};

export const ContextMenu = ({ options, data, onClose }: ContextMenuProps) => {
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
          <li key={menuItem.id} onClick={menuItem.onClick}>
            {menuItem.label}
          </li>
        ))}
      </menu>
      <Backdrop onClose={onClose} />
    </>
  );
};
