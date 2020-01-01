'use scrict'; 

const request = require('request');
const zlib = require('zlib');
const log = require('debug')('services:gzipservice')

const gzipArrs = fromArr => {
    return Promise.all(
      fromArr.map(siteMapUrl => {
        if (siteMapUrl.slice(-2) === 'gz') {
          const gunzipArr = requestPromiseGzippedPage(siteMapUrl)
          return gunzipArr;
        }
        else {
          return siteMapUrl;
        }
      })
    ); 
  };

  const requestPromiseGzippedPage = (gZipSiteMapUrl) => {
    return new Promise(async (resolve, reject) => {
      request(gZipSiteMapUrl, {encoding: null}, async (err, res, body) => {
        if (err) reject(err);
        await gunzipPage(body)
          .then(body => resolve(body))
          .catch(err => reject(err))
      });
    });
  };

  const gunzipPage = body => {
    return new Promise(async (resolve, reject) => {
      zlib.gunzip(body, (err, unzipped) => {
        if (err) reject(err);
        const unzippedSiteMap = unzipped.toString();
        const space = /\s+/;
        const unzippedSiteMapArr = unzippedSiteMap.split(space);
        const scrapedSiteMapXmlElementArr = unzippedSiteMapArr.filter(text => text.slice(-6) == '</loc>')
        const scrapedSiteMapUrlArr = scrapedSiteMapXmlElementArr.map(text => text.slice(5, text.length - 6));
        resolve(scrapedSiteMapUrlArr);
      });
    });
  };
module.exports = gzipArrs;
