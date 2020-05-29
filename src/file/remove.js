const { api } = require('../utils');
const { wrapper } = require('../wrapper');

module.exports.remove = wrapper(async function remove(_id) {
  if (!_id) {
    throw new Error('`_id` is missing');
  }

  const { deleted } = await api({ url: '/file/remove', method: 'delete' }, { _id });

  return {
    deleted,
  };
});
