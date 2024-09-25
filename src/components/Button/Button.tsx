import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react';
import { forwardRef } from 'react';

import type { Color, Size } from '~/types/ui';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  color?: Color;
  size?: Size;
};

export const Button = forwardRef(function Button(
  { size = 'md', color = 'regular', children, className, ...buttonProps }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
): ReactNode {
  return (
    <button ref={ref} className={`${color} ${size} ${className}`} {...buttonProps}>
      {children}
    </button>
  );
});
