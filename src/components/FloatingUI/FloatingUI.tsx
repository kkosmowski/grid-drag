import styles from './FloatingUI.module.css';
import { RemoveAllModal } from './components/RemovalAllModal.tsx';
import { useRef, useState } from 'react';

type FloatingUIProps = {
  removeAllDisabled: boolean;
  onRemoveAll: VoidFunction;
  onUndoRemoveAll: VoidFunction;
}

const SECOND = 1000;
const REMOVE_ALL_UNDO_TIMEOUT_MS = 5 * SECOND;


export const FloatingUI = ({ removeAllDisabled, onRemoveAll, onUndoRemoveAll }: FloatingUIProps) => {
  const [isRemoveAllModalOpen, setIsRemoveAllModalOpen] = useState(false);
  const [wasRemoveAllJustDone, setWasRemoveAllJustDone] = useState(false);
  const [undoTimeLeft, setUndoTimeLeft] = useState(REMOVE_ALL_UNDO_TIMEOUT_MS / SECOND);
  const removeAllUndoTimeout = useRef<number | null>(null);
  const removeAllUndoInterval = useRef<number | null>(null);

  const tryRemoveAll = () => {
    setIsRemoveAllModalOpen(true);
  }

  const handleCancel = () => {
    setIsRemoveAllModalOpen(false);
  }

  const handleConfirm = () => {
    onRemoveAll();
    setIsRemoveAllModalOpen(false);
    setWasRemoveAllJustDone(true);

    removeAllUndoTimeout.current = setTimeout(() => {
      setWasRemoveAllJustDone(false);
    }, REMOVE_ALL_UNDO_TIMEOUT_MS);

    removeAllUndoInterval.current = setInterval(() => {
      setUndoTimeLeft((timeLeft) => timeLeft - 1);
    }, SECOND);
  }

  const undoRemoveAll = () => {
    setWasRemoveAllJustDone(false);
    onUndoRemoveAll();
  }

  return (
    <header className={styles.header}>
      {wasRemoveAllJustDone ? (
        <button className="small" onClick={() => undoRemoveAll()}>Undo ({undoTimeLeft})</button>
      ) : (
      <button disabled={removeAllDisabled} className="small" onClick={tryRemoveAll}>
        Remove all
      </button>
      )}

      <RemoveAllModal open={isRemoveAllModalOpen} onCancel={handleCancel} onConfirm={handleConfirm} />
    </header>
  )
}