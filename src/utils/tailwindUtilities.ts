// Minimal tailwind utilities for tailwind-rn
// This is a workaround for tailwind-rn compatibility with Expo Web

const tailwindClassMap: Record<string, Record<string, any>> = {
  // Margin classes
  'mb-4': { marginBottom: 16 },
  'mb-2': { marginBottom: 8 },
  'mb-6': { marginBottom: 24 },
  'mt-4': { marginTop: 16 },
  'mt-2': { marginTop: 8 },
  'mt-6': { marginTop: 24 },
  'mx-4': { marginHorizontal: 16 },
  'my-4': { marginVertical: 16 },
  'mr-3': { marginRight: 12 },
  'ml-3': { marginLeft: 12 },
  'm-0': { margin: 0 },
  
  // Padding classes
  'p-4': { padding: 16 },
  'p-2': { padding: 8 },
  'p-6': { padding: 24 },
  'px-4': { paddingHorizontal: 16 },
  'py-2': { paddingVertical: 8 },
  'py-4': { paddingVertical: 16 },
  
  // Display classes
  'flex': { display: 'flex' },
  'flex-row': { flexDirection: 'row' },
  'flex-col': { flexDirection: 'column' },
  'items-center': { alignItems: 'center' },
  'justify-center': { justifyContent: 'center' },
  
  // Width/Height
  'w-full': { width: '100%' },
  'h-full': { height: '100%' },
  'w-1/2': { width: '50%' },
};

class TailwindFunction {
  [key: string]: any;

  constructor() {
    return new Proxy(this, {
      apply: (target, thisArg, args) => {
        const classes = args[0] as string;
        if (typeof classes === 'string') {
          return this.parseClasses(classes);
        }
        return {};
      },
      get: (target, prop) => {
        if (prop === 'constructor') {
          return target.constructor;
        }
        // Return empty style object for unknown properties
        return {};
      },
    });
  }

  parseClasses(classes: string): Record<string, any> {
    const classArray = classes.split(' ').filter(Boolean);
    const styles: Record<string, any> = {};
    
    classArray.forEach(cls => {
      const style = tailwindClassMap[cls];
      if (style) {
        Object.assign(styles, style);
      }
    });
    
    return styles;
  }
}

// Create a callable object that can be used like tailwind('mb-4')
export const tailwindFunction = ((classes: string) => {
  const tailwindClassMap: Record<string, Record<string, any>> = {
    // Margin classes
    'mb-4': { marginBottom: 16 },
    'mb-2': { marginBottom: 8 },
    'mb-6': { marginBottom: 24 },
    'mt-4': { marginTop: 16 },
    'mt-2': { marginTop: 8 },
    'mt-6': { marginTop: 24 },
    'mx-4': { marginHorizontal: 16 },
    'my-4': { marginVertical: 16 },
    'mr-3': { marginRight: 12 },
    'ml-3': { marginLeft: 12 },
    'm-0': { margin: 0 },
    
    // Padding classes
    'p-4': { padding: 16 },
    'p-2': { padding: 8 },
    'p-6': { padding: 24 },
    'px-4': { paddingHorizontal: 16 },
    'py-2': { paddingVertical: 8 },
    'py-4': { paddingVertical: 16 },
    
    // Display classes
    'flex': { display: 'flex' },
    'flex-row': { flexDirection: 'row' },
    'flex-col': { flexDirection: 'column' },
    'items-center': { alignItems: 'center' },
    'justify-center': { justifyContent: 'center' },
    
    // Width/Height
    'w-full': { width: '100%' },
    'h-full': { height: '100%' },
    'w-1/2': { width: '50%' },
  };
  
  const classArray = classes.split(' ').filter(Boolean);
  const styles: Record<string, any> = {};
  
  classArray.forEach(cls => {
    const style = tailwindClassMap[cls];
    if (style) {
      Object.assign(styles, style);
    }
  });
  
  return styles;
}) as any;

// Make it work as a callable object
Object.setPrototypeOf(tailwindFunction, Function.prototype);

export const utilities = tailwindFunction;

export default utilities;


