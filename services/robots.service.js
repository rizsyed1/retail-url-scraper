'use scrict'; 

const request = require('request');
const log = require('debug')('services:robotstxt');
const util = require('util');

const requestRobotsTxtFiles = (url) => {
  const robotTxtFileUrl = `https://${url}/robots.txt`;
    return new Promise((resolve, reject) => {
      request(robotTxtFileUrl, (err, res, body) => {
        const disallowDict = {}
        if (err) reject(err);  
        const urlArr = body.split(/\s+/).filter(bodyVal => /^https:.*(xml.gz)$/.test(bodyVal) | /^https:.*(xml)$/.test(bodyVal));
        body.split(/\s+/)
          .filter( (bodyVal, i, arr) => arr[i - 1] === 'Disallow:')
          .forEach(disallowVal => disallowDict[disallowVal] = true);
        log(`disallowDict: ${util.inspect(disallowDict)}`);
        resolve([urlArr, disallowDict]);
      });
    });
};

module.exports = requestRobotsTxtFiles;
