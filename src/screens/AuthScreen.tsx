import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AuthScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={[
      tailwind('flex-1 justify-center items-center'),
      { backgroundColor: theme.background }
    ]}>
      <Text style={[{ color: theme.text }, tailwind('text-2xl mb-4')]}>
        Auth Screen
      </Text>
      <TouchableOpacity
        style={[
          tailwind('px-6 py-3 rounded-lg'),
          { backgroundColor: theme.primary }
        ]}
        onPress={() => navigation.replace('Main')}
      >
        <Text style={[{ color: theme.heading }, tailwind('text-lg font-semibold')]}>
          Go to Main
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;