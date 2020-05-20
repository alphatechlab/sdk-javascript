const { setConfig, getConfig } = require('./src/config');
const { upload } = require('./src/upload');
const { makePdf } = require('./src/make-pdf');

module.exports = {
  setConfig,
  getConfig,
  upload,
  makePdf,
};
