import type { CSSProperties, JSX, ReactNode } from 'react';

import type { AlignItems, JustifyContent } from '~/types/flex';

export type RowProps = {
  component?: keyof JSX.IntrinsicElements;
  inline?: boolean;
  reverse?: boolean;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  gap?: string | number;
  style?: CSSProperties;
  children: ReactNode;
};
