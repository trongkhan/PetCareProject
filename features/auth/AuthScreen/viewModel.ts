import { useCallback, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/hooks/useTranslation';
import { IAuthScreenUICallback } from './types';

interface UseViewModelProps {
  handleUICallback: (action: IAuthScreenUICallback) => void;
}

interface Selectors {
  email: string;
  password: string;
  isLoading: boolean;
  canSubmit: boolean;
  error: string | null;
}

interface Handlers {
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  submit: () => Promise<void>;
}

export const useViewModel = ({ handleUICallback: _handleUICallback }: UseViewModelProps): { selectors: Selectors; handlers: Handlers } => {
  const { t } = useTranslation();
  const signIn = useAuthStore((s) => s.signInWithPassword);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError(t('auth.missingFields'));
      return;
    }
    setIsLoading(true);
    const res = await signIn(email.trim(), password);
    setIsLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    // A session appears and the auth gate in the root layout redirects automatically.
  }, [email, password, signIn, t]);

  return {
    selectors: {
      email,
      password,
      isLoading,
      canSubmit: email.trim().length > 0 && password.length > 0 && !isLoading,
      error,
    },
    handlers: { setEmail, setPassword, submit },
  };
};
