import React, { useCallback } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, View } from 'react-native';
import { ActivityIndicator, IconButton, Text, TextInput, useTheme } from 'react-native-paper';
import { BaseScreen } from '@/components/BaseScreen';
import { useTranslation } from '@/hooks/useTranslation';
import { useStyles } from './styles';
import { useViewModel } from './viewModel';
import { handleUICallback } from './uiCallback';
import type { IAssistantScreenUICallback, Msg } from './types';

const AssistantScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();

  const handleUICallbackFn = useCallback(
    (action: IAssistantScreenUICallback) => handleUICallback(action),
    [],
  );

  const { selectors, handlers } = useViewModel({ handleUICallback: handleUICallbackFn });

  const renderItem = useCallback(
    ({ item }: { item: Msg }) => {
      const isUser = item.role === 'user';
      return (
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
          <Text style={isUser ? styles.bubbleTextUser : styles.bubbleTextAssistant}>{item.text}</Text>
        </View>
      );
    },
    [styles],
  );

  return (
    <BaseScreen headerTitle={t('assistant.title')} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {selectors.messages.length === 0 ? (
          <View style={styles.empty}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              {t('assistant.empty')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={selectors.messages}
            keyExtractor={(m) => m.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
        {selectors.isLoading ? <ActivityIndicator style={styles.loading} color={theme.colors.primary} /> : null}
        <Text variant="labelSmall" style={styles.disclaimer}>
          {t('assistant.disclaimer')}
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.flex}
            mode="outlined"
            placeholder={t('assistant.placeholder')}
            value={selectors.input}
            onChangeText={handlers.setInput}
            onSubmitEditing={handlers.send}
            dense
          />
          <IconButton
            icon="send"
            mode="contained"
            onPress={handlers.send}
            disabled={selectors.isLoading || !selectors.input.trim()}
          />
        </View>
      </KeyboardAvoidingView>
    </BaseScreen>
  );
};

AssistantScreenComp.displayName = 'AssistantScreen';
export const AssistantScreen = React.memo(AssistantScreenComp);
