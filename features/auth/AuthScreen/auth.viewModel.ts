import { useCallback, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { IAuthScreenUICallback } from './auth.types';

interface UseViewModelProps {
  handleUICallback: (action: IAuthScreenUICallback) => void;
}

interface Selectors {
  isGuestLoading: boolean;
  error: string | null;
}

interface Handlers {
  continueAsGuest: () => Promise<void>;
}

export const useViewModel = ({ handleUICallback: _handleUICallback }: UseViewModelProps): { selectors: Selectors; handlers: Handlers } => {
  const signInAsGuest = useAuthStore((s) => s.signInAsGuest);

  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const continueAsGuest = useCallback(async () => {
    setError(null);
    setIsGuestLoading(true);
    const res = await signInAsGuest();
    setIsGuestLoading(false);
    if (res.error) {
      setError(res.error);
    }
    // A session appears and the auth gate in the root layout redirects automatically.
  }, [signInAsGuest]);

  return {
    selectors: { isGuestLoading, error },
    handlers: { continueAsGuest },
  };
};
