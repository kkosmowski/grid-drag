import { ComponentProps, ReactNode, useEffect, useRef } from 'react';
import { MENU_ITEM_HEIGHT, MENU_WIDTH, zIndex } from '~/consts';
import styles from './Menu.module.css';
import { Backdrop } from '~/components/Backdrop';
import { MenuItem } from '~/types/ui';
import { Position } from '~/types/item';
import { IconButton, IconButtonProps } from '~/components/IconButton';
import { Button } from '~/components/Button';
import { setStyle } from '~/utils/set-style';

type MenuProps = ComponentProps<'menu'> & {
  open?: boolean;
  options: MenuItem[];
  openAt: 'button' | 'position';
  button?: {
    iconName?: IconButtonProps['name'];
    content?: ReactNode;
  };
  position?: Position;
  onOpen?: VoidFunction;
  onClose?: VoidFunction;
};

export const Menu = ({ open, options, openAt, button, position, onOpen, onClose, style, ...menuProps }: MenuProps) => {
  if (openAt === 'button' && !button) {
    console.error("Menu: openAt 'button' but no `button` provided.");
  } else if (openAt === 'position' && !position) {
    console.error("Menu: openAt 'position' but no `position` provided.");
  }

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLButtonElement | null>(null);

  const finalStyle = {
    ...style,
    zIndex: zIndex.popover,
    width: MENU_WIDTH,
    '--menu-item-height': `${MENU_ITEM_HEIGHT}px`,
  };

  const btn = button ? (
    button.iconName ? (
      <IconButton ref={buttonRef} type="button" name={button.iconName} onClick={() => onOpen?.()} />
    ) : (
      <Button ref={buttonRef} type="button" onClick={() => onOpen?.()}>
        {button?.content ?? 'Open menu'}
      </Button>
    )
  ) : null;

  useEffect(() => {
    if (open) {
      const { x, y } = position ?? {
        x: buttonRef.current?.getBoundingClientRect().x ?? 0,
        y: buttonRef.current?.getBoundingClientRect().y ?? 0,
      };

      setStyle(menuRef, 'left', `${x}px`);
      setStyle(menuRef, 'top', `${y}px`);
    }
  }, [open, position]);

  return (
    <>
      {btn}
      {open && (
        <>
          <menu ref={menuRef} className={styles.menu} style={finalStyle} {...menuProps}>
            {options.map((menuItem) => (
              <li key={menuItem.id} className={styles.menuItem} onClick={menuItem.onClick}>
                {menuItem.label}
              </li>
            ))}
          </menu>
          <Backdrop onClose={() => onClose?.()} />
        </>
      )}
    </>
  );
};
