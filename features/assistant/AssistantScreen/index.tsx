import { BaseScreen } from '@/components/BaseScreen';
import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { AIService } from '@/services/AIService';
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { ActivityIndicator, IconButton, Text, TextInput, useTheme } from 'react-native-paper';

interface Msg {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const AssistantScreenComp = () => {
  const theme = useTheme();
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const idRef = useRef(0);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((prev) => [...prev, { id: `u${idRef.current++}`, role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const answer = await AIService.chat(text, language);
      setMessages((prev) => [...prev, { id: `a${idRef.current++}`, role: 'assistant', text: answer }]);
    } catch {
      setMessages((prev) => [...prev, { id: `e${idRef.current++}`, role: 'assistant', text: t('assistant.error') }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, language, t]);

  const renderItem = useCallback(
    ({ item }: { item: Msg }) => {
      const isUser = item.role === 'user';
      return (
        <View
          style={[
            styles.bubble,
            isUser
              ? { alignSelf: 'flex-end', backgroundColor: theme.colors.primary }
              : { alignSelf: 'flex-start', backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <Text style={{ color: isUser ? theme.colors.onPrimary : theme.colors.onSurface }}>{item.text}</Text>
        </View>
      );
    },
    [theme],
  );

  return (
    <BaseScreen headerTitle={t('assistant.title')} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {messages.length === 0 ? (
          <View style={styles.empty}>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
              {t('assistant.empty')}
            </Text>
          </View>
        ) : (
          <FlatList data={messages} keyExtractor={(m) => m.id} renderItem={renderItem} contentContainerStyle={styles.list} />
        )}
        {loading ? <ActivityIndicator style={styles.loading} color={theme.colors.primary} /> : null}
        <Text variant="labelSmall" style={[styles.disclaimer, { color: theme.colors.onSurfaceVariant }]}>
          {t('assistant.disclaimer')}
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.flex}
            mode="outlined"
            placeholder={t('assistant.placeholder')}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={send}
            dense
          />
          <IconButton icon="send" mode="contained" onPress={send} disabled={loading || !input.trim()} />
        </View>
      </KeyboardAvoidingView>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { padding: Spacing.md, gap: Spacing.sm },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  bubble: { maxWidth: '85%', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: 16 },
  loading: { marginVertical: Spacing.xs },
  disclaimer: { textAlign: 'center', paddingHorizontal: Spacing.md },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, padding: Spacing.sm },
});

AssistantScreenComp.displayName = 'AssistantScreen';
export const AssistantScreen = React.memo(AssistantScreenComp);
