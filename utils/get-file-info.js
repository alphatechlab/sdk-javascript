const fs = require("fs");
const FileType = require("file-type");
const mime = require("mime");
const getDimensions = require("./get-dimensions");

module.exports = async function getFileInfo(file, path) {
  let contentLength = 0;
  let contentType = "application/octet-stream";
  let metadata = {};

  try {
    let buffer;
    if (typeof file === "string") {
      buffer = await fs.promises.readFile(file);
    } else {
      buffer = file;
    }

    contentLength = buffer.byteLength;

    const fileType = await FileType.fromBuffer(buffer);
    if (fileType) {
      // contentType based on the data of the buffer
      contentType = fileType.mime || contentType;
    } else {
      // contentType based on the extension
      contentType = mime.getType(path) || contentType;
    }

    if (contentType.indexOf("image/") === 0) {
      metadata = {
        ...getDimensions(buffer),
      };
    }
  } catch (err) {
    console.log({ err });
  } finally {
    return {
      contentLength,
      contentType,
      metadata,
    };
  }
};
