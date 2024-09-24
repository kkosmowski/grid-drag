import { ButtonHTMLAttributes, ForwardedRef, forwardRef, ReactNode } from 'react';
import { Color, Size } from '~/types/ui';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  color?: Color;
  size?: Size;
};

export const Button = forwardRef(
  (
    { size = 'md', color = 'regular', children, className, ...buttonProps }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    return (
      <button ref={ref} className={`${color} ${size} ${className}`} {...buttonProps}>
        {children}
      </button>
    );
  },
);
