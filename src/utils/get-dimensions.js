const sizeOf = require('image-size');

module.exports.getDimensions = function getDimensions(file) {
  try {
    const dimensions = sizeOf(file);
    return {
      width: dimensions.width,
      height: dimensions.height,
    };
  } catch (err) {
    // probably not an image
    return {};
  }
};
