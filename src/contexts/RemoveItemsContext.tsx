import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { RemoveProps } from '~/types/ui.ts';

export const RemoveItemsContext = createContext<RemoveProps>({
  items: [],
  isOn: false,
  isSelected: () => false,
  select: () => {},
  onToggle: () => {},
  onAfterRemove: () => {},
});

export const RemoveItemsContextController = ({ children }: { children: ReactNode}) => {
  const [items, setItems] = useState<string[]>([]);
  const [isOn, setIsOn] = useState(false);

  const handleToggle = useCallback(() => {
    setItems([]);
    setIsOn((on) => !on);
  }, [setIsOn]);

  const select = useCallback((id: string) => {
    setItems((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
  }, [setIsOn]);

  const value: RemoveProps = {
    items,
    isOn,
    isSelected: (id: string) => items.includes(id),
    select,
    onToggle: handleToggle,
    onAfterRemove: () => setItems([]),
  }

  return (
    <RemoveItemsContext.Provider value={value}>
      {children}
    </RemoveItemsContext.Provider>
  )
}


export const useRemove = () => useContext(RemoveItemsContext);