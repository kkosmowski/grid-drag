export type RemoveProps = {
  items: string[];
  isOn: boolean;
  isSelected: (id: string) => boolean;
  select: (id: string) => void;
  onToggle: VoidFunction;
  onAfterRemove: VoidFunction;
};
