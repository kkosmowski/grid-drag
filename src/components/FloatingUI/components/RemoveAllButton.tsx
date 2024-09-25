import { Button } from '~/components/Button';
import { IconButton } from '~/components/IconButton';
import { useRef, useState } from 'react';
import { RemoveAllModal } from '~/components/FloatingUI/components/RemovalAllModal';
import { RemoveProps } from '~/types/ui';

type RemoveAllButtonProps = {
  remove: RemoveProps;
  disabled: boolean;
  onRemoveAll: VoidFunction;
  onUndo: VoidFunction;
};

const SECOND = 1000;
const DEFAULT_UNDO_TIME_S = 5;
const REMOVE_ALL_UNDO_TIMEOUT_MS = DEFAULT_UNDO_TIME_S * SECOND;

export const RemoveAllButton = ({ remove, disabled, onRemoveAll, onUndo }: RemoveAllButtonProps) => {
  const [justRemovedAll, setJustRemovedAll] = useState(false);
  const [isRemoveAllModalOpen, setIsRemoveAllModalOpen] = useState(false);
  const [undoTimeLeft, setUndoTimeLeft] = useState(DEFAULT_UNDO_TIME_S);
  const removeAllUndoTimeout = useRef<number | null>(null);
  const removeAllUndoInterval = useRef<number | null>(null);

  const cleanupAfterRemoveAll = () => {
    clearTimeout(removeAllUndoTimeout.current!);
    removeAllUndoTimeout.current = null;
    clearInterval(removeAllUndoInterval.current!);
    removeAllUndoInterval.current = null;
    setUndoTimeLeft(DEFAULT_UNDO_TIME_S);
  };

  const tryRemoveAll = () => {
    setIsRemoveAllModalOpen(true);
  };

  const undoRemoveAll = () => {
    setJustRemovedAll(false);
    onUndo();
    cleanupAfterRemoveAll();
  };

  const handleCancel = () => {
    setIsRemoveAllModalOpen(false);
  };

  const handleConfirm = () => {
    onRemoveAll();
    setIsRemoveAllModalOpen(false);
    setJustRemovedAll(true);

    removeAllUndoTimeout.current = setTimeout(() => {
      setJustRemovedAll(false);
      cleanupAfterRemoveAll();
    }, REMOVE_ALL_UNDO_TIMEOUT_MS);

    removeAllUndoInterval.current = setInterval(() => {
      setUndoTimeLeft((timeLeft) => timeLeft - 1);
    }, SECOND);
  };

  return (
    <>
      {justRemovedAll ? (
        <Button onClick={() => undoRemoveAll()}>Undo ({undoTimeLeft})</Button>
      ) : (
        <IconButton
          name="delete_forever"
          variant="filled"
          disabled={disabled || remove.isOn}
          color="error"
          onClick={tryRemoveAll}
        />
      )}

      <RemoveAllModal open={isRemoveAllModalOpen} onCancel={handleCancel} onConfirm={handleConfirm} />
    </>
  );
};
