import { IconButton } from '~/components/IconButton';

type CreateButtonProps = {
  isAddMode: boolean;
  onToggle: VoidFunction;
};

export const CreateButton = ({ isAddMode, onToggle }: CreateButtonProps) => (
  <IconButton name={isAddMode ? 'cancel' : 'add'} color="primary" onClick={() => onToggle()} />
);
