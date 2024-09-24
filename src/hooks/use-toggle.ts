import { useCallback, useState } from 'react';

export const useToggle = (initialValue = false): [boolean, VoidFunction, (value: boolean) => void] => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((val) => !val);
  }, []);

  return [value, toggle, setValue];
};
