import { useCallback, useRef } from 'react';

export const useId = (initial: number) => {
  const idPool = useRef(initial + 1 ?? 0);

  const getId = useCallback(() => idPool.current++, []);

  return { getId };
};
