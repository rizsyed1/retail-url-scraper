'use strict'; 

const requestRobotsTxtFiles = require('./services/robots.service');
const gzipArrs = require('./services/gzip.service');
const readXml = require('./services/readxml.service');
const log = require('../services/log.service')('handler:site-urls');
const path = '/site-urls/:lookUpUrl';

const siteUrlHandler = async(res, req, next) => {
  const lookUpUrl = req.params.lookUpUrl;
  const robotTxtFileUrl = `https://${url}/robots.txt`;
  const sitemaps = await requestRobotsTxtFiles(robotTxtFileUrl);
  const nestedSitemap = await gzipArrs(siteMapArr[0]); 
  const urlArr = await readXml(nestedSitemapUrlArr);
}

module.exports = {
  hander: siteUrlHandler,
  path 
}