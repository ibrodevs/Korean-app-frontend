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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeProvider';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { RootStackScreenProps } from '@/navigation/types';
import Button from '@/components/Button';
import Input from '@/components/Input';

type LoginScreenProps = RootStackScreenProps<'Auth'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenProps['navigation']>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

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
      paddingTop: Spacing.xxl,
    },
    header: {
      alignItems: 'center',
      marginBottom: Spacing.xxl,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      marginBottom: Spacing.lg,
    },
    title: {
      ...Typography.h1,
      color: colors.text,
      fontWeight: 'bold',
      marginBottom: Spacing.sm,
    },
    subtitle: {
      ...Typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    form: {
      marginBottom: Spacing.xl,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: Spacing.xl,
    },
    forgotPasswordText: {
      ...Typography.body,
      color: colors.primary,
    },
    loginButton: {
      marginBottom: Spacing.lg,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 'auto',
      paddingBottom: Spacing.xl,
    },
    footerText: {
      ...Typography.body,
      color: colors.textSecondary,
    },
    registerButton: {
      marginLeft: Spacing.sm,
    },
    registerButtonText: {
      ...Typography.body,
      color: colors.primary,
      fontWeight: '600',
    },
  });

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};

    if (!email.trim()) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.emailInvalid');
    }

    if (!password.trim()) {
      newErrors.password = t('auth.passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('auth.passwordTooShort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Save user token (mock)
      await AsyncStorage.setItem('userToken', 'mock-token-123');
      await AsyncStorage.setItem('userEmail', email);

      // Navigate to main app
      navigation.replace('Main');
    } catch (error) {
      Alert.alert(t('common.error'), t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logo} />
            <Text style={styles.title}>{t('auth.welcomeBack')}</Text>
            <Text style={styles.subtitle}>{t('auth.signInToContinue')}</Text>
          </View>

          <View style={styles.form}>
            <Input
              label={t('common.email')}
              value={email}
              onChangeText={setEmail}
              placeholder={t('auth.emailPlaceholder')}
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label={t('common.password')}
              value={password}
              onChangeText={setPassword}
              placeholder={t('auth.passwordPlaceholder')}
              leftIcon="lock-closed-outline"
              secureTextEntry
              error={errors.password}
            />

            <Button
              title={t('auth.forgotPassword')}
              onPress={handleForgotPassword}
              variant="outline"
              size="small"
              style={styles.forgotPassword}
              textStyle={styles.forgotPasswordText}
            />

            <Button
              title={t('auth.login')}
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.dontHaveAccount')}</Text>
            <Button
              title={t('auth.register')}
              onPress={handleRegister}
              variant="outline"
              size="small"
              style={styles.registerButton}
              textStyle={styles.registerButtonText}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}