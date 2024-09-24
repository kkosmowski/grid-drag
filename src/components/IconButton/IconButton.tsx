import { Button, ButtonProps } from '../Button';
import { Icon, IconProps } from '~/components/Icon';
import { ForwardedRef, forwardRef } from 'react';

export type IconButtonProps = Omit<ButtonProps, 'children'> & {
  name: IconProps['name'];
  variant?: IconProps['variant'];
};

export const IconButton = forwardRef(
  ({ name, variant, ...buttonProps }: IconButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
    return (
      <Button ref={ref} className="icon-button" {...buttonProps}>
        <Icon name={name} variant={variant} />
      </Button>
    );
  },
);
