import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';

// Импорт контекстов и утилит
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import i18n from './src/i18n';
import RootNavigator from './src/navigation/RootNavigator';

const AppContent: React.FC = () => {
  const { theme, isDark } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.navBackground,
          text: theme.text,
          border: theme.border,
          notification: theme.error,
        },
      }}
    >
      <RootNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  const [i18nReady, setI18nReady] = useState(i18n.isInitialized);

  // Инициализируем i18n только если ещё не инициализирован
  useEffect(() => {
    if (!i18n.isInitialized) {
      i18n.init().then(() => setI18nReady(true)).catch(() => setI18nReady(true));
    }
  }, []);

  return (
    <SafeAreaProvider>
      {i18nReady && (
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </I18nextProvider>
      )}
    </SafeAreaProvider>
  );
}