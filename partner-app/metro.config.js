const fs = require('fs');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * Release builds run from a `subst` drive (see README) to dodge Windows path
 * limits. Node resolves some packages to the real path behind that drive, so
 * Metro also watches the real project folder when the two differ.
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const realRoot = fs.realpathSync.native(__dirname);

const config = {
  watchFolders: realRoot.toLowerCase() !== __dirname.toLowerCase() ? [realRoot] : [],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
