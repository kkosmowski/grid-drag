import { Button, ButtonProps } from '../Button';
import { Icon, IconProps } from '~/components/Icon';

export type IconButtonProps = Omit<ButtonProps, 'children'> & {
  name: IconProps['name'];
  variant?: IconProps['variant'];
};

export const IconButton = ({ name, variant, ...buttonProps }: IconButtonProps) => {
  return (
    <Button className="icon-button" {...buttonProps}>
      <Icon name={name} variant={variant} />
    </Button>
  );
}
