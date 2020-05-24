const { api } = require('../utils');

module.exports.requestUpload = async function requestUpload(path, params) {
  const { data } = await api.post('/file/request-upload', {
    ...params,
    path,
  });

  if (!data.signature) {
    throw new Error('Upload request failed');
  }

  return data;
};
