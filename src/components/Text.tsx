import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

// Расширяем TextProps для поддержки всех стандартных свойств
export interface CustomTextProps extends RNTextProps {
  children?: React.ReactNode;
}

// Создаем обертку над Text для корректной работы в веб-среде
const Text: React.FC<CustomTextProps> = (props) => {
  return React.createElement(RNText, props, props.children);
};

Text.displayName = 'Text';

export default Text;