import { useEffect, useState } from 'react';

import styles from './Toast.module.css';

import type { ToastData } from '~/contexts/Toaster';
import { useToast } from '~/hooks/use-toast';
import { IconButton } from '~/components/IconButton';

export type ToastProps = Pick<ToastData, 'id' | 'content' | 'closable' | 'hiding'>;

export const Toast = ({ id, content, closable, hiding }: ToastProps) => {
  const [className, setClassName] = useState(styles.toast);
  const { hideToast } = useToast();

  useEffect(() => {
    setClassName((cl) => `${cl} visible`);
  }, []);

  useEffect(() => {
    if (hiding) {
      setClassName(styles.toast);
    }
  }, [hiding]);

  return (
    <article className={className}>
      {content}
      {closable && <IconButton name="close" size="sm" onClick={() => hideToast(id)} />}
    </article>
  );
};
