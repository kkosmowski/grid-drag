import { createContext, ReactNode, useCallback, useRef, useState } from 'react';
import { Toast } from '~/components/Toast';
import styles from './Toaster.module.css';

type ToasterContextState = {
  toast: (content: ReactNode, options?: ToastOptions) => ToastData['id'];
  hideToast: (id: ToastData['id']) => null;
};

export const ToasterContext = createContext<ToasterContextState>({
  toast: () => 0,
  hideToast: () => null,
});

type ToasterProps = {
  children: ReactNode;
};

export type ToastOptions = {
  duration?: number;
  persistent?: boolean;
  preventClose?: boolean;
};

export type ToastData = {
  id: number;
  content: ReactNode;
  persistent: boolean;
  closable: boolean;
  hiding: boolean;
};

const DEFAULT_DURATION = 4000;
const HIDING_DURATION = 200;

export const Toaster = ({ children }: ToasterProps) => {
  const [queue, setQueue] = useState<ToastData[]>([]);
  const idPool = useRef(0);

  const getId = () => idPool.current++;

  const hideToast = useCallback((id: ToastData['id']) => {
    setQueue((toasts) => toasts.map((toast) => (toast.id === id ? { ...toast, hiding: true } : toast)));

    setTimeout(() => {
      setQueue((toasts) => toasts.filter((toast) => toast.id !== id));
    }, HIDING_DURATION);

    return null;
  }, []);

  const toast = useCallback(
    (content: ReactNode, options?: ToastOptions) => {
      const id = getId();
      const duration = options?.duration ?? DEFAULT_DURATION;
      setQueue((toasts) => [
        ...toasts,
        { id, content, hiding: false, persistent: !!options?.persistent, closable: !options?.preventClose },
      ]);

      if (!options?.persistent) {
        setTimeout(() => {
          hideToast(id);
        }, duration - HIDING_DURATION);
      }

      return id;
    },
    [hideToast],
  );

  const value: ToasterContextState = { toast, hideToast };

  return (
    <ToasterContext.Provider value={value}>
      {children}

      <aside className={styles.toastContainer}>
        {queue.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </aside>
    </ToasterContext.Provider>
  );
};
