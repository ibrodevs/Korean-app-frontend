import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
  labelComponent?: React.ReactNode;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  label,
  labelComponent,
}) => {
  const tailwind = useTailwind();
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={tailwind('flex-row items-center')}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      {/* Checkbox */}
      <View
        style={[
          styles.checkbox,
          {
            borderColor: checked ? theme.primary : theme.border,
            backgroundColor: checked ? theme.primary : 'transparent',
          },
        ]}
      >
        {checked && (
          <Ionicons
            name="checkmark"
            size={16}
            color={theme.heading}
          />
        )}
      </View>

      {/* Label */}
      <View style={tailwind('ml-3')}>
        {labelComponent ? (
          labelComponent
        ) : (
          <Text
            style={[
              styles.checkboxLabel,
              { color: theme.textSecondary },
            ]}
          >
            {label}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
});

export default Checkbox;