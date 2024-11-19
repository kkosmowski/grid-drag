import { useCallback, useRef } from 'react';

type UseNextNumberOptions = {
  initial?: number;
  min?: number;
  max?: number;
  reversed?: boolean;
};

type UseNextNumberReturnValue = [() => number, number];

const defaultOptions = { initial: undefined, min: 0, max: Infinity, reversed: false };

const getInitialNumber = (initial?: number, reversed?: boolean): number => {
  if (!initial) return 0;
  return reversed ? initial - 1 : initial + 1;
};

export const useNextNumber = ({
  initial,
  min,
  max,
  reversed,
}: UseNextNumberOptions = defaultOptions): UseNextNumberReturnValue => {
  const numPool = useRef(getInitialNumber(initial, reversed));

  const getSmallerNumber = useCallback(() => {
    if (numPool.current !== min) {
      return numPool.current--;
    } else {
      console.error('useNextNumber: min number reached.');
      return numPool.current;
    }
  }, [min]);

  const getGreaterNumber = useCallback(() => {
    if (numPool.current !== max) {
      return numPool.current++;
    } else {
      console.error('useNextNumber: max number reached.');
      return numPool.current;
    }
  }, [max]);

  return [reversed ? getSmallerNumber : getGreaterNumber, reversed ? numPool.current + 1 : numPool.current - 1];
};
