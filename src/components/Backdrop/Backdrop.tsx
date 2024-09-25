import styles from './Backdrop.module.css';

import { zIndex } from '~/consts';
import { stopPropagation } from '~/utils/stop-propagation';

export type BackdropProps = {
  onClose?: () => void;
};

export const Backdrop = ({ onClose }: BackdropProps) => (
  <div
    className={`${styles.backdrop} ${onClose ? styles.closable : ''}`}
    style={{ zIndex: zIndex.backdrop }}
    onClick={() => onClose?.()}
    onContextMenu={stopPropagation}
  />
);
