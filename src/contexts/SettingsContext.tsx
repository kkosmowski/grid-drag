import { createContext, ReactNode, useMemo } from 'react';
import { useToggle } from '~/hooks/use-toggle';
import { MenuItem } from '~/types/ui';

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
  const [isPreviewSnapped, toggleSnapPreview] = useToggle(false);

  const options: MenuItem[] = useMemo(
    () => [
      {
        id: 'preview-snapped',
        label: (
          <>
            <span>Preview snapped</span> <input type="checkbox" checked={isPreviewSnapped} onChange={() => {}} />
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
