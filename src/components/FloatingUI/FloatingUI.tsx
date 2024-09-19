import { useRef, useState } from 'react';

import styles from './FloatingUI.module.css';
import { RemoveAllModal } from './components/RemovalAllModal';
import { useRemove } from '~/contexts/RemoveItemsContext';
import { Button } from '~/components/Button';
import { IconButton } from '~/components/IconButton';
import { Row } from '~/components/Row';

type FloatingUIProps = {
  removeDisabled: boolean;
  onRemoveItems: VoidFunction;
  onRemoveAll: VoidFunction;
  onUndoRemoveAll: VoidFunction;
}

const SECOND = 1000;
const DEFAULT_UNDO_TIME_S = 5;
const REMOVE_ALL_UNDO_TIMEOUT_MS = DEFAULT_UNDO_TIME_S * SECOND;

export const FloatingUI = ({ removeDisabled, onRemoveItems, onRemoveAll, onUndoRemoveAll }: FloatingUIProps) => {
  const [isRemoveAllModalOpen, setIsRemoveAllModalOpen] = useState(false);
  const [wasRemoveAllJustDone, setWasRemoveAllJustDone] = useState(false);
  const [undoTimeLeft, setUndoTimeLeft] = useState(DEFAULT_UNDO_TIME_S);
  const removeAllUndoTimeout = useRef<number | null>(null);
  const removeAllUndoInterval = useRef<number | null>(null);
  const remove = useRemove();

  const tryRemoveAll = () => {
    setIsRemoveAllModalOpen(true);
  }

  const handleCancel = () => {
    setIsRemoveAllModalOpen(false);
  }

  const cleanupAfterRemoveAll = () => {
    clearTimeout(removeAllUndoTimeout.current!);
    removeAllUndoTimeout.current = null;
    clearInterval(removeAllUndoInterval.current!);
    removeAllUndoInterval.current = null;
    setUndoTimeLeft(DEFAULT_UNDO_TIME_S);
  }

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
  }

  const undoRemoveAll = () => {
    setWasRemoveAllJustDone(false);
    onUndoRemoveAll();
    cleanupAfterRemoveAll();
  }

  return (
    <header className={styles.header}>
      {remove.isOn ? (
        <Row>
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
  )
}