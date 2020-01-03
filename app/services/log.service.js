const debug = require('debug');

debug.enable(process.env.DEBUG)

module.exports = function initLog(namespace){
    return debug(`scraper-${namespace}`);
}
