import { useContext } from 'react';

import { ToasterContext } from '~/contexts/Toaster';

export const useToast = () => useContext(ToasterContext);
