import { Rectangle } from '~/types/item';

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
