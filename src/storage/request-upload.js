const { api } = require('../utils/api');

module.exports.requestUpload = async function requestUpload(path, json) {
  const { body } = await api.post('/storage/files/request-upload', {
    json: {
      path,
      ...json,
    },
    responseType: 'json',
  });

  if (!body.signature) {
    throw new Error('Upload request failed');
  }

  return body;
};
