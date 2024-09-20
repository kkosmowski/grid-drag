import type { UIEvent } from 'react';

export const stopPropagation = (e: UIEvent) => {
  e.stopPropagation();
};
