import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types/navigation';

type SplashNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

interface SplashScreenProps {
  onFinish?: () => Promise<void> | void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<SplashNavigationProp>();
  const hasNavigated = useRef(false);

  useEffect(() => {
    const initializeApp = async () => {
      // Предотвращаем двойную навигацию
      if (hasNavigated.current) {
        return;
      }

      try {
        // Минимальная задержка для инициализации (200ms)
        await new Promise(resolve => setTimeout(resolve, 200));
        
        hasNavigated.current = true;
        
        if (typeof onFinish === 'function') {
          const result = onFinish();
          if (result instanceof Promise) {
            await result;
          }
        }

        // Переходим на главный экран
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } catch (error) {
        console.error('Initialization error:', error);
        hasNavigated.current = true;
        
        // Даже при ошибке переходим на главный экран
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    };

    initializeApp();
  }, [navigation]);

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