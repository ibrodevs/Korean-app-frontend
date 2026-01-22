import React from 'react';
import { View, Text } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTheme } from '../contexts/ThemeContext';

const CartScreen: React.FC = () => {
  const tailwind = useTailwind();
  const { theme } = useTheme();

  return (
    <View style={[tailwind('flex-1 justify-center items-center'), { backgroundColor: theme.background }]}>
      <Text style={{ color: theme.text }}>Cart Screen</Text>
    </View>
  );
};

export default CartScreen;