import { createContext, ReactNode } from 'react';
import { useToggle } from '~/hooks/use-toggle';

type SettingsContextType = {
  isPreviewSnapped: boolean;
  toggleSnapPreview: VoidFunction;
};

export const SettingsContext = createContext<SettingsContextType>({
  isPreviewSnapped: false,
  toggleSnapPreview: () => {},
});

export type SettingsProviderProps = {
  children: ReactNode;
};

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [isPreviewSnapped, toggleSnapPreview] = useToggle(false);

  return (
    <SettingsContext.Provider value={{ isPreviewSnapped, toggleSnapPreview }}>{children}</SettingsContext.Provider>
  );
};
