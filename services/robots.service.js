/** @format */

"use scrict";

const request = require("request");
const log = require("./log.service")("services:robotstxt");
const util = require("util");

const requestRobotsTxtFiles = url => {
    let requestHasFinished = false;
    return new Promise((resolve, reject) => {
        request(url, (err, res, body) => {
            const disallowDict = {};
            if (err) reject(err);
            else {
                const urlArr = body.split(/\s+/).filter(bodyVal => {
                    return (
                        /^https:.*(xml.gz)$/.test(bodyVal) ||
                        /^https:.*(xml)$/.test(bodyVal) ||
                        /^http:.*(xml.gz)$/.test(bodyVal) ||
                        /^http:.*(xml)$/.test(bodyVal)
                    );
                });
                body.split(/\s+/)
                    .filter((bodyVal, i, arr) => arr[i - 1] === "Disallow:")
                    .forEach(disallowVal => (disallowDict[disallowVal] = true));
                requestHasFinished = true;
                resolve([urlArr, disallowDict]);
            }
        });
        setTimeout(() => {
            if (!requestHasFinished) {
                reject("Website took too long to respond");
            }
        }, 10000);
    });
};

module.exports = requestRobotsTxtFiles;
