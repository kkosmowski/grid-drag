import { MutableRefObject } from 'react';

export const setStyle = (ref: MutableRefObject<HTMLElement | null>, property: string, value: string | number) => {
  if (ref.current) {
    ref.current!.style[property] = value;
  }
};
