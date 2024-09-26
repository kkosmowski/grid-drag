import { IconButton } from '~/components/IconButton';

type CreateButtonProps = {
  isAddMode: boolean;
  disabled: boolean;
  onToggle: VoidFunction;
};

export const CreateButton = ({ isAddMode, disabled, onToggle }: CreateButtonProps) => (
  <IconButton name={isAddMode ? 'cancel' : 'add'} disabled={disabled} color="primary" onClick={() => onToggle()} />
);
