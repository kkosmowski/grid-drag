import type { MutableRefObject } from 'react';

import { setStyle } from '~/utils/set-style';

export const setStyles = (ref: MutableRefObject<HTMLDivElement | null>, styles: Record<string, string | number>) => {
  if (ref.current) {
    for (const [property, value] of Object.entries(styles)) {
      setStyle(ref, property, value);
    }
  }
};
