const { api } = require('../utils');
const { wrapper } = require('../wrapper');

module.exports.makePdf = wrapper(async function makePdf(content, options = {}) {
  const { path } = options;

  const { body } = await api.post('/pdf/make', {
    json: {
      path,
      content,
    },
    responseType: 'json',
  });

  return body;
});
