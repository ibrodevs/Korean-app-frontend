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

// Компоненты
import InputField from '../components/auth/InputField';

// Сервисы и утилиты
import { authService } from '../services/authService';
import { validateEmail } from '../utils/validation';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ForgotPasswordScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    const emailError = validateEmail(email);
    
    if (emailError) {
      setError(t(emailError));
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        setIsSubmitted(true);
        Alert.alert(
          'Success',
          response.message,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', response.message);
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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tailwind('mb-6')}
            activeOpacity={0.7}
          >
            <Text style={[tailwind('text-lg'), { color: theme.primary }]}>
              ← Back
            </Text>
          </TouchableOpacity>
          
          <Text
            style={[
              tailwind('text-3xl font-bold'),
              { color: theme.heading },
            ]}
          >
            Forgot Password
          </Text>
          <Text
            style={[
              tailwind('text-base mt-2'),
              { color: theme.textSecondary },
            ]}
          >
            {isSubmitted
              ? 'Check your email for password reset instructions'
              : 'Enter your email to receive password reset instructions'
            }
          </Text>
        </View>

        {!isSubmitted ? (
          <>
            {/* Форма */}
            <View style={tailwind('mb-8')}>
              <InputField
                label={t('auth.email')}
                placeholder="your.email@example.com"
                value={email}
                onChangeText={(value: string) => {
                  setEmail(value);
                  setError('');
                }}
                error={error}
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />

              {/* Кнопка отправки */}
              <TouchableOpacity
                style={[
                  tailwind('rounded-xl py-4 items-center mt-6'),
                  { backgroundColor: theme.primary },
                  isLoading && tailwind('opacity-70'),
                ]}
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    tailwind('text-lg font-semibold'),
                    { color: theme.heading },
                  ]}
                >
                  {isLoading ? '...' : 'Send Reset Instructions'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={tailwind('items-center py-10')}>
            <Text
              style={[
                tailwind('text-lg text-center mb-6'),
                { color: theme.text },
              ]}
            >
              We've sent password reset instructions to your email address.
            </Text>
            <TouchableOpacity
              style={[
                tailwind('rounded-xl py-4 items-center px-8'),
                { backgroundColor: theme.primary },
              ]}
              onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  tailwind('text-lg font-semibold'),
                  { color: theme.heading },
                ]}
              >
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;