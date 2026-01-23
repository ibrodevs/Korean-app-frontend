import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform } from 'react-native';

// Stack Navigators
import HomeStackNavigator from './stacks/HomeStackNavigator';
import SearchStackNavigator from './stacks/SearchStackNavigator';
import OrdersStackNavigator from './stacks/OrdersStackNavigator';
import ProfileStackNavigator from './stacks/ProfileStackNavigator';
import CartStackNavigator from './stacks/CartStackNavigator';

// Types
import { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const getTabBarIcon = (routeName: string, focused: boolean, color: string, size: number) => {
    let iconName: string;
    
    switch (routeName) {
      case 'HomeTab':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'SearchTab':
        iconName = focused ? 'search' : 'search-outline';
        break;
      case 'CartTab':
        iconName = focused ? 'cart' : 'cart-outline';
        break;
      case 'OrdersTab':
        iconName = focused ? 'list' : 'list-outline';
        break;
      case 'ProfileTab':
        iconName = focused ? 'person' : 'person-outline';
        break;
      default:
        iconName = 'help-circle-outline';
    }

    return <Ionicons name={iconName as any} size={size} color={color} />;
  };

  const screenOptions = ({ route }: any) => ({
    headerShown: false,
    tabBarIcon: ({ focused, color, size }: any) =>
      getTabBarIcon(route.name, focused, color, size),
    tabBarActiveTintColor: theme.primary,
    tabBarInactiveTintColor: theme.textSecondary,
    tabBarStyle: {
      backgroundColor: theme.navBackground,
      borderTopColor: theme.border,
      height: 60,
      paddingTop: 5,
      paddingBottom: Platform.OS === 'ios' ? 20 : 5,
      elevation: 10,
      boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.1)',
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '600' as const,
      marginBottom: Platform.OS === 'ios' ? 0 : 2,
    },
    tabBarItemStyle: {
      paddingVertical: 4,
    },
    tabBarHideOnKeyboard: true,
  });

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={screenOptions}
      backBehavior="history"
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: t('navigation.home'),
        }}
      />
      
      <Tab.Screen
        name="SearchTab"
        component={SearchStackNavigator}
        options={{
          title: t('navigation.search'),
        }}
      />
      
      <Tab.Screen
        name="CartTab"
        component={CartStackNavigator}
        options={{
          title: t('navigation.cart'),
          tabBarBadge: 3,
        }}
      />
      
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStackNavigator}
        options={{
          title: t('navigation.orders'),
        }}
      />
      
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: t('navigation.profile'),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;