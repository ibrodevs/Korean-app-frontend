const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyDisableDefaultRootMode: true,
    },
  }, argv);

  // Add alias configuration
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, 'src'),
    // Fix Text constructor conflicts on web
    'react-native$': 'react-native-web',
  };

  // Add custom loader for handling buffer issues
  config.module.rules.unshift({
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
      },
    },
  });

  // Suppress source-map-loader warnings for node_modules
  config.module.rules.push({
    test: /\.js$/,
    enforce: 'pre',
    use: ['source-map-loader'],
    exclude: [
      // Exclude problematic packages
      /node_modules\/@react-native-community\/hooks/,
      /node_modules\/react-native/,
      /node_modules\/@expo/,
    ],
  });

  // Filter out existing source-map-loader rules that cause issues
  config.module.rules = config.module.rules.filter((rule, index) => {
    // Skip if it's our custom rule at the beginning
    if (index === 0) return true;
    
    if (rule.use && Array.isArray(rule.use)) {
      return !rule.use.some(loader => 
        typeof loader === 'string' && loader.includes('source-map-loader')
      );
    }
    return true;
  });

  // Handle different asset types with proper MIME handling
  config.module.rules.push({
    test: /\.(png|jpg|jpeg|gif|webp)$/i,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 8192,
      },
    },
    generator: {
      filename: 'images/[hash][ext][query]',
    },
  });

  config.module.rules.push({
    test: /\.svg$/i,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 8192,
      },
    },
    generator: {
      filename: 'images/[hash][ext][query]',
    },
  });

  config.module.rules.push({
    test: /\.(woff|woff2|ttf|eot|otf)$/i,
    type: 'asset/resource',
    generator: {
      filename: 'fonts/[hash][ext][query]',
    },
  });

  config.module.rules.push({
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
    type: 'asset/resource',
    generator: {
      filename: 'media/[hash][ext][query]',
    },
  });

  // Add fallback for node modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": false,
    "stream": false,
    "buffer": false,
    "path": false,
    "fs": false,
  };

  // Ignore warnings including MIME and source map issues
  config.ignoreWarnings = [
    /Failed to parse source map/,
    /source-map-loader/,
    /Can't resolve.*in.*node_modules/,
    /Could not find MIME for Buffer/,
    /MIME.*Buffer/,
  ];

  // Add performance hints to avoid warnings
  config.performance = {
    ...config.performance,
    hints: false,
  };

  // Add web-specific optimizations
  if (env.platform === 'web') {
    // Ensure proper handling of React Native components on web
    config.resolve.alias['react-native-vector-icons'] = '@expo/vector-icons';
  }

  return config;
};