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

  const form = getFormData(signature.fields, file, createdFile);

  const { body, headers } = await got.post(signature.url, {
    body: form,
  });

  let etag;
  if (headers.etag) {
    // prod
    etag = headers.etag.replace(/"/g, '');
  } else {
    // local
    const matched = body.match(/(?<=<Etag>)(.*)(?=<\/Etag>)/);
    // eslint-disable-next-line no-unneeded-ternary
    [etag] = matched ? matched : [];
  }

  return {
    ...createdFile,
    etag,
  };
});
