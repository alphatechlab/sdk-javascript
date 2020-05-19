const { api } = require('../utils');
const { wrapper } = require('../wrapper');

module.exports.getPdf = wrapper(async function getPdf(content, options = {}) {
  const { path } = options;

  const { body } = await api.post('/pdf/get', {
    json: {
      path,
      content,
    },
    responseType: 'json',
  });

  return body;
});
