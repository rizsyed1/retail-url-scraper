var createError = require('http-errors');
var express = require('express');
var app = express();
const request = require('request');
const zlib = require('zlib');
const util = require('util');
// const websiteUrlArr = ['https://www.zara.com/', 'https://www.sephora.fr/', 'https://www.stories.com/', 'https://www.nike.com/', 'https://www.adidas.com/', 'https://www.saksfifthavenue.com/', 'https://www.uniqlo.com/', 'https://www.cremedelamer.com/', 'http://www.calvinklein.com/'];
const websiteUrlArr = ['https://www.zara.com/'];
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.json('Welcome to the express app')
});

app.get('/site-urls', async (req, res, next) => {

  const scrapeRobotsTxtFiles = async (websiteUrlArr) => {
    const siteMapUrlsObj = {};
    for (websiteUrl of websiteUrlArr) {
      robotTxtFileUrl = websiteUrl += 'robots.txt';
      const urlArr = await requestRobotsTxtFiles(robotTxtFileUrl);
      siteMapUrlsObj[websiteUrl] = urlArr;
    }; 
    return siteMapUrlsObj;
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
      })
    })
  }

  const requestPromiseGzippedPage = (gZipSiteMapUrl) => {
    return new Promise(async (resolve, reject) => {
      request(gZipSiteMapUrl, {encoding: null}, async (err, res, body) => {
        if (err) reject(err);
        const nestedUrlArr = await gunzipPage(body);
        resolve(nestedUrlArr);
      });
    })
  };

  const gunzipObjValArrsToNewObj = async (fromObj) => {
    const toObj = {}
    for (const urlDomain in fromObj) {
      toObj[urlDomain] = [];
      for (const siteMapUrl of fromObj[urlDomain]) {
        if (siteMapUrl.slice(-2) === 'gz') {
          const gunzipArr = await requestPromiseGzippedPage(siteMapUrl);
          const concattedGunzippedArr = toObj[urlDomain].concat(gunzipArr);
          toObj[urlDomain] = concattedGunzippedArr;
        }
        else {
          toObj[urlDomain].push(siteMapUrl)
        }
      };
    }
    return toObj; 
  };


  const siteMapUrlsObj = await scrapeRobotsTxtFiles(websiteUrlArr);
  const nestedSitemapUrlObj = await gunzipObjValArrsToNewObj(siteMapUrlsObj); 
  console.log(`nestedSitemapUrlObj: ${util.inspect(nestedSitemapUrlObj)}`);
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
