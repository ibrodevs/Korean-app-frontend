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
import { useTheme } from '@/theme/ThemeProvider';
import { Typography, Spacing } from '@/constants/theme';
import { AuthStackParamList } from '@/navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from '@/components/Button';
import Input from '@/components/Input';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

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
    },
    form: {
      marginBottom: Spacing.xl,
    },
    registerButton: {
      marginTop: Spacing.lg,
    },
  });

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('auth.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.emailInvalid');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('auth.phoneRequired');
    }

    if (!formData.password.trim()) {
      newErrors.password = t('auth.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passwordTooShort');
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        t('common.success'),
        t('auth.registerSuccess'),
        [
          {
            text: t('common.ok'),
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error'), t('auth.registerError'));
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
            <Text style={styles.title}>{t('auth.createAccount')}</Text>
            <Text style={styles.subtitle}>{t('auth.fillInformation')}</Text>
          </View>

          <View style={styles.form}>
            <Input
              label={t('auth.fullName')}
              value={formData.fullName}
              onChangeText={(value) => updateFormData('fullName', value)}
              placeholder={t('auth.fullNamePlaceholder')}
              leftIcon="person-outline"
              error={errors.fullName}
            />

            <Input
              label={t('common.email')}
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              placeholder={t('auth.emailPlaceholder')}
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label={t('common.phone')}
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              placeholder={t('auth.phonePlaceholder')}
              leftIcon="call-outline"
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <Input
              label={t('common.password')}
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              placeholder={t('auth.passwordPlaceholder')}
              leftIcon="lock-closed-outline"
              secureTextEntry
              error={errors.password}
            />

            <Input
              label={t('auth.confirmPassword')}
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              placeholder={t('auth.confirmPasswordPlaceholder')}
              leftIcon="lock-closed-outline"
              secureTextEntry
              error={errors.confirmPassword}
            />

            <Button
              title={t('auth.createAccount')}
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}