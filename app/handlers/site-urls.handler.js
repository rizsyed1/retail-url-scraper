'use strict'; 

const requestRobotsTxtFiles = require('./services/robots.service');
const gzipArrs = require('./services/gzip.service');
const readXml = require('./services/readxml.service');
const log = require('../services/log.service')('handler:site-urls');

const siteMapArr = await requestRobotsTxtFiles(lookUpUrl);
const nestedSitemapUrlArr = await gzipArrs(siteMapArr[0]); 
const urlArr = await readXml(nestedSitemapUrlArr);
const path = '/site-urls/:lookUpUrl';

async (req, res, next) => {
    const lookUpUrl = req.params.lookUpUrl;

    log(urlArr);
  })