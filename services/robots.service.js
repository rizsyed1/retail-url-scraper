'use scrict'; 

const request = require('request');
const log = require('./log.service')('services:robotstxt');
const util = require('util');

const requestRobotsTxtFiles = (url) => {
    return new Promise((resolve, reject) => {
      request(url, (err, res, body) => {
        const disallowDict = {}
        if (err) reject(err);  
        const urlArr = body.split(/\s+/).filter(bodyVal => {
          return /^https:.*(xml.gz)$/.test(bodyVal) || 
          /^https:.*(xml)$/.test(bodyVal) ||
          /^http:.*(xml.gz)$/.test(bodyVal) ||
          /^http:.*(xml)$/.test(bodyVal)
        });
        log(`urlArr length is ${urlArr.length}`);
        body.split(/\s+/)
          .filter( (bodyVal, i, arr) => arr[i - 1] === 'Disallow:')
          .forEach(disallowVal => disallowDict[disallowVal] = true);
        resolve([urlArr, disallowDict]);
      });
    });
};

module.exports = requestRobotsTxtFiles;
