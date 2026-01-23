module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo'
    ],
    plugins: [
      'react-native-reanimated/plugin',
      ['module-resolver', {
        root: ['./'],
        alias: {
          '@': './src',
          'react-native': 'react-native-web',
        },
        extensions: [
          '.web.tsx', '.web.ts', '.web.js', '.web.jsx',
          '.tsx', '.ts', '.js', '.jsx', '.json'
        ]
      }],
    ],
    env: {
      web: {
        plugins: [
          ['module-resolver', {
            alias: {
              'react-native': 'react-native-web',
            }
          }]
        ]
      }
    }
  };
};