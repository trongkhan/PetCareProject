import { useAuthStore } from '@/store/authStore';
import { IAccountScreenUICallback } from './account.types';

interface UseViewModelProps {
  handleUICallback: (action: IAccountScreenUICallback) => void;
}

interface Selectors {
  email: string;
}

interface Handlers {
  signOut: () => void;
}

export const useViewModel = ({ handleUICallback: _handleUICallback }: UseViewModelProps): { selectors: Selectors; handlers: Handlers } => {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  return {
    selectors: { email: user?.email ?? '—' },
    handlers: { signOut },
  };
};
