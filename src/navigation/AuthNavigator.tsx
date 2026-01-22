import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@/contexts/ThemeContext';

import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import ForgotPasswordScreen from '@/screens/ForgotPasswordScreen';

import { AuthStackParamList } from './types';

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.header,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
    </Stack.Navigator>
  );
}