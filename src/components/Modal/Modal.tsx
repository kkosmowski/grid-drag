import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './Modal.module.css';

import { Backdrop } from '~/components/Backdrop';
import { zIndex } from '~/consts';
import { stopPropagation } from '~/utils/stop-propagation';

type ModalProps = {
  open: boolean;
  children: ReactNode;
  onClose?: VoidFunction;
};

export const Modal = ({ open, children, onClose }: ModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <>
      <Backdrop onClose={onClose} />
      <aside className={styles.modal} style={{ zIndex: zIndex.popover }} onContextMenu={stopPropagation}>
        {children}
      </aside>
    </>
  );
};

const ModalTitle = ({ children }: { children: string }) => {
  return <h2 className={styles.modalTitle}>{children}</h2>;
};

const ModalFooter = ({ children }: { children: ReactNode[] }) => {
  return <footer className={styles.modalFooter}>{children}</footer>;
};

const ModalButton = ({
  primary,
  children,
  ...props
}: { primary?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const className = `${styles.modalButton}${primary ? ' primary' : ''}`;

  return (
    <button type="button" className={className} {...props}>
      {children}
    </button>
  );
};

Modal.Title = ModalTitle;
Modal.Footer = ModalFooter;
Modal.Button = ModalButton;
