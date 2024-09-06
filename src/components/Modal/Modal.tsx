import { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './Modal.module.css';

type ModalProps = {
  open: boolean;
  children: ReactNode;
  onClose?: VoidFunction;
}

export const Modal = ({ open, children, onClose }: ModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <>
      <div className={`${styles.backdrop} ${onClose ? styles.closable : ''}`} onClick={() => onClose?.()} />
      <aside className={styles.modal}>
        {children}
      </aside>
    </>
  );
};

const ModalTitle = ({ children }: { children: string }) => {
  return <h2 className={styles.modalTitle}>{ children }</h2>;
};

const ModalFooter = ({ children }: { children: ReactNode[] }) => {
  return <footer className={styles.modalFooter}>{ children }</footer>;
};

const ModalButton = ({ primary, children, ...props }: { primary?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const className = `${styles.modalButton}${primary ? ' primary' : ''}`;
  return <button type="button" className={className} {...props}>{ children }</button>;
};

Modal.Title = ModalTitle;
Modal.Footer = ModalFooter;
Modal.Button = ModalButton;