import { MutableRefObject } from 'react';

export const setStyle = (ref: MutableRefObject<HTMLDivElement | null>, property: string, value: string | number) => {
  if (ref.current) {
    ref.current!.style[property] = value;
  }
};
