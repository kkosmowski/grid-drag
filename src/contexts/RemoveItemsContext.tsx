import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { RemoveProps } from '~/types/ui';
import { Rectangle } from '~/types/item';

export const RemoveItemsContext = createContext<RemoveProps>({
  items: [],
  isOn: false,
  isSelected: () => false,
  select: () => {},
  onToggle: () => {},
  onAfterRemove: () => {},
});

export const RemoveItemsContextController = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Rectangle['id'][]>([]);
  const [isOn, setIsOn] = useState(false);

  const handleToggle = useCallback(() => {
    setItems([]);
    setIsOn((on) => !on);
  }, [setIsOn]);

  const select = useCallback(
    (id: Rectangle['id']) => {
      setItems((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));
    },
    [setIsOn],
  );

  const value: RemoveProps = {
    items,
    isOn,
    isSelected: (id: Rectangle['id']) => items.includes(id),
    select,
    onToggle: handleToggle,
    onAfterRemove: () => setItems([]),
  };

  return <RemoveItemsContext.Provider value={value}>{children}</RemoveItemsContext.Provider>;
};

export const useRemove = () => useContext(RemoveItemsContext);
