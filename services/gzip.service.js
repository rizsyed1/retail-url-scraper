const request = require('request');
const zlib = require('zlib');
const logNestedSiteMap = require('debug')('gzipservice:urls')

const gzipArrs = async (fromArr) => {
    let toArr = []
    for (const siteMapUrl of fromArr) {
      if (siteMapUrl.slice(-2) === 'gz') {
        const gunzipArr = await requestPromiseGzippedPage(siteMapUrl);
        toArr = toArr.concat(gunzipArr);
      }
      else {
        toArr.push(siteMapUrl)
      }
    };
    logNestedSiteMap(toArr);
    return toArr; 
  };

  const requestPromiseGzippedPage = (gZipSiteMapUrl) => {
    return new Promise(async (resolve, reject) => {
      request(gZipSiteMapUrl, {encoding: null}, async (err, res, body) => {
        if (err) reject(err);
        const nestedUrlArr = await gunzipPage(body);
        resolve(nestedUrlArr);
      });
    })
  };

  const gunzipPage = (body) => {
    return new Promise((resolve, reject) => {
      let nestedUrlArr = [];
      zlib.gunzip(body, async (err, unzipped) => {
        if (err) reject(err);
        const unzippedSiteMap = unzipped.toString();
        const space = /\s+/;
        const unzippedSiteMapArr = unzippedSiteMap.split(space);
        for (text of unzippedSiteMapArr) {
          if (text.slice(-6) == '</loc>') {
            const textLength = text.length;
            const scrapedNextedSiteMapURl = text.slice(5, textLength - 6);
            nestedUrlArr.push(scrapedNextedSiteMapURl);
          }
        };
        resolve(nestedUrlArr);
      });
    })
  };
module.exports = gzipArrs;