import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { CurrencyProvider } from './src/contexts/CurrencyContext';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import { CartProvider } from './src/contexts/CartContext';
import i18n from './src/utils/i18n';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ActionSheetProvider>
        <ThemeProvider>
          <CurrencyProvider>
            <FavoritesProvider>
              <CartProvider>
                <I18nextProvider i18n={i18n}>
                  <StatusBar style="auto" />
                  <RootNavigator />
                </I18nextProvider>
              </CartProvider>
            </FavoritesProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </ActionSheetProvider>
    </SafeAreaProvider>
  );
}