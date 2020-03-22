'use strict'; 
const {OK, INTERNAL_SERVER_ERROR} = require('http-status');
const requestRobotsTxtFiles = require('../../services/robots.service');
const gunzipArrs = require('../../services/gzip.service');
const readXml = require('../../services/readxml.service');
const log = require('../../services/log.service')('handler:site-urls');
const path = '/site-urls/:lookUpUrl';

const siteUrlHandler = async(req, res, next) => {
    try {
        const url = req.params.lookUpUrl;
        const robotTxtFileUrl = `https://${url}/robots.txt`;
        const sitemaps = await requestRobotsTxtFiles(robotTxtFileUrl);
        log(`robots.service returns ${sitemaps[0].length} urls`)
        const nestedSitemap = await gunzipArrs(sitemaps[0]); 
        log(`gzip.service returns ${nestedSitemap.length} urls`)
        const urlArr = await readXml(nestedSitemap);
        log(`readXml returns arr length ${urlArr.length}, arr is ${urlArr.slice(0, 20)}`);
        res.status(OK).send(urlArr);
    }
    catch {
        res.status(INTERNAL_SERVER_ERROR).send("something isn't working...");
    }

};

module.exports = {
    handler: siteUrlHandler,
    path 
};
