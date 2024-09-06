import { useRef, useState } from 'react';

import styles from './FloatingUI.module.css';
import { RemoveAllModal } from './components/RemovalAllModal';
import { useRemove } from '~/contexts/RemoveItemsContext';

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
        <>
          <button disabled={!remove.items.length} className="small" onClick={() => onRemoveItems()}>
            Remove {remove.items.length ? `(${remove.items.length})` : ''}
          </button>
          <button className="small" onClick={() => remove.onToggle()}>
            Cancel removal
          </button>
        </>
      ) : (
        <button disabled={removeDisabled} className="small" onClick={() => remove.onToggle()}>
          Remove items
        </button>
      )}

      {wasRemoveAllJustDone ? (
        <button className="small" onClick={() => undoRemoveAll()}>Undo ({undoTimeLeft})</button>
      ) : (
      <button disabled={removeDisabled || remove.isOn} className="small" onClick={tryRemoveAll}>
        Remove all
      </button>
      )}

      <RemoveAllModal open={isRemoveAllModalOpen} onCancel={handleCancel} onConfirm={handleConfirm} />
    </header>
  )
}