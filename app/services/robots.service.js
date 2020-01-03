const request = require('request');
const log = require('./log.service')('service:robots')

const requestRobotsTxtFiles = (url) => {
  log(requestRobotsTxtFiles.name, { url })
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) reject(err);
      const space = /\s+/;
      const siteMapGzippedUrlFormat = /^https:.*(xml.gz)$/;
      const siteMapUrlFormat = /^https:.*(xml)$/;
      const bodyArr = body.split(space);
      const urlArr = [];
      for (const body of bodyArr) {
        if (siteMapUrlFormat.test(body) || siteMapGzippedUrlFormat.test(body)) {
          urlArr.push(body);
        };
      };
      resolve(urlArr);
    });
  });
};

module.exports = requestRobotsTxtFiles;
