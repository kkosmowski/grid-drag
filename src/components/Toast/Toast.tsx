import styles from './Toast.module.css';
import { ToastData } from '~/contexts/Toaster';
import { useEffect, useState } from 'react';

export type ToastProps = Pick<ToastData, 'content' | 'hiding'>;

export const Toast = ({ content, hiding }: ToastProps) => {
  const [className, setClassName] = useState(styles.toast);

  useEffect(() => {
    setClassName((cl) => `${cl} visible`);
  }, []);

  useEffect(() => {
    if (hiding) {
      setClassName(styles.toast);
    }
  }, [hiding]);

  return (
    <article className={className}>{content}</article>
  )
}