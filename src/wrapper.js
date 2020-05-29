const { getConfig } = require('./config');

module.exports.wrapper = function wrapper(func) {
  return async (...args) => {
    try {
      const { token, teamId } = getConfig();
      if (!token && !teamId) {
        throw new Error('Not configured');
      }
      return await func(...args);
    } catch (err) {
      if (err.response && err.response.data) {
        err.message = `[alphatech] ${err.response.status} ${
          err.response.data.error || err.response.data.message || err.response.statusText
        }`;
      } else {
        err.message = `[alphatech] ${err.message}`;
      }
      throw err;
    }
  };
};
