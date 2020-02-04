'use strict'; 

const requestRobotsTxtFiles = require('../../services/robots.service');
const gzipArrs = require('../../services/gzip.service');
const readXml = require('../../services/readxml.service');
const log = require('../../services/log.service')('handler:site-urls');
const path = '/site-urls/:lookUpUrl';

const siteUrlHandler = async(req, res, next) => {
  const url = req.params.lookUpUrl;
  const robotTxtFileUrl = `https://${url}/robots.txt`;
  const sitemaps = await requestRobotsTxtFiles(robotTxtFileUrl);
  const nestedSitemap = await gzipArrs(sitemaps[0]); 
  const urlArr = await readXml(nestedSitemap);
  res.status(200).send(urlArr);
  log(`urlArr is ${urlArr}`);
};

module.exports = {
  handler: siteUrlHandler,
  path 
};
