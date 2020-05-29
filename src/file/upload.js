const axios = require('axios');
const { api } = require('../utils');
const { getFormData } = require('../utils/get-form-data');
const { getFileInfo } = require('../utils/get-file-info');
const { wrapper } = require('../wrapper');

async function requestUpload(path, params) {
  const data = await api(
    { method: 'post', url: '/file/request-upload' },
    {
      ...params,
      path,
    }
  );
  if (!data.signature) {
    throw new Error('Upload request failed');
  }
  return data;
}

module.exports.upload = wrapper(async function upload(file, options = {}) {
  if (!file) {
    throw new Error('`file` is missing');
  }

  // set default path
  const { path = '/' } = options;

  const fileInfo = await getFileInfo(file, path);
  const { file: createdFile, signature } = await requestUpload(path, fileInfo);

  // prepare the payload to send to the s3 bucket
  const form = getFormData(signature.fields, file, createdFile);

  const { data, headers } = await axios.post(signature.url, form, {
    headers: {
      ...form.getHeaders(),
      'Content-Length': form.getLengthSync(),
    },
  });

  let etag;
  if (headers.etag) {
    // prod
    etag = headers.etag.replace(/"/g, '');
  } else {
    // local
    const matched = data.match(/(?<=<Etag>)(.*)(?=<\/Etag>)/);
    // eslint-disable-next-line no-unneeded-ternary
    [etag] = matched ? matched : [];
  }

  return {
    ...createdFile,
    etag,
  };
});
