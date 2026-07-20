const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [
  /\.opencode\/.*/,
  /\.agents\/.*/,
];

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
