import React, { useEffect, useRef } from 'react';
import {
  Image,
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
import WelcomeImg from '../../assets/Welcome.png'
import BlueBg from '../../assets/Ellipse.svg'
import SplashGif from '../../assets/splash.gif'
interface SplashScreenProps {
  onFinish?: () => Promise<void> | void;
  navigation?: any; 
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, navigation }) => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  const hasNavigated = useRef(false);

  useEffect(() => {
    const initializeApp = async () => {
      if (hasNavigated.current) {
        return;
      }

      try {
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
      { backgroundColor: theme.background }
    ]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <View style={styles.blueimg}>
        <img src={BlueBg} alt="" />
      <View style={styles.appNameContainer}>
          <Text style={[
            styles.appName
          ]}>
            {t('appName')}
          </Text>
        </View>
      <View style={styles.loadingContainer}>
        <Image source={WelcomeImg} style={styles.welcomeImg} />
        </View>
      <View style={styles.loadingContainer}>
        <Image source={SplashGif} style={styles.logo} />
        </View>
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer:{
    justifyContent: 'center', 
    alignItems: 'center', 
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
    marginTop: -250,
    fontWeight: '700',
    textAlign: 'center',
    color: '#fff'
  },
  welcomeImg: {
    width: 480,
    height: 350,
    marginTop: -150
  },
  indicator: {
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  blueimg:{
    marginBottom: -150
  }
});

export default SplashScreen;