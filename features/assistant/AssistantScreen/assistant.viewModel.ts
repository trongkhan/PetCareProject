import { useCallback, useRef, useState } from 'react';
import { AIService } from '@/services/AIService';
import { useTranslation } from '@/hooks/useTranslation';
import { IAssistantScreenUICallback, Msg } from './assistant.types';

interface UseViewModelProps {
  handleUICallback: (action: IAssistantScreenUICallback) => void;
}

interface Selectors {
  messages: Msg[];
  input: string;
  isLoading: boolean;
}

interface Handlers {
  setInput: (value: string) => void;
  send: () => Promise<void>;
}

export const useViewModel = ({ handleUICallback: _handleUICallback }: UseViewModelProps): { selectors: Selectors; handlers: Handlers } => {
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const idRef = useRef(0);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setMessages(prev => [...prev, { id: `u${idRef.current++}`, role: 'user', text }]);
    setInput('');
    setIsLoading(true);
    try {
      const answer = await AIService.chat(text, language);
      setMessages(prev => [...prev, { id: `a${idRef.current++}`, role: 'assistant', text: answer }]);
    } catch {
      setMessages(prev => [...prev, { id: `e${idRef.current++}`, role: 'assistant', text: t('assistant.error') }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, language, t]);

  return {
    selectors: { messages, input, isLoading },
    handlers: { setInput, send },
  };
};
