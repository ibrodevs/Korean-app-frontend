// Common inline styles to replace tailwind-rn which is incompatible with Expo Web

export const tw = (className: string): Record<string, any> => {
  const classMap: Record<string, Record<string, any>> = {
    // Margin
    'mb-4': { marginBottom: 16 },
    'mb-2': { marginBottom: 8 },
    'mb-6': { marginBottom: 24 },
    'mt-1': { marginTop: 4 },
    'mt-2': { marginTop: 8 },
    'mt-4': { marginTop: 16 },
    'ml-3': { marginLeft: 12 },
    'mr-1': { marginRight: 4 },
    'mr-3': { marginRight: 12 },
    'mx-4': { marginHorizontal: 16 },
    // Padding
    'pl-0': { paddingLeft: 0 },
    'p-4': { padding: 16 },
    // Flex
    'flex-row': { flexDirection: 'row' },
    'flex-col': { flexDirection: 'column' },
    'items-center': { alignItems: 'center' },
    // Misc
    'm-0': { margin: 0 },
  };

  const styles: Record<string, any> = {};
  className.split(' ').forEach(cls => {
    const style = classMap[cls];
    if (style) Object.assign(styles, style);
  });
  return styles;
};
