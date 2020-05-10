const fs = require("fs");
const got = require("got");
const FormData = require("form-data");
const package = require("./package.json");

const alphatech = {};

alphatech.configure = function (config = {}) {
  alphatech.config = {
    ...config,
    domain: `https://dev-api.alpha.tech`,
  };
};
8;

alphatech.drive = { files: {} };
alphatech.drive.files.upload = async function (file, options = {}) {
  try {
    if (!alphatech.config) {
      throw new Error("[alphatech] Not configured");
    }
    if (!file) {
      throw new Error("[alphatech] `file` is missing");
    }

    const form = new FormData();
    if (typeof file === "string") {
      form.append("file", fs.createReadStream(file));
    } else {
      form.append("file", file);
    }

    for (const [key, value] of Object.entries(options)) {
      if (value instanceof Object) {
        form.append(key, JSON.stringify(value));
      } else {
        form.append(key, value);
      }
    }

    const response = await got
      .post(`${alphatech.config.domain}/drive/files/upload`, {
        body: form,
        headers: {
          "x-alphatech-javascript-version": package.version,
          authorization: `Bearer ${alphatech.config.token}.${alphatech.config.teamId}`,
        },
      })
      .json();

    return response;
  } catch (err) {
    throw err;
  }
};

module.exports = alphatech;
