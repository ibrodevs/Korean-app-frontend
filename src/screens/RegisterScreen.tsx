import React from 'react';
import { View, Text } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTheme } from '../contexts/ThemeContext';

const ProfileScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { theme } = useTheme();

  return (
    <View style={[tailwind('flex-1 justify-center items-center'), { backgroundColor: theme.background }]}>
      <Text style={{ color: theme.text }}>Profile Screen</Text>
    </View>
  );
};

export default ProfileScreen;