import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { Typography, Spacing } from '@/constants/theme';
import { AuthStackParamList } from '@/navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from '@/components/Button';
import Input from '@/components/Input';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    title: {
      ...Typography.h2,
      color: colors.text,
      fontWeight: 'bold',
      marginBottom: Spacing.sm,
    },
    subtitle: {
      ...Typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    form: {
      marginTop: Spacing.xl,
    },
    resetButton: {
      marginTop: Spacing.lg,
    },
  });

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError(t('auth.emailRequired'));
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t('auth.emailInvalid'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        t('common.success'),
        t('auth.resetPasswordSent'),
        [
          {
            text: t('common.ok'),
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error'), t('auth.resetPasswordError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.header} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('auth.forgotPassword')}</Text>
            <Text style={styles.subtitle}>{t('auth.resetPasswordInstructions')}</Text>
          </View>

          <View style={styles.form}>
            <Input
              label={t('common.email')}
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (emailError) setEmailError('');
              }}
              placeholder={t('auth.emailPlaceholder')}
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
            />

            <Button
              title={t('auth.sendResetLink')}
              onPress={handleResetPassword}
              loading={loading}
              style={styles.resetButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}