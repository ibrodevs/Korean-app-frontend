import React, { Suspense } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import SplashScreen from '../screens/SplashScreen';
import MainTabNavigator from './MainTabNavigator';

// Ленивая загрузка экранов для оптимизации производительности
const OnboardingScreen = React.lazy(() => import('../screens/OnboardingScreen'));
const LoginScreen = React.lazy(() => import('../screens/auth/LoginScreen'));
const RegisterScreen = React.lazy(() => import('../screens/auth/RegisterScreen'));
const ForgotPasswordScreen = React.lazy(() => import('../screens/auth/ForgotPasswordScreen'));
const AdvancedSearchScreen = React.lazy(() => import('../screens/search/AdvancedSearchScreen'));
const CheckoutScreen = React.lazy(() => import('../screens/checkout/CheckoutScreen'));
const OrderTrackingScreen = React.lazy(() => import('../screens/order/OrderTrackingScreen'));
const OrdersScreen = React.lazy(() => import('../screens/OrdersScreen'));

const Stack = createNativeStackNavigator<RootStackParamList>();

// Loading fallback
const LoadingFallback = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

// Wrap lazy components with Suspense
const withSuspense = (Component: any) => (props: any) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component {...props} />
  </Suspense>
);

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen}
        options={{ 
          animationEnabled: false,
          cardStyle: { backgroundColor: '#FFFFFF' }
        }}
      />
      <Stack.Screen 
        name="Onboarding" 
        component={withSuspense(OnboardingScreen)}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen 
        name="Login" 
        component={withSuspense(LoginScreen)}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen name="Register" component={withSuspense(RegisterScreen)} />
      <Stack.Screen name="ForgotPassword" component={withSuspense(ForgotPasswordScreen)} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="AdvancedSearch" component={withSuspense(AdvancedSearchScreen)} />
      <Stack.Screen name="Checkout" component={withSuspense(CheckoutScreen)} />
      <Stack.Screen name="OrderTracking" component={withSuspense(OrderTrackingScreen)} />
      <Stack.Screen name="Orders" component={withSuspense(OrdersScreen)} />
    </Stack.Navigator>
  );
};

export default RootNavigator;