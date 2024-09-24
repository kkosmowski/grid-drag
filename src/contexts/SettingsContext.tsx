import { createContext, ReactNode, useEffect, useMemo } from 'react';
import { useToggle } from '~/hooks/use-toggle';
import { MenuItem } from '~/types/ui';
import { Storage } from '~/utils/storage';
import { Checkbox } from '~/components/Checkbox';

type StorageSettingItem = {
  id: 'preview-snapped';
  value: boolean;
};

type SettingsContextType = {
  isPreviewSnapped: boolean;
  toggleSnapPreview: VoidFunction;
  options: MenuItem[];
};

export const SettingsContext = createContext<SettingsContextType>({
  isPreviewSnapped: false,
  toggleSnapPreview: () => {},
  options: [],
});

export type SettingsProviderProps = {
  children: ReactNode;
};

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const storage = new Storage('kko-grid-drag-settings');
  const [isPreviewSnapped, toggleSnapPreview] = useToggle(
    storage.get<StorageSettingItem>('preview-snapped')?.value ?? false,
  );

  useEffect(() => {
    storage.update('preview-snapped', { value: isPreviewSnapped }, true);
  }, [isPreviewSnapped]);

  const options: MenuItem[] = useMemo(
    () => [
      {
        id: 'preview-snapped',
        label: (
          <>
            <span>Preview snapped</span> <Checkbox checked={isPreviewSnapped} onChange={() => {}} />
          </>
        ),
        onClick: () => toggleSnapPreview(),
      },
    ],
    [isPreviewSnapped, toggleSnapPreview],
  );

  return (
    <SettingsContext.Provider value={{ options, isPreviewSnapped, toggleSnapPreview }}>
      {children}
    </SettingsContext.Provider>
  );
};
