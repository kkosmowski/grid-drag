import { useRef, useState } from 'react';

import styles from './FloatingUI.module.css';
import { RemoveAllModal } from './components/RemovalAllModal';
import { useRemove } from '~/contexts/RemoveItemsContext';
import { Button } from '~/components/Button';
import { IconButton } from '~/components/IconButton';
import { Row } from '~/components/Row';
import { useToast } from '~/hooks/use-toast';
import { ToastData } from '~/contexts/Toaster';
import { stopPropagation } from '~/utils/stop-propagation';

type FloatingUIProps = {
  isAddMode: boolean;
  removeDisabled: boolean;
  onRemoveItems: VoidFunction;
  onRemoveAll: VoidFunction;
  onUndoRemoveAll: VoidFunction;
  onEnableAddMode: VoidFunction;
  onDisableAddMode: VoidFunction;
};

const SECOND = 1000;
const DEFAULT_UNDO_TIME_S = 5;
const REMOVE_ALL_UNDO_TIMEOUT_MS = DEFAULT_UNDO_TIME_S * SECOND;

export const FloatingUI = (props: FloatingUIProps) => {
  const { isAddMode, removeDisabled, onRemoveItems, onRemoveAll, onUndoRemoveAll, onEnableAddMode, onDisableAddMode } =
    props;
  const [isRemoveAllModalOpen, setIsRemoveAllModalOpen] = useState(false);
  const [wasRemoveAllJustDone, setWasRemoveAllJustDone] = useState(false);
  const [undoTimeLeft, setUndoTimeLeft] = useState(DEFAULT_UNDO_TIME_S);
  const removeAllUndoTimeout = useRef<number | null>(null);
  const removeAllUndoInterval = useRef<number | null>(null);
  const remove = useRemove();
  const { toast, hideToast } = useToast();
  const toastRef = useRef<ToastData['id'] | null>(null);

  const tryRemoveAll = () => {
    setIsRemoveAllModalOpen(true);
  };

  const handleCancel = () => {
    setIsRemoveAllModalOpen(false);
  };

  const cleanupAfterRemoveAll = () => {
    clearTimeout(removeAllUndoTimeout.current!);
    removeAllUndoTimeout.current = null;
    clearInterval(removeAllUndoInterval.current!);
    removeAllUndoInterval.current = null;
    setUndoTimeLeft(DEFAULT_UNDO_TIME_S);
  };

  const handleConfirm = () => {
    onRemoveAll();
    setIsRemoveAllModalOpen(false);
    setWasRemoveAllJustDone(true);

    removeAllUndoTimeout.current = setTimeout(() => {
      setWasRemoveAllJustDone(false);
      cleanupAfterRemoveAll();
    }, REMOVE_ALL_UNDO_TIMEOUT_MS);

    removeAllUndoInterval.current = setInterval(() => {
      setUndoTimeLeft((timeLeft) => timeLeft - 1);
    }, SECOND);
  };

  const undoRemoveAll = () => {
    setWasRemoveAllJustDone(false);
    onUndoRemoveAll();
    cleanupAfterRemoveAll();
  };

  const handleAddingItems = () => {
    if (isAddMode) {
      toastRef.current = hideToast(toastRef.current!);
      onDisableAddMode();
    } else {
      toastRef.current = toast('Click and drag anywhere to create items.', { persistent: true, preventClose: true });
      onEnableAddMode();
    }
  };

  return (
    <header className={styles.header} onClick={stopPropagation}>
      <IconButton name={isAddMode ? 'cancel' : 'add'} color="primary" onClick={() => handleAddingItems()} />

      {remove.isOn ? (
        <Row gap={4}>
          <IconButton
            name="delete_sweep"
            color="error"
            disabled={!remove.items.length}
            onClick={() => onRemoveItems()}
          />
          <IconButton name="cancel" onClick={() => remove.onToggle()} />
        </Row>
      ) : (
        <IconButton name="delete" disabled={removeDisabled} onClick={() => remove.onToggle()} />
      )}

      {wasRemoveAllJustDone ? (
        <Button onClick={() => undoRemoveAll()}>Undo ({undoTimeLeft})</Button>
      ) : (
        <IconButton
          name="delete_forever"
          variant="filled"
          disabled={removeDisabled || remove.isOn}
          color="error"
          onClick={tryRemoveAll}
        />
      )}

      <RemoveAllModal open={isRemoveAllModalOpen} onCancel={handleCancel} onConfirm={handleConfirm} />
    </header>
  );
};
