const got = require('got');
const { getConfig } = require('../config');

module.exports.api = {
  post: function post(url, options) {
    const { domain, version, token, teamId } = getConfig();

    return got.post(`${domain}${url}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'x-alphatech-javascript-version': version,
        authorization: `Bearer ${token}.${teamId}`,
      },
    });
  },
};
