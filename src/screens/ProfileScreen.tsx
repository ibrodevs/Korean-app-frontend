import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { useTailwind } from '../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProfileHeader from '../components/profile/ProfileHeader';
import MenuItem from '../components/profile/MenuItem';
import SettingItem from '../components/profile/SettingItem';
import Text from '../components/Text';

import {
  UserProfile,
  UserPreferences,
} from '../types/profile';

import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

const ProfileScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  // Мок-данные для профиля
  const mockProfile: UserProfile = {
    id: '1',
    avatar: 'https://picsum.photos/100/100?random=6',
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    emailVerified: true,
    phoneVerified: false,
    memberSince: '2023-01-01',
    tier: 'premium',
    loyaltyPoints: 1250,
    stats: {
      totalOrders: 15,
      totalSpent: 489.99,
      wishlistItems: 12,
      reviewsCount: 8,
      savedAddresses: 2,
      savedPaymentMethods: 3,
    },
    preferences: {
      language: 'en',
      theme: 'light',
      notifications: {
        pushEnabled: true,
        emailEnabled: true,
        smsEnabled: false,
        orderUpdates: true,
        promotions: true,
        priceDrops: true,
        newArrivals: false,
        restockNotifications: true,
      },
      privacy: {
        showActivity: true,
        showWishlist: true,
        personalizedAds: true,
        dataCollection: false,
      },
    },
  };

  const mockPreferences: UserPreferences = {
    language: 'en',
    theme: 'light',
    notifications: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      orderUpdates: true,
      promotions: true,
      priceDrops: true,
      newArrivals: false,
      restockNotifications: true,
    },
    privacy: {
      showActivity: true,
      showWishlist: true,
      personalizedAds: true,
      dataCollection: false,
    },
  };

  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [preferences, setPreferences] = useState<UserPreferences>(mockPreferences);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Загрузка настроек
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('userTheme');
      const savedLang = await AsyncStorage.getItem('userLanguage');
      const savedNotifications = await AsyncStorage.getItem('notificationsEnabled');

      if (savedTheme) {
        setTheme(savedTheme as any);
        setPreferences(prev => ({
          ...prev,
          theme: savedTheme as any,
        }));
      }

      if (savedLang && savedLang !== i18n.language) {
        i18n.changeLanguage(savedLang);
        setPreferences(prev => ({
          ...prev,
          language: savedLang,
        }));
      }

      if (savedNotifications !== null) {
        const enabled = savedNotifications === 'true';
        setNotificationsEnabled(enabled);
        setPreferences(prev => ({
          ...prev,
          notifications: {
            ...prev.notifications,
            pushEnabled: enabled,
          },
        }));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Для навигации:
  const handleViewOrders = () => {
    // navigation.navigate('Orders');
  };
  
  const handleGoToSettings = () => {
    navigation.navigate('Settings', { screen: 'SettingsMain' }); // Отдельный экран в RootNavigator
  };
  
  const handleViewOrderDetails = (orderId: string) => {
    navigation.navigate('OrderTracking', { orderId });
  };

  // Обработчики
  const handleEditProfile = (updatedProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
  };

  const handleViewWishlist = () => {
    // navigation.navigate('Wishlist');
  };

  const handleAddresses = () => {
    navigation.navigate('Addresses' as never);
  };

  const handlePaymentMethods = () => {
    navigation.navigate('PaymentMethods' as never);
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications' as never);
  };

  const handleSettings = () => {
  navigation.navigate('Settings', { screen: 'SettingsMain' });
};

  const handleLanguage = () => {
    Alert.alert(
      t('profile.language'),
      t('profile.selectLanguage'),
      [
        { text: 'English', onPress: () => changeLanguage('en') },
        { text: 'Русский', onPress: () => changeLanguage('ru') },
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem('userLanguage', lang);
      setPreferences(prev => ({
        ...prev,
        language: lang,
      }));
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const handleTheme = () => {
    Alert.alert(
      t('profile.theme'),
      t('profile.selectTheme'),
      [
        { text: t('theme.light'), onPress: () => changeTheme('light') },
        { text: t('theme.dark'), onPress: () => changeTheme('dark') },
        { text: t('theme.auto'), onPress: () => changeTheme('auto') },
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  const changeTheme = async (newTheme: string) => {
    try {
      setTheme(newTheme as any);
      await AsyncStorage.setItem('userTheme', newTheme);
      setPreferences(prev => ({
        ...prev,
        theme: newTheme as any,
      }));
    } catch (error) {
      console.error('Error changing theme:', error);
    }
  };

  const handleHelp = () => {
    navigation.navigate('Support' as never);
  };

  const handleAbout = () => {
    Alert.alert(
      'KoreanStore',
      'Version 1.0.0\n\nKoreanStore - Your gateway to authentic Korean products.\n\n© 2024 KoreanStore. All rights reserved.',
      [{ text: t('common.ok') }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('logout.title'),
      t('logout.message'),
      [
        { text: t('logout.cancel'), style: 'cancel' },
        {
          text: t('logout.confirm'),
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    );
  };

  const performLogout = () => {
    // Здесь будет логика выхода
    Alert.alert(t('common.success'), t('logout.success'));
    // navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem('notificationsEnabled', value.toString());
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        pushEnabled: value,
      },
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      t('settings.clearCache'),
      t('settings.clearCacheConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: () => {
            // Логика очистки кэша
            Alert.alert(t('common.success'), t('settings.cacheCleared'));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Заголовок профиля */}
        <ProfileHeader
          profile={profile}
          onEditProfile={handleEditProfile}
          onViewOrders={handleViewOrders}
          onViewWishlist={handleViewWishlist}
        />

        {/* Основные разделы */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.heading }]}>
            {t('profile.account')}
          </Text>

          <MenuItem
            icon="settings-outline"
            title={t('profile.settings')}
            onPress={() => navigation.navigate('Settings', { screen: 'SettingsMain' })}
            showChevron
          />
          
          <MenuItem
            icon="cart-outline"
            title={t('profile.orders')}
            badge={profile.stats.totalOrders}
            onPress={handleViewOrders}
          />
          
          <MenuItem
            icon="heart-outline"
            title={t('profile.wishlist')}
            badge={profile.stats.wishlistItems}
            onPress={handleViewWishlist}
          />
          
          <MenuItem
            icon="location-outline"
            title={t('profile.addresses')}
            badge={profile.stats.savedAddresses}
            onPress={handleAddresses}
          />
          
          <MenuItem
            icon="card-outline"
            title={t('profile.paymentMethods')}
            badge={profile.stats.savedPaymentMethods}
            onPress={handlePaymentMethods}
          />
        </View>

        {/* Настройки */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.heading }]}>
            {t('profile.preferences')}
          </Text>
          
          <SettingItem
            title={t('settings.notificationSettings')}
            description={t('settings.notificationDescription')}
            type="switch"
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
          />
          
          <SettingItem
            title={t('profile.language')}
            description={t('profile.languageDescription')}
            type="select"
            selectedValue={preferences.language === 'en' ? 'English' : 'Русский'}
            onPress={handleLanguage}
          />
          
          <SettingItem
            title={t('profile.theme')}
            description={t('profile.themeDescription')}
            type="select"
            selectedValue={
              preferences.theme === 'light' ? t('theme.light') :
              preferences.theme === 'dark' ? t('theme.dark') :
              t('theme.auto')
            }
            onPress={handleTheme}
          />
          
          <SettingItem
            title={t('settings.clearCache')}
            description={t('settings.clearCacheDescription')}
            type="button"
            icon="trash-outline"
            onPress={handleClearCache}
          />
        </View>

        {/* Поддержка */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.heading }]}>
            {t('profile.help')}
          </Text>
          
          <MenuItem
            icon="help-circle-outline"
            title={t('support.faq')}
            onPress={() => Linking.openURL('https://koreanstore.com/faq')}
          />
          
          <MenuItem
            icon="chatbubble-outline"
            title={t('support.liveChat')}
            onPress={() => Linking.openURL('https://koreanstore.com/chat')}
          />
          
          <MenuItem
            icon="mail-outline"
            title={t('support.contact')}
            onPress={() => Linking.openURL('mailto:support@koreanstore.com')}
          />
          
          <MenuItem
            icon="information-circle-outline"
            title={t('profile.about')}
            onPress={handleAbout}
          />
        </View>

        {/* Выход */}
        <View style={styles.section}>
          <MenuItem
            icon="log-out-outline"
            title={t('profile.logout')}
            danger
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 20,
    marginBottom: 12,
  },
});

export default ProfileScreen;