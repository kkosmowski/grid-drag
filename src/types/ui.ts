export type RemoveProps = {
  items: string[];
  isOn: boolean;
  isSelected: (id: string) => boolean;
  select: (id: string) => void;
  onToggle: VoidFunction;
  onAfterRemove: VoidFunction;
};

export type Color = 'regular' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';