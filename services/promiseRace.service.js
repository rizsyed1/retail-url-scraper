/** @format */

const log = require("./log.service")("services:promiseRace");

const timeOutRejectSeconds = (seconds, message) => {
    return new Promise((_, reject) => {
        setTimeout(() => reject(message), seconds);
    });
};

const promiseTimeOut = (promise, seconds, message) => {
    return Promise.race([promise, timeOutRejectSeconds(seconds, message)]);
};

module.exports = promiseTimeOut;
