const fs = require('fs');
const FormData = require('form-data');

module.exports.getFormData = function getFormData(file, fields = {}) {
  const form = new FormData();

  const keys = Object.keys(fields);
  for (let i = 0; i < keys.length; i++) {
    form.append(keys[i], fields[keys[i]]);
  }

  form.append('file', typeof file === 'string' ? fs.createReadStream(file) : file);

  return form;
};
