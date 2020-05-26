const { api } = require('../utils');
const { wrapper } = require('../wrapper');

module.exports.makePdf = wrapper(async function makePdf(doc, params = {}) {
  const { data } = await api.post('/pdf/make', {
    ...params,
    doc,
  });

  return data;
});
