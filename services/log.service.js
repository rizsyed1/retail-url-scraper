const debug = require('debug');

debug.enable(process.env.DEBUG);

module.exports = nameSpace => {
    return debug(`scraper-${nameSpace}`);
}