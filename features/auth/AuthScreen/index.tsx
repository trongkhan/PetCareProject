import React, { useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput as RNTextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Button, HelperText, Icon, Surface, Text, TextInput, useTheme } from 'react-native-paper';
import { BaseScreen } from '@/components/BaseScreen';
import { useTranslation } from '@/hooks/useTranslation';
import { useStyles } from './styles';
import { useViewModel } from './viewModel';
import { handleUICallback } from './uiCallback';
import type { IAuthScreenUICallback } from './types';

const logo = require('../../../assets/images/senly-logo.png');

const AuthScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();

  // Password visibility is pure view state, like dialog visibility on the other screens.
  const [secure, setSecure] = useState(true);
  const passwordRef = useRef<RNTextInput>(null);

  const handleUICallbackFn = useCallback(
    (action: IAuthScreenUICallback) => handleUICallback(action),
    [],
  );

  const { selectors, handlers } = useViewModel({ handleUICallback: handleUICallbackFn });

  return (
    <BaseScreen header={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brand}>
            <Image source={logo} style={styles.logo} contentFit="contain" />
            <Text variant="displaySmall" style={styles.appName}>
              {t('common.appName')}
            </Text>
          </View>

          <Surface style={styles.card} elevation={1}>
            <View style={styles.fields}>
              <TextInput
                label={t('auth.email')}
                placeholder={t('auth.emailPlaceholder')}
                value={selectors.email}
                onChangeText={handlers.setEmail}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="email-outline" />}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                submitBehavior="submit"
              />

              <TextInput
                ref={passwordRef}
                label={t('auth.password')}
                value={selectors.password}
                onChangeText={handlers.setPassword}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={secure ? 'eye-outline' : 'eye-off-outline'}
                    onPress={() => setSecure((prev) => !prev)}
                    accessibilityLabel={t(secure ? 'auth.showPassword' : 'auth.hidePassword')}
                  />
                }
                secureTextEntry={secure}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={handlers.submit}
              />

              <View style={styles.feedbackSlot}>
                {selectors.error ? (
                  <View
                    style={styles.feedbackRow}
                    accessibilityRole="alert"
                    accessibilityLiveRegion="polite"
                  >
                    <Icon source="alert-circle-outline" size={18} color={theme.colors.error} />
                    <HelperText type="error" visible style={[styles.feedbackText, styles.errorText]}>
                      {selectors.error}
                    </HelperText>
                  </View>
                ) : null}
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handlers.submit}
              loading={selectors.isLoading}
              disabled={!selectors.canSubmit}
              style={styles.submit}
              contentStyle={styles.submitContent}
              icon="login"
            >
              {t('auth.signIn')}
            </Button>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </BaseScreen>
  );
};

AuthScreenComp.displayName = 'AuthScreen';
export const AuthScreen = React.memo(AuthScreenComp);
