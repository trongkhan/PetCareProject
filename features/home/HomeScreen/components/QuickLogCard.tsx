import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { AIService } from '@/services/AIService';
import { useQuickLogStore } from '@/store/quickLogStore';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, HelperText, IconButton, Surface, Text, TextInput, useTheme } from 'react-native-paper';

export function QuickLogCard() {
  const theme = useTheme();
  const { t, language } = useTranslation();
  const setPending = useQuickLogStore((s) => s.setPending);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async () => {
    const value = text.trim();
    if (!value || loading) return;
    setError(null);
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await AIService.extract(value, language, today);
      if (result.kind === 'meal') {
        setPending(result);
        setText('');
        router.push('/feeding');
      } else if (result.kind === 'health') {
        setPending(result);
        setText('');
        router.push('/health');
      } else {
        setError(t('quicklog.unknown'));
      }
    } catch {
      setError(t('quicklog.error'));
    } finally {
      setLoading(false);
    }
  }, [text, loading, language, setPending, t]);

  return (
    <Surface style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]} elevation={0}>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
        ✨ {t('quicklog.title')}
      </Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          mode="outlined"
          dense
          placeholder={t('quicklog.placeholder')}
          value={text}
          onChangeText={setText}
          onSubmitEditing={submit}
          disabled={loading}
        />
        {loading ? (
          <ActivityIndicator style={styles.spinner} color={theme.colors.primary} />
        ) : (
          <IconButton icon="send" mode="contained" onPress={submit} disabled={!text.trim()} />
        )}
      </View>
      {error ? <HelperText type="error" visible>{error}</HelperText> : null}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: Spacing.md, gap: Spacing.xs },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  input: { flex: 1 },
  spinner: { width: 48, height: 48, justifyContent: 'center' },
});
