import type { MaterialIcon } from 'material-icons';
import type { Color, Size } from '~/types/ui';

export type IconVariant = 'filled' | 'outlined';

export type IconProps = {
  name: MaterialIcon;
  variant?: IconVariant;
  size?: Size;
  color?: Color;
}

const variants: Record<IconVariant, string> = {
  filled: 'icon material-icons',
  outlined: 'icon material-icons-outlined',
};

export const Icon = ({ name, variant = 'outlined', size = 'md', color = 'regular' }: IconProps) => (
  <span className={`${variants[variant]} ${size} ${color}`}>{name}</span>
)