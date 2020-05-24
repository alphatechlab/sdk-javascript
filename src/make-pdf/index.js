const { api } = require('../utils');
const { wrapper } = require('../wrapper');

module.exports.makePdf = wrapper(async function makePdf(content, params = {}) {
  const { data } = await api.post('/pdf/make', {
    ...params,
    content,
  });

  return data;
});
