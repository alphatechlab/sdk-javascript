const FileType = require("file-type");
const getDimensions = require("./get-dimensions");

module.exports = async function getFileInfo(file) {
  let contentType;
  let contentLength;
  if (typeof file === "string") {
    contentType = (await FileType.fromFile(file)).mime;
    contentLength = (await fs.promises.stat(file)).size;
  } else {
    contentType = (await FileType.fromBuffer(file)).mime;
    contentLength = file.byteLength;
  }
  const dimensions = getDimensions(file);

  return {
    contentType,
    contentLength,
    dimensions,
  };
};
