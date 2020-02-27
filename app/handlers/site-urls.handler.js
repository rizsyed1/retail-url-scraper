'use strict'; 

const requestRobotsTxtFiles = require('../../services/robots.service');
const gunzipArrs = require('../../services/gzip.service');
const readXml = require('../../services/readxml.service');
const log = require('../../services/log.service')('handler:site-urls');
const path = '/site-urls/:lookUpUrl';

const siteUrlHandler = async(req, res, next) => {
    const url = req.params.lookUpUrl;
    const robotTxtFileUrl = `https://${url}/robots.txt`;
    log(`url is ${url}`);
    const sitemaps = await requestRobotsTxtFiles(robotTxtFileUrl);
    const nestedSitemap = await gunzipArrs(sitemaps[0]); 
    log(`nestedSiteMap is: ${nestedSitemap}`); //delete
    const urlArr = await readXml(nestedSitemap);
    res.status(200).send(urlArr);
    log(`urlArr is ${urlArr.slice(0, 70)}`);
};

module.exports = {
    handler: siteUrlHandler,
    path 
};
