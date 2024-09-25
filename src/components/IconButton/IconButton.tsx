import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';

import type { ButtonProps } from '../Button';
import { Button } from '../Button';

import type { IconProps } from '~/components/Icon';
import { Icon } from '~/components/Icon';

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
