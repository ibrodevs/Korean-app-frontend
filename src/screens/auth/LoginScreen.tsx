import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

// Компоненты
import InputField from '../../components/auth/InputField';
import Checkbox from '../../components/auth/Checkbox';
import SocialButton from '../../components/auth/SocialButton';

// Сервисы и утилиты
import { authService } from '../../services/authService';
import { validateEmail, validatePassword } from '../../utils/validation';
import { RootStackParamList } from '../../types/navigation';
import { LoginFormData } from '../../types/auth';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  // Проверка доступности биометрии
  React.useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(compatible && enrolled);
    } catch (error) {
      console.error('Biometric check failed:', error);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t('auth.login'),
        fallbackLabel: t('auth.usePassword'),
      });

      if (result.success) {
        // Используем демо-данные для биометрического входа
        handleLogin({
          email: 'user@example.com',
          password: 'password123',
          rememberMe: true,
        });
      }
    } catch (error) {
      console.error('Biometric auth failed:', error);
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = t(emailError);
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = t(passwordError);
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (loginData?: LoginFormData) => {
    const dataToUse = loginData || formData;
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await authService.login(dataToUse);
      
      if (response.success && response.token && response.user) {
        // Сохраняем токен
        await AsyncStorage.setItem('user-token', response.token);
        await AsyncStorage.setItem('user-data', JSON.stringify(response.user));
        
        if (formData.rememberMe) {
          await AsyncStorage.setItem('remember-me', 'true');
        }
        
        Alert.alert(t('auth.success.login'), '', [
          {
            text: 'OK',
            onPress: () => navigation.replace('Main'),
          },
        ]);
      } else {
        Alert.alert(
          t('auth.login'),
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

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(
      `${provider} Login`,
      'Social login will be implemented in the full version'
    );
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
        contentContainerStyle={tailwind('flex-grow px-6 py-8')}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Заголовок */}
        <View style={tailwind('mb-10')}>
          <Text
            style={[
              tailwind('text-3xl font-bold'),
              { color: theme.heading },
            ]}
          >
            {t('auth.login')}
          </Text>
          <Text
            style={[
              tailwind('text-base mt-2'),
              { color: theme.textSecondary },
            ]}
          >
            Welcome back! Please sign in to your account
          </Text>
        </View>

        {/* Форма */}
        <View style={tailwind('mb-8')}>
          <InputField
            label={t('auth.email')}
            placeholder="your.email@example.com"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            error={errors.email}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <InputField
            label={t('auth.password')}
            placeholder="••••••••"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            error={errors.password}
            icon="lock-closed-outline"
            secureTextEntry
            editable={!isLoading}
          />

          {/* Опции */}
          <View style={tailwind('flex-row justify-between items-center mb-6')}>
            <Checkbox
              checked={formData.rememberMe}
              onToggle={() => handleInputChange('rememberMe', !formData.rememberMe)}
              label={t('auth.rememberMe')}
            />

            <TouchableOpacity
              onPress={handleForgotPassword}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  tailwind('text-sm font-medium'),
                  { color: theme.primary },
                ]}
              >
                {t('auth.forgotPassword')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Кнопка входа */}
          <TouchableOpacity
            style={[
              tailwind('rounded-xl py-4 items-center'),
              { backgroundColor: theme.primary },
              isLoading && tailwind('opacity-70'),
            ]}
            onPress={() => handleLogin()}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text
              style={[
                tailwind('text-lg font-semibold'),
                { color: theme.heading },
              ]}
            >
              {isLoading ? '...' : t('auth.signIn')}
            </Text>
          </TouchableOpacity>

          {/* Биометрическая аутентификация */}
          {isBiometricAvailable && (
            <TouchableOpacity
              style={[
                tailwind('rounded-xl py-4 items-center mt-4 border'),
                { borderColor: theme.border },
              ]}
              onPress={handleBiometricAuth}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  tailwind('text-lg font-semibold'),
                  { color: theme.text },
                ]}
              >
                Use Biometric Login
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Разделитель */}
        <View style={tailwind('flex-row items-center mb-6')}>
          <View style={[tailwind('flex-1 h-px'), { backgroundColor: theme.border }]} />
          <Text style={[tailwind('px-4'), { color: theme.textSecondary }]}>
            {t('auth.orContinueWith')}
          </Text>
          <View style={[tailwind('flex-1 h-px'), { backgroundColor: theme.border }]} />
        </View>

        {/* Социальные кнопки */}
        <View style={tailwind('flex-row mb-8')}>
          <View style={tailwind('mr-2 flex-1')}>
            <SocialButton
              provider="google"
              onPress={() => handleSocialLogin('Google')}
            />
          </View>
          <View style={tailwind('mx-2 flex-1')}>
            <SocialButton
              provider="apple"
              onPress={() => handleSocialLogin('Apple')}
            />
          </View>
          <View style={tailwind('ml-2 flex-1')}>
            <SocialButton
              provider="facebook"
              onPress={() => handleSocialLogin('Facebook')}
            />
          </View>
        </View>

        {/* Ссылка на регистрацию */}
        <View style={tailwind('items-center')}>
          <Text style={[tailwind('text-base'), { color: theme.textSecondary }]}>
            {t('auth.noAccount')}{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Text
              style={[
                tailwind('text-base font-semibold'),
                { color: theme.primary },
              ]}
            >
              {t('auth.signUp')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;