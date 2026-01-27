import React, { useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Text from '../components/Text';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SplashScreenProps {
  onFinish?: () => Promise<void> | void;
  navigation?: any; // Navigation prop from React Navigation
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, navigation }) => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  const hasNavigated = useRef(false);

  useEffect(() => {
    const initializeApp = async () => {
      // Предотвращаем двойную навигацию
      if (hasNavigated.current) {
        return;
      }

      try {
        // Увеличиваем время загрузки до 3 секунд для лучшего UX
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        hasNavigated.current = true;
        
        if (typeof onFinish === 'function') {
          const result = onFinish();
          if (result instanceof Promise) {
            await result;
          }
        }
      } catch (error) {
        console.error('Splash screen initialization error:', error);
        // В случае ошибки всё равно переходим дальше
        if (typeof onFinish === 'function') {
          const result = onFinish();
          if (result instanceof Promise) {
            await result;
          }
        }
      }
    };

    initializeApp();
  }, [onFinish]);

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.background }
    ]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      
      {/* Логотип приложения */}
      <View style={styles.logoContainer}>
        <View style={[
          styles.logo,
          { backgroundColor: theme.primary }
        ]}>
          <View style={[
            styles.logoInner,
            { backgroundColor: theme.secondary }
          ]} />
        </View>
        
        {/* Название приложения */}
        <View style={styles.appNameContainer}>
          <Text style={[
            styles.appName,
            { color: theme.heading }
          ]}>
            {t('appName')}
          </Text>
        </View>
      </View>

      {/* Индикатор загрузки */}
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={styles.indicator}
        />
        
        {/* Текст загрузки */}
        <Text style={[
          styles.loadingText,
          { color: theme.textSecondary }
        ]}>
          {t('splash.loading')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  logoInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  appNameContainer: {
    marginTop: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    width: '80%',
    alignItems: 'center',
  },
  indicator: {
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

export default SplashScreen;