import { MutableRefObject } from 'react';

export const setStyleProp = (
  ref: MutableRefObject<HTMLDivElement | null>,
  property: string,
  value: string | number,
) => {
  if (ref.current) {
    ref.current!.style.setProperty(property, String(value));
  }
};
