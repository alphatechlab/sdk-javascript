const axios = require('axios');
const { getConfig } = require('../config');

module.exports.api = async function api(request, params = {}) {
  const { url, method } = request;
  const { domain, version, token, teamId } = getConfig();

  return (
    await axios({
      url: `${domain}${url}`,
      method,
      data: {
        ...params,
      },
      headers: {
        'x-alphatech-javascript-version': version,
        authorization: `Bearer ${token}.${teamId}`,
      },
    })
  ).data;
};
