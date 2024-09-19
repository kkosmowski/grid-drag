import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Color, Size } from '~/types/ui';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  color?: Color;
  size?: Size;
}

export const Button = ({ size, color = 'regular', children, className, ...buttonProps }: ButtonProps): ReactNode => {
  return (
    <button className={`${color} ${size} ${className}`} {...buttonProps}>{children}</button>
  );
}
