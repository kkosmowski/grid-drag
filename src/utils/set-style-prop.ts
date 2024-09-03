import { MutableRefObject } from 'react';

export const setStyleProp = (ref: MutableRefObject<HTMLDivElement | null>, property: string, value: string) => {
  if (ref.current) {
    ref.current!.style.setProperty(property, value);
  }
}