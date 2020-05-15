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
  };
};

alphatech.storage = { files: {} };
alphatech.storage.files._requestUpload = async function (path, json) {
  const { body } = await got.post(
    `${alphatech.config.domain}/storage/files/request-upload`,
    {
      json: {
        path,
        contentLength: json.contentLength,
        contentType: json.contentType,
      },
      responseType: "json",
      headers: {
        "x-alphatech-javascript-version": package.version,
        authorization: `Bearer ${alphatech.config.token}.${alphatech.config.teamId}`,
      },
    }
  );

  console.log({ body });

  if (!body.url) {
    throw new Error("[alphatech] Upload request failed");
  }

  return body;
};

alphatech.storage.files._getFormData = function (
  file,
  fields = {},
  payload = {}
) {
  const form = new FormData();

  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }

  // for (const [key, value] of Object.entries(payload)) {
  //   const name = `x-amz-meta-${key.toLowerCase()}`;
  //   if (typeof value === "string") {
  //     form.append(name, value);
  //   } else {
  //     form.append(name, JSON.stringify(value));
  //   }
  // }

  if (typeof file === "string") {
    form.append("file", fs.createReadStream(file));
  } else {
    form.append("file", file);
  }

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

    options.metadata = options.metadata || {};

    const { contentType, contentLength, dimensions } = await getFileInfo(file);
    // console.log({ contentLength });
    // console.log({ contentType });
    // console.log({ dimensions });

    const signedRequest = await alphatech.storage.files._requestUpload(
      options.path,
      {
        contentLength,
        contentType,
      }
    );

    const form = alphatech.storage.files._getFormData(
      file,
      signedRequest.fields,
      {
        contentType,
        metadata: {
          ...options.metadata,
          ...dimensions,
        },
      }
    );

    console.log(Object.keys(signedRequest.fields));

    await got.post(signedRequest.url, {
      body: form,
      // headers: {
      //   "Content-Type": false,
      //   // "Content-Length": contentLength,
      // },
    });

    return signedRequest;
  } catch (err) {
    throw err;
  }
};

module.exports = alphatech;
