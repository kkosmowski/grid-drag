import { RemoveProps } from '~/types/ui';
import { Row } from '~/components/Row';
import { IconButton } from '~/components/IconButton';

type RemoveButtonProps = {
  remove: RemoveProps;
  disabled: boolean;
  onRemove: VoidFunction;
};

export const RemoveButton = ({ remove, disabled, onRemove }: RemoveButtonProps) => {
  return remove.isOn ? (
    <Row gap={4}>
      <IconButton name="delete_sweep" color="error" disabled={!remove.items.length} onClick={() => onRemove()} />
      <IconButton name="cancel" onClick={() => remove.onToggle()} />
    </Row>
  ) : (
    <IconButton name="delete" disabled={disabled} onClick={() => remove.onToggle()} />
  );
};
