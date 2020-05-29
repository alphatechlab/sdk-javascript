const { api } = require('../utils');
const { wrapper } = require('../wrapper');

module.exports.create = wrapper(async function create(content, params = {}) {
  const data = await api(
    { url: '/pdf/make', method: 'post' },
    {
      ...params,
      content,
    }
  );

  return data;
});
