const bunyan = require('bunyan');

/**
 * configure log level and nane for logging
 */
const log = bunyan.createLogger({
    name: 'mongoDBDemo'
});

export default module.exports = log;