import { BaseScreen } from '@/components/BaseScreen';
import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/authStore';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';

const logo = require('../../../assets/images/senly-logo.png');

const AuthScreenComp = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const signIn = useAuthStore((s) => s.signInWithPassword);
  const signUp = useAuthStore((s) => s.signUp);

  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setNotice(null);
    if (!email.trim() || !password) {
      setError(t('auth.missingFields'));
      return;
    }
    setLoading(true);
    const fn = mode === 'signIn' ? signIn : signUp;
    const res = await fn(email.trim(), password);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    // On sign-in (or sign-up when email confirmation is off), a session appears
    // and the auth gate in the root layout redirects automatically.
    if (mode === 'signUp') setNotice(t('auth.signUpCheckEmail'));
  };

  const toggleMode = () => {
    setMode(mode === 'signIn' ? 'signUp' : 'signIn');
    setError(null);
    setNotice(null);
  };

  return (
    <BaseScreen header={false} style={styles.container}>
      <View style={styles.brand}>
        <Image source={logo} style={styles.logo} contentFit="contain" />
        <Text variant="displaySmall" style={{ color: theme.colors.primary, fontWeight: '800' }}>
          {t('common.appName')}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {t('auth.tagline')}
        </Text>
      </View>

      <View style={styles.form}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
          {t(mode === 'signIn' ? 'auth.signInTitle' : 'auth.signUpTitle')}
        </Text>
        <TextInput
          label={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextInput
          label={t('auth.password')}
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          autoCapitalize="none"
        />
        {error ? <HelperText type="error" visible>{error}</HelperText> : null}
        {notice ? <HelperText type="info" visible>{notice}</HelperText> : null}
        <Button mode="contained" onPress={submit} loading={loading} disabled={loading} style={styles.submit}>
          {t(mode === 'signIn' ? 'auth.signIn' : 'auth.signUp')}
        </Button>
        <Button mode="text" onPress={toggleMode} disabled={loading}>
          {t(mode === 'signIn' ? 'auth.toSignUp' : 'auth.toSignIn')}
        </Button>
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', gap: Spacing.xxl, padding: Spacing.lg },
  brand: { alignItems: 'center', gap: Spacing.sm },
  logo: { width: 88, height: 88, borderRadius: 20 },
  form: { gap: Spacing.sm },
  submit: { marginTop: Spacing.sm },
});

AuthScreenComp.displayName = 'AuthScreen';
export const AuthScreen = React.memo(AuthScreenComp);
