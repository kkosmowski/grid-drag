import { MutableRefObject } from 'react';

export const setStyle = (ref: MutableRefObject<HTMLDivElement | null>, property: string, value: string) => {
  if (ref.current) {
    ref.current!.style[property] = value;
  }
}