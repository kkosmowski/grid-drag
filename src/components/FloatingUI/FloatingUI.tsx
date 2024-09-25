import { useRef } from 'react';

import styles from './FloatingUI.module.css';

import { useRemove } from '~/contexts/RemoveItemsContext';
import { useToast } from '~/hooks/use-toast';
import type { ToastData } from '~/contexts/Toaster';
import { stopPropagation } from '~/utils/stop-propagation';
import { zIndex } from '~/consts';
import { useSettings } from '~/hooks/use-settings';
import { Menu } from '~/components/Menu';
import { useToggle } from '~/hooks/use-toggle';
import { CreateButton } from '~/components/FloatingUI/components/CreateButton';
import { RemoveButton } from '~/components/FloatingUI/components/RemoveButton';
import { RemoveAllButton } from '~/components/FloatingUI/components/RemoveAllButton';

type FloatingUIProps = {
  isAddMode: boolean;
  removeDisabled: boolean;
  onRemoveItems: VoidFunction;
  onRemoveAll: VoidFunction;
  onUndoRemoveAll: VoidFunction;
  onToggleAddMode: VoidFunction;
};

export const FloatingUI = (props: FloatingUIProps) => {
  const { isAddMode, removeDisabled, onRemoveItems, onRemoveAll, onUndoRemoveAll, onToggleAddMode } = props;
  const [menuOpen, toggleMenu] = useToggle(false);
  const remove = useRemove();
  const { toast, hideToast } = useToast();
  const { options } = useSettings();
  const toastRef = useRef<ToastData['id'] | null>(null);

  const toggleAddingItems = () => {
    if (isAddMode) {
      toastRef.current = hideToast(toastRef.current!);
    } else {
      toastRef.current = toast('Click and drag anywhere to create items.', {
        persistent: true,
        preventClose: true,
      });
    }
    onToggleAddMode();
  };

  return (
    <header className={styles.header} style={{ zIndex: zIndex.ui }} onClick={stopPropagation}>
      <CreateButton isAddMode={isAddMode} onToggle={toggleAddingItems} />
      <RemoveButton remove={remove} disabled={removeDisabled} onRemove={onRemoveItems} />
      <RemoveAllButton remove={remove} disabled={removeDisabled} onRemoveAll={onRemoveAll} onUndo={onUndoRemoveAll} />

      <Menu
        open={menuOpen}
        openAt="button"
        button={{ iconName: 'settings' }}
        options={options}
        onOpen={toggleMenu}
        onClose={toggleMenu}
      />
    </header>
  );
};
