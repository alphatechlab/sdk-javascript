const fs = require("fs");
const got = require("got");
const FormData = require("form-data");
const package = require("./package.json");
const getFileInfo = require("./utils/get-file-info");

const alphatech = {};

alphatech.configure = function (config = {}) {
  alphatech.config = {
    ...config,
    domain: `https://dev-api.alpha.tech`,
    // domain: `http://localhost:3000/dev`,
  };
};

alphatech.storage = { files: {} };
alphatech.storage.files._requestUpload = async function (path, json) {
  const { body } = await got.post(
    `${alphatech.config.domain}/storage/files/request-upload`,
    {
      json: {
        path,
        ...json,
      },
      responseType: "json",
      headers: {
        "x-alphatech-javascript-version": package.version,
        authorization: `Bearer ${alphatech.config.token}.${alphatech.config.teamId}`,
      },
    }
  );

  if (!body.url) {
    throw new Error("[alphatech] Upload request failed");
  }

  return body;
};

alphatech.storage.files._getFormData = function (file, fields = {}) {
  const form = new FormData();

  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }

  form.append(
    "file",
    typeof file === "string" ? fs.createReadStream(file) : file
  );

  return form;
};
alphatech.storage.files.upload = async function (file, options = {}) {
  try {
    if (!alphatech.config) {
      throw new Error("[alphatech] Not configured");
    }
    if (!file) {
      throw new Error("[alphatech] `file` is missing");
    }
    if (!options.path) {
      throw new Error("[alphatech] `path` is missing");
    }

    const {
      contentLength,
      contentType,
      metadata: metadataToSend,
    } = await getFileInfo(file, options.path);

    const {
      url,
      metadata,
      signature,
    } = await alphatech.storage.files._requestUpload(options.path, {
      contentLength,
      contentType,
      metadata: metadataToSend,
    });

    console.log(Object.keys(signature.fields));

    const form = alphatech.storage.files._getFormData(file, signature.fields);

    await got.post(signature.url, {
      body: form,
    });

    return {
      // need ObjectId and other data...
      url,
      size: contentLength,
      type: contentType,
      // md5: contentMd5,
      metadata,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = alphatech;
