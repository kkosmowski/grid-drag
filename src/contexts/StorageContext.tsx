import { createContext, ReactNode, useCallback } from 'react';

import { Storage } from '~/utils/storage';
import { Rectangle } from '~/types/item';

type StorageContextType = {
  get: (id: Rectangle['id']) => Rectangle | null;
  getAll: () => Rectangle[];
  add: (item: Rectangle) => Rectangle[];
  set: (item: Rectangle) => Rectangle[];
  setAll: (items: Rectangle[]) => Rectangle[];
  patch: (id: Rectangle['id'], change: Partial<Omit<Rectangle, 'id'>>) => Rectangle[];
  remove: (id: Rectangle['id'] | Rectangle['id'][]) => Rectangle[];
  removeAll: () => Rectangle[];
};

export const StorageContext = createContext<StorageContextType>({
  get: () => null,
  getAll: () => [],
  add: () => [],
  set: () => [],
  setAll: () => [],
  patch: () => [],
  remove: () => [],
  removeAll: () => [],
});

export type StorageProviderProps = {
  children: ReactNode;
};

export const StorageProvider = ({ children }: StorageProviderProps) => {
  const storage = new Storage();

  const get = useCallback((id: Rectangle['id']) => {
    return storage.get<Rectangle>(id);
  }, []);

  const getAll = useCallback(() => {
    return storage.getAll<Rectangle>();
  }, []);

  const add = useCallback((item: Rectangle) => {
    return storage.add<Rectangle>(item);
  }, []);

  const set = useCallback((item: Rectangle) => {
    return storage.set<Rectangle>(item);
  }, []);

  const setAll = useCallback((items: Rectangle[]) => {
    return storage.setAll<Rectangle>(items);
  }, []);

  const patch = useCallback((id: Rectangle['id'], changes: Partial<Omit<Rectangle, 'id'>>) => {
    return storage.update<Rectangle>(id, changes);
  }, []);

  const remove = useCallback((id: Rectangle['id'] | Rectangle['id'][]) => {
    return storage.delete<Rectangle>(id);
  }, []);

  const removeAll = useCallback(() => {
    return storage.reset();
  }, []);

  return (
    <StorageContext.Provider value={{ get, getAll, add, set, setAll, patch, remove, removeAll }}>
      {children}
    </StorageContext.Provider>
  );
};
