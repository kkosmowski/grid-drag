import { useContext } from 'react';
import { StorageContext } from '~/contexts/StorageContext';

export const useStorage = () => {
  return useContext(StorageContext);
};
