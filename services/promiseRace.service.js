const log = require("./log.service")("services:promiseRace");

const promiseRace = (...args) => {
    return Promise.race(args)
}

module.exports = promiseRace;