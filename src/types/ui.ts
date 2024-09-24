import { type Position, Rectangle } from '~/types/item';
import { MouseEvent, ReactNode } from 'react';

export type RemoveProps = {
  items: Rectangle['id'][];
  isOn: boolean;
  isSelected: (id: Rectangle['id']) => boolean;
  select: (id: Rectangle['id']) => void;
  onToggle: VoidFunction;
  onAfterRemove: VoidFunction;
};

export type Color = 'regular' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type MenuData = Position & {
  transformX: 'left' | 'right';
  transformY: 'top' | 'bottom';
};

export type MenuItem = {
  id: string;
  label: ReactNode;
  onClick?: (event: MouseEvent) => void;
};
