import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius } from '../constants/theme';
import { MainTabScreenProps } from '../navigation/types';

type ProfileScreenProps = MainTabScreenProps<'Profile'>;

interface MenuOption {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: () => void;
  rightElement?: React.ReactNode;
}

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenProps['navigation']>();
  const { t } = useTranslation();
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  
  const [userInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+82 10-1234-5678',
    avatar: null,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.heading,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xl,
      paddingTop: (StatusBar.currentHeight || 0) + Spacing.lg,
    },
    headerTitle: {
      ...Typography.h2,
      color: '#FFFFFF',
      fontWeight: 'bold',
      marginBottom: Spacing.lg,
    },
    profileCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.lg,
    },
    avatarText: {
      ...Typography.h1,
      color: theme.heading,
      fontWeight: 'bold',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      ...Typography.h3,
      color: '#FFFFFF',
      fontWeight: 'bold',
      marginBottom: Spacing.xs,
    },
    userEmail: {
      ...Typography.body,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: Spacing.xs,
    },
    userPhone: {
      ...Typography.body,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    content: {
      flex: 1,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.lg,
    },
    section: {
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      ...Typography.h3,
      color: theme.text,
      fontWeight: 'bold',
      marginBottom: Spacing.md,
    },
    menuOption: {
      backgroundColor: theme.card,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      marginBottom: Spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    menuOptionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuIcon: {
      marginRight: Spacing.md,
    },
    menuTitle: {
      ...Typography.body,
      color: theme.text,
      fontWeight: '500',
    },
    menuArrow: {
      marginLeft: Spacing.md,
    },
    themeSelector: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    themeOption: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
      marginLeft: Spacing.sm,
    },
    themeOptionActive: {
      backgroundColor: theme.primary,
    },
    themeOptionText: {
      ...Typography.caption,
      color: theme.text,
      fontWeight: '500',
    },
    themeOptionTextActive: {
      color: theme.heading,
    },
    logoutOption: {
      backgroundColor: theme.error,
    },
    logoutText: {
      color: '#FFFFFF',
    },
  });

  const handleLogout = async () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirmation'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userEmail');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const handleThemeChange = (isDark: boolean) => {
    setTheme(isDark);
  };

  const accountOptions: MenuOption[] = [
    {
      id: 'edit-profile',
      title: t('profile.editProfile'),
      icon: 'person-outline',
      action: () => console.log('Edit profile'),
    },
    {
      id: 'my-orders',
      title: t('profile.myOrders'),
      icon: 'receipt-outline',
      action: () => navigation.navigate('Orders'),
    },
    {
      id: 'addresses',
      title: t('profile.addresses'),
      icon: 'location-outline',
      action: () => console.log('Manage addresses'),
    },
    {
      id: 'payment-methods',
      title: t('profile.paymentMethods'),
      icon: 'card-outline',
      action: () => console.log('Payment methods'),
    },
  ];

  const appOptions: MenuOption[] = [
    {
      id: 'theme',
      title: t('settings.theme'),
      icon: 'color-palette-outline',
      action: () => {},
      rightElement: (
        <View style={styles.themeSelector}>
          {(['light', 'dark'] as const).map((themeOption) => (
            <TouchableOpacity
              key={themeOption}
              style={[
                styles.themeOption,
                (themeOption === 'light' && !isDark) || (themeOption === 'dark' && isDark) ? styles.themeOptionActive : null,
              ]}
              onPress={() => handleThemeChange(themeOption === 'dark')}
            >
              <Text
                style={[
                  styles.themeOptionText,
                  (themeOption === 'light' && !isDark) || (themeOption === 'dark' && isDark) ? styles.themeOptionTextActive : null,
                ]}
              >
                {t(`settings.themeOptions.${themeOption}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ),
    },
    {
      id: 'language',
      title: t('settings.language'),
      icon: 'language-outline',
      action: () => navigation.navigate('Settings'),
    },
    {
      id: 'notifications',
      title: t('settings.notifications'),
      icon: 'notifications-outline',
      action: () => console.log('Notifications'),
    },
  ];

  const supportOptions: MenuOption[] = [
    {
      id: 'help',
      title: t('profile.help'),
      icon: 'help-circle-outline',
      action: () => console.log('Help'),
    },
    {
      id: 'contact',
      title: t('profile.contact'),
      icon: 'mail-outline',
      action: () => console.log('Contact'),
    },
    {
      id: 'about',
      title: t('profile.about'),
      icon: 'information-circle-outline',
      action: () => console.log('About'),
    },
    {
      id: 'privacy',
      title: t('settings.privacy'),
      icon: 'shield-outline',
      action: () => console.log('Privacy'),
    },
  ];

  const renderMenuOption = (option: MenuOption, isLogout = false) => (
    <TouchableOpacity
      key={option.id}
      style={[styles.menuOption, isLogout && styles.logoutOption]}
      onPress={option.action}
    >
      <View style={styles.menuOptionLeft}>
        <Ionicons
          name={option.icon}
          size={24}
          color={isLogout ? '#FFFFFF' : theme.text}
          style={styles.menuIcon}
        />
        <Text style={[styles.menuTitle, isLogout && styles.logoutText]}>
          {option.title}
        </Text>
      </View>
      
      {option.rightElement ? (
        option.rightElement
      ) : (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isLogout ? '#FFFFFF' : theme.textSecondary}
          style={styles.menuArrow}
        />
      )}
    </TouchableOpacity>
  );

  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.heading} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
        
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getUserInitials(userInfo.name)}
            </Text>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userEmail}>{userInfo.email}</Text>
            <Text style={styles.userPhone}>{userInfo.phone}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.account')}</Text>
          {accountOptions.map(option => renderMenuOption(option))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.preferences')}</Text>
          {appOptions.map(option => renderMenuOption(option))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.support')}</Text>
          {supportOptions.map(option => renderMenuOption(option))}
        </View>

        <View style={styles.section}>
          {renderMenuOption({
            id: 'logout',
            title: t('profile.logout'),
            icon: 'log-out-outline',
            action: handleLogout,
          }, true)}
        </View>
      </ScrollView>
    </View>
  );
}