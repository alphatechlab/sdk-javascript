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
        err.message = `[alphatech] ${err.response.body.error}`;
      } else {
        err.message = `[alphatech] ${err.message}`;
      }
      throw err;
    }
  };
};
