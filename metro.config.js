const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file types
config.resolver.assetExts.push(
  // Images
  'png',
  'jpg',
  'jpeg',
  'gif',
  'svg',
  'webp',
  // Videos
  'mp4',
  'mov',
  'avi',
  'mkv',
  'webm',
  // Audio
  'mp3',
  'wav',
  'aac',
  'ogg',
  'm4a',
  // Fonts
  'ttf',
  'otf',
  'woff',
  'woff2',
  'eot',
  // Other
  'bin',
  'txt',
  'exe',
  'apk',
  'dmg',
  'zip',
  'rar',
  '7z'
);

// Configure transformer
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: false,
  },
});

module.exports = config;