import styles from './Backdrop.module.css';

import { Z_INDEX } from '~/consts';
import { stopPropagation } from '~/utils/stop-propagation';

export type BackdropProps = {
  onClose?: () => void;
};

export const Backdrop = ({ onClose }: BackdropProps) => (
  <div
    className={`${styles.backdrop} ${onClose ? styles.closable : ''}`}
    style={{ zIndex: Z_INDEX.backdrop }}
    onClick={() => onClose?.()}
    onContextMenu={stopPropagation}
  />
);
