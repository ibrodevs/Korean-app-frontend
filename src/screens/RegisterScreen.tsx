import React, { useState } from 'react';
import {
  View,
  
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Text from '../components/Text';
import { useTailwind } from '../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Компоненты
import InputField from '../components/auth/InputField';
import Checkbox from '../components/auth/Checkbox';

// Сервисы и утилиты
import { authService } from '../services/authService';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validatePhone,
} from '../utils/validation';
import { RootStackParamList } from '../types/navigation';
import { RegisterFormData } from '../types/auth';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RegisterScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData((prev: RegisterFormData) => ({ ...prev, [field]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field as keyof typeof errors]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Валидация имени
    const firstNameError = validateName(formData.firstName);
    if (firstNameError) newErrors.firstName = t(firstNameError);
    
    // Валидация фамилии
    const lastNameError = validateName(formData.lastName);
    if (lastNameError) newErrors.lastName = t(lastNameError);
    
    // Валидация email
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = t(emailError);
    
    // Валидация телефона
    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = t(phoneError);
    
    // Валидация пароля
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = t(passwordError);
    
    // Валидация подтверждения пароля
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    if (confirmPasswordError) newErrors.confirmPassword = t(confirmPasswordError);
    
    // Проверка согласия с условиями
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t('auth.validation.required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await authService.register(formData);
      
      if (response.success && response.token && response.user) {
        // Сохраняем токен и данные пользователя
        await AsyncStorage.setItem('user-token', response.token);
        await AsyncStorage.setItem('user-data', JSON.stringify(response.user));
        
        Alert.alert(
          t('auth.success.registration'),
          'Your account has been created successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            }),
            },
          ]
        );
      } else {
        Alert.alert(
          t('auth.register'),
          t(response.error || 'auth.errors.unknownError')
        );
      }
    } catch (error) {
      Alert.alert(
        t('auth.errors.networkError'),
        t('auth.errors.unknownError')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsPress = () => {
    Alert.alert('Terms of Service', 'This will open terms of service in the full version');
  };

  const handlePrivacyPress = () => {
    Alert.alert('Privacy Policy', 'This will open privacy policy in the full version');
  };

  return (
    <KeyboardAvoidingView
      style={[
        tailwind('flex-1'),
        { backgroundColor: theme.background },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={tailwind('px-6 py-8')}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Заголовок */}
        <View style={tailwind('mb-8')}>
          <Text
            style={[
              tailwind('text-3xl font-bold'),
              { color: theme.heading },
            ]}
          >
            {t('auth.register')}
          </Text>
          <Text
            style={[
              tailwind('text-base mt-2'),
              { color: theme.textSecondary },
            ]}
          >
            Create your KoreanStore account
          </Text>
        </View>

        {/* Форма */}
        <View style={tailwind('mb-6')}>
          {/* Имя и Фамилия в одной строке */}
          <View style={tailwind('flex-row mb-4')}>
            <View style={tailwind('flex-1 mr-2')}>
              <InputField
                label={t('auth.firstName')}
                placeholder="John"
                value={formData.firstName}
                onChangeText={(value: string) => handleInputChange('firstName', value)}
                error={errors.firstName}
                icon="person-outline"
                editable={!isLoading}
              />
            </View>
            <View style={tailwind('flex-1 ml-2')}>
              <InputField
                label={t('auth.lastName')}
                placeholder="Doe"
                value={formData.lastName}
                onChangeText={(value: string) => handleInputChange('lastName', value)}
                error={errors.lastName}
                editable={!isLoading}
              />
            </View>
          </View>

          <InputField
            label={t('auth.email')}
            placeholder="your.email@example.com"
            value={formData.email}
            onChangeText={(value: string) => handleInputChange('email', value)}
            error={errors.email}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <InputField
            label={t('auth.phone')}
            placeholder="+1 (234) 567-8900"
            value={formData.phone}
            onChangeText={(value: string) => handleInputChange('phone', value)}
            error={errors.phone}
            icon="call-outline"
            keyboardType="phone-pad"
            editable={!isLoading}
          />

          <InputField
            label={t('auth.password')}
            placeholder="••••••••"
            value={formData.password}
            onChangeText={(value: string) => handleInputChange('password', value)}
            error={errors.password}
            icon="lock-closed-outline"
            secureTextEntry
            editable={!isLoading}
          />

          <InputField
            label={t('auth.confirmPassword')}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChangeText={(value: string) => handleInputChange('confirmPassword', value)}
            error={errors.confirmPassword}
            icon="lock-closed-outline"
            secureTextEntry
            editable={!isLoading}
          />

          {/* Согласие с условиями */}
          <View style={tailwind('mb-6')}>
            <Checkbox
              checked={formData.agreeToTerms}
              onToggle={() => handleInputChange('agreeToTerms', !formData.agreeToTerms)}
              label=""
              labelComponent={
                <Text style={[tailwind('text-sm'), { color: theme.textSecondary }]}>
                  I agree to the{' '}
                  <Text
                    style={{ color: theme.primary }}
                    onPress={handleTermsPress}
                  >
                    Terms of Service
                  </Text>
                  {' '}and{' '}
                  <Text
                    style={{ color: theme.primary }}
                    onPress={handlePrivacyPress}
                  >
                    Privacy Policy
                  </Text>
                </Text>
              }
            />
            {errors.agreeToTerms && (
              <Text style={[tailwind('text-xs mt-1'), { color: theme.error }]}>
                {errors.agreeToTerms}
              </Text>
            )}
          </View>

          {/* Кнопка регистрации */}
          <TouchableOpacity
            style={[
              tailwind('rounded-xl py-4 items-center'),
              { backgroundColor: theme.primary },
              isLoading && tailwind('opacity-70'),
            ]}
            onPress={handleRegister}
            disabled={isLoading || !formData.agreeToTerms}
            activeOpacity={0.8}
          >
            <Text
              style={[
                tailwind('text-lg font-semibold'),
                { color: theme.heading },
              ]}
            >
              {isLoading ? '...' : t('auth.createAccount')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ссылка на вход */}
        <View style={tailwind('items-center mt-6')}>
          <Text style={[tailwind('text-base'), { color: theme.textSecondary }]}>
            {t('auth.hasAccount')}{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Text
              style={[
                tailwind('text-base font-semibold'),
                { color: theme.primary },
              ]}
            >
              {t('auth.signIn')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;