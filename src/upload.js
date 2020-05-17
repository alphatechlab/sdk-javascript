const got = require('got');
const { requestUpload, getFormData } = require('./storage');
const { getFileInfo } = require('./utils/get-file-info');
const { wrapper } = require('./wrapper');

module.exports.upload = wrapper(async function upload(file, options = {}) {
  if (!file) {
    throw new Error('`file` is missing');
  }
  if (!options.path) {
    throw new Error('`path` is missing');
  }

  const fileInfo = await getFileInfo(file, options.path);

  const { file: createdFile, signature } = await requestUpload(options.path, fileInfo);

  const form = getFormData(file, signature.fields);

  await got.post(signature.url, {
    body: form,
  });

  return createdFile;
});
