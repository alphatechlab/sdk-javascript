const pkg = require('../package.json');

let config = {
  token: '',
  teamId: '',
  version: pkg.version,
  domain: 'https://dev-api.alpha.tech',
  // domain: 'http://localhost:3000/dev',
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
