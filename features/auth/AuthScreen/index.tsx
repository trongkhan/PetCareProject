import { GoogleIcon } from '@/assets/icons';
import { BaseScreen } from '@/components/BaseScreen';
import { useTranslation } from '@/hooks/useTranslation';
import { Image } from 'expo-image';
import React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { Button, HelperText, Icon, Text, useTheme } from 'react-native-paper';
import { useStyles } from './styles';
import { handleUICallback } from './uiCallback';
import { useViewModel } from './viewModel';

const logo = require('../../../assets/images/senly-logo.png');

// Google/Apple sign-in aren't wired to a real provider yet (no OAuth client
// registered) — these buttons are UI-only placeholders until credentials
// exist; see SENLY_PROGRESS.md.
function noop() {}

const AuthScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();

  const { selectors, handlers } = useViewModel({ handleUICallback });

  return (
    <BaseScreen header={false} bottomBarClearance={false}>
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

        <View style={styles.options}>
          {Platform.OS === 'ios' ? (
            <Button
              mode="contained"
              onPress={noop}
              style={[styles.providerButton, styles.apple]}
              contentStyle={styles.providerContent}
              labelStyle={[styles.providerLabel, styles.appleLabel]}
              icon="apple"
            >
              {t('auth.continueWithApple')}
            </Button>
          ) : null}

          <Button
            mode="outlined"
            onPress={noop}
            style={[styles.providerButton, styles.google]}
            contentStyle={styles.providerContent}
            labelStyle={[styles.providerLabel, styles.googleLabel]}
            icon={({ size }) => <GoogleIcon width={size} height={size} />}
          >
            {t('auth.continueWithGoogle')}
          </Button>

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

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text variant="labelMedium" style={styles.dividerLabel}>
              {t('auth.orDivider')}
            </Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            mode="outlined"
            onPress={handlers.continueAsGuest}
            loading={selectors.isGuestLoading}
            disabled={selectors.isGuestLoading}
            style={styles.guest}
            contentStyle={styles.providerContent}
            labelStyle={styles.providerLabel}
            icon="paw"
          >
            {t('auth.continueAsGuest')}
          </Button>
        </View>
      </ScrollView>
    </BaseScreen>
  );
};

AuthScreenComp.displayName = 'AuthScreen';
export const AuthScreen = React.memo(AuthScreenComp);
