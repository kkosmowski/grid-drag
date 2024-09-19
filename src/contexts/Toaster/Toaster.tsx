import { createContext, ReactNode, useCallback, useRef, useState } from 'react';
import { Toast } from '~/components/Toast';
import styles from './Toaster.module.css';

type ToasterContextState = {
  toast: (content: ReactNode) => ToastData['id'];
  hideToast: (id: ToastData['id']) => void;
}

export const ToasterContext = createContext<ToasterContextState>({
  toast: () => 0,
  hideToast: () => {},
});

type ToasterProps = {
  children: ReactNode;
}

export type ToastData = {
  id: number;
  content: ReactNode;
  hiding: boolean;
}

const DEFAULT_DURATION = 4000;

export const Toaster = ({ children }: ToasterProps) => {
  const [queue, setQueue] = useState<ToastData[]>([]);
  const idPool = useRef(0);

  const getId = () => idPool.current++;

  const hideToast = useCallback((id: ToastData['id']) => {
    setQueue((toasts) => toasts.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((content: ReactNode) => {
    const id = getId();
    setQueue((toasts) => [...toasts, { id, content, hiding: false }]);

    setTimeout(() => {
      setQueue((toasts) => toasts.map((toast) => toast.id === id ? ({ ...toast, hiding: true }) : toast));
    }, DEFAULT_DURATION - 200);

    setTimeout(() => {
      hideToast(id);
    }, DEFAULT_DURATION);

    return id;
  }, [hideToast]);

  const value: ToasterContextState = { toast, hideToast };

  return (
    <ToasterContext.Provider value={value}>
      {children}

      <aside className={styles.toastContainer}>
        {queue.map((toast) => (
          <Toast key={toast.id} content={toast.content} hiding={toast.hiding} />
        ))}
      </aside>
    </ToasterContext.Provider>
  )
};
