import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '../components/Text';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const AuthScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google login
    console.log('Google login pressed');
  };

  // Для отладки - кнопка очистки storage
  const handleClearStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Storage cleared!');
      // Можно перезапустить приложение или показать алерт
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1E3A8A', '#1E40AF', '#1D4ED8']}
        style={styles.gradient}
      >
        {/* Main Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Korean Shop</Text>
          </View>

          {/* Logo/Sample Section */}
          <View style={styles.sampleSection}>
            <View style={styles.sampleContainer}>
              <Text style={styles.sampleText}>SAMPLE</Text>
              <Text style={styles.boldSampleText}>SAMPLE</Text>
              <Text style={styles.boldSampleText}>SAMPLE</Text>
            </View>
          </View>

          {/* Divider Line */}
          <View style={styles.dividerLine} />

          {/* Buttons Section */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            {/* Divider with Text */}
            <View style={styles.dividerSection}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or login with</Text>
              <View style={styles.divider} />
            </View>

            {/* Social Login Placeholder */}
            <View style={styles.socialPlaceholder}>
              <View style={styles.socialLine} />
            </View>

            {/* Debug Button - Remove in production */}
            <TouchableOpacity
              style={styles.debugButton}
              onPress={handleClearStorage}
              activeOpacity={0.7}
            >
              <Text style={styles.debugButtonText}>Clear Storage (Debug)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  sampleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sampleContainer: {
    alignItems: 'center',
  },
  sampleText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 4,
    marginBottom: 8,
  },
  boldSampleText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 4,
    marginBottom: 8,
  },
  dividerLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: '100%',
    marginVertical: 20,
  },
  buttonsContainer: {
    paddingBottom: 40,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginHorizontal: 16,
    fontWeight: '500',
  },
  socialPlaceholder: {
    alignItems: 'center',
  },
  socialLine: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  // Debug styles - remove in production
  debugButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.5)',
  },
  debugButtonText: {
    color: '#FFAAAA',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default AuthScreen;