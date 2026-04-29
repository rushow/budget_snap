const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Block macOS resource-fork files (._filename) that APFS silently creates.
// Metro tries to parse them as JS and throws SyntaxError without this guard.
const existing = config.resolver.blockList;
const macOSFork = /.*\/\._[^/]*$/;

if (!existing) {
  config.resolver.blockList = macOSFork;
} else if (existing instanceof RegExp) {
  config.resolver.blockList = new RegExp(
    `${existing.source}|${macOSFork.source}`
  );
} else if (Array.isArray(existing)) {
  config.resolver.blockList = [...existing, macOSFork];
}

module.exports = config;
