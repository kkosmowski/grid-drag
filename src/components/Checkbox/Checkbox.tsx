import styles from './Checkbox.module.css';

import { buildClassName } from '~/utils/build-class-name';

type CheckboxProps = {
  checked: boolean;
  size?: 'sm' | 'md' | 'lg';
  onChange: (checked: boolean) => void;
};

export const Checkbox = ({ checked, size = 'md', onChange }: CheckboxProps) => {
  const clN = buildClassName(styles.checkbox, size);

  return <input className={clN} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />;
};
