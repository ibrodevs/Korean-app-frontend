import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

// Navigators
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

// Modal/Detail Screens
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import AdvancedSearchScreen from '../screens/AdvancedSearchScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Error Screens
import NoProductsScreen from '../screens/errors/NoProductsScreen';
import NoInternetScreen from '../screens/errors/NoInternetScreen';
import PaymentErrorScreen from '../screens/errors/PaymentErrorScreen';

// Other Screens
import SupportScreen from '../screens/SupportScreen';
import PaymentScreen from '../screens/PaymentScreen';

// Types
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check first launch
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      setIsFirstLaunch(hasLaunched === null);
      
      // Check authentication status
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing app:', error);
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('hasLaunched', 'true');
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.navBackground,
          },
          headerTintColor: theme.heading,
          headerTitleStyle: {
            fontWeight: '700' as const,
            fontSize: 18,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.background,
          },
          animation: 'slide_from_right',
        }}
      >
        {/* Splash Screen */}
        <Stack.Screen 
          name="Splash" 
          options={{ headerShown: false }}
        >
          {(props) => (
            <SplashScreen
              {...props}
              onFinish={() => {
                // Закомментировано для тестирования - сразу переход на Main
                // if (isFirstLaunch) {
                //   props.navigation.replace('Onboarding');
                // } else if (isAuthenticated) {
                //   props.navigation.replace('Main');
                // } else {
                //   props.navigation.replace('Auth');
                // }
                props.navigation.replace('Main');
              }}
            />
          )}
        </Stack.Screen>

        {/* Onboarding */}
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />

        {/* Auth Navigator */}
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />

        {/* Main Tab Navigator */}
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />

        {/* Detail Screens */}
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={({ route }) => ({
            title: t('product.details'),
            headerBackTitle: t('common.back'),
            presentation: 'card',
          })}
        />

        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{
            title: t('checkout.title'),
            headerBackTitle: t('common.back'),
            presentation: 'card',
          }}
        />

        <Stack.Screen
          name="OrderTracking"
          component={OrderTrackingScreen}
          options={({ route }) => ({
            title: t('tracking.title'),
            headerBackTitle: t('common.back'),
            presentation: 'card',
          })}
        />

        <Stack.Screen
          name="AdvancedSearch"
          component={AdvancedSearchScreen}
          options={{
            title: t('search.advanced'),
            headerBackTitle: t('common.back'),
            presentation: 'modal',
          }}
        />

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: t('settings.title'),
            headerBackTitle: t('common.back'),
            presentation: 'card',
          }}
        />

        {/* Error Screens */}
        <Stack.Group
          screenOptions={{
            presentation: 'modal',
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="NoInternet"
            component={NoInternetScreen}
          />

          <Stack.Screen
            name="NoProducts"
            component={NoProductsScreen}
          />

          <Stack.Screen
            name="PaymentError"
            component={PaymentErrorScreen}
          />
        </Stack.Group>

        {/* Other Screens */}
        <Stack.Group
          screenOptions={{
            presentation: 'card',
          }}
        >
          <Stack.Screen
            name="Support"
            component={SupportScreen}
            options={{
              title: t('support.title'),
              presentation: 'card',
            }}
          />

          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{
              title: t('payment.title'),
              presentation: 'card',
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;