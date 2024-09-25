import { Menu } from '../Menu';

import type { MenuData, MenuItem } from '~/types/ui';

type ContextMenuProps = {
  data: MenuData;
  options: MenuItem[];
  onClose: VoidFunction;
};

const getTransform = (data: MenuData) => {
  const translateX = data.transformX === 'left' ? 0 : '-100%';
  const translateY = data.transformY === 'bottom' ? 0 : '-100%';

  return `translate(${translateX}, ${translateY})`;
};

export const ContextMenu = ({ options, data, onClose }: ContextMenuProps) => {
  const style = {
    transform: getTransform(data),
  };

  return <Menu open={!!data} openAt="position" options={options} position={data} style={style} onClose={onClose} />;
};
