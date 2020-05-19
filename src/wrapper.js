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
      if (err.response && err.response.body) {
        err.message = `[alphatech] ${err.response.statusCode} ${
          err.response.body.error || err.response.body.message || err.response.statusMessage
        }`;
      } else {
        err.message = `[alphatech] ${err.message}`;
      }
      throw err;
    }
  };
};
