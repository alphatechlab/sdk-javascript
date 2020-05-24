const axios = require('axios');
const { getConfig } = require('../config');

module.exports.api = {
  post: function post(url, params) {
    const { domain, version, token, teamId } = getConfig();

    return axios.post(`${domain}${url}`, params, {
      headers: {
        'x-alphatech-javascript-version': version,
        authorization: `Bearer ${token}.${teamId}`,
      },
    });
  },
};
