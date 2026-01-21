import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeProvider';
import { Typography, Spacing } from '@/constants/theme';
import { RootStackScreenProps } from '@/navigation/types';

type SplashScreenProps = RootStackScreenProps<'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<SplashScreenProps['navigation']>();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.navigation,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: Spacing.xxl,
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: Spacing.lg,
      borderRadius: 60,
      backgroundColor: colors.primary,
    },
    title: {
      ...Typography.h1,
      color: '#FFFFFF',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    subtitle: {
      ...Typography.body,
      color: colors.primary,
      textAlign: 'center',
      marginTop: Spacing.sm,
    },
    loadingContainer: {
      marginTop: Spacing.xxl,
    },
  });

  useEffect(() => {
    checkInitialRoute();
  }, []);

  const checkInitialRoute = async () => {
    try {
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if user has seen onboarding
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      
      // Check if user is logged in
      const userToken = await AsyncStorage.getItem('userToken');

      if (!hasSeenOnboarding) {
        navigation.replace('Onboarding');
      } else if (!userToken) {
        navigation.replace('Auth');
      } else {
        navigation.replace('Main');
      }
    } catch (error) {
      console.error('Error checking initial route:', error);
      navigation.replace('Onboarding');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navigation} />
      
      <View style={styles.logoContainer}>
        <View style={styles.logo} />
        <Text style={styles.title}>Korean Shop</Text>
        <Text style={styles.subtitle}>Premium Korean Products</Text>
      </View>

      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    </View>
  );
}