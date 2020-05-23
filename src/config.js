const pkg = require('../package.json');

let config = {
  token: '',
  teamId: '',
  version: pkg.version,
  domain: 'https://api.alpha.tech',
};

module.exports.setConfig = function setConfig(options = {}) {
  config = {
    ...config,
    ...options,
  };
};

module.exports.getConfig = function getConfig() {
  return config;
};
