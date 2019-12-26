const request = require('request');

const requestRobotsTxtFiles = (robotTxtFileUrls) => {
    return new Promise((resolve, reject) => {
      request(robotTxtFileUrls, (err, res, body) => {
        if (err) reject(err);  
        const space = /\s+/;
        const siteMapGzippedUrlFormat = /^https:.*(xml.gz)$/;
        const siteMapUrlFormat = /^https:.*(xml)$/;
        const bodyArr = body.split(space);
        const urlArr = [];
        for (const body of bodyArr) { 
          if(siteMapUrlFormat.test(body) || siteMapGzippedUrlFormat.test(body)) {
            urlArr.push(body);
          };
        };
        resolve(urlArr);
      });
    });
};

module.exports = requestRobotsTxtFiles;