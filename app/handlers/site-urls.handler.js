/** @format */

"use strict";
const { OK, INTERNAL_SERVER_ERROR } = require("http-status");
const requestRobotsTxtFiles = require("../../services/robots.service");
const gunzipArrs = require("../../services/gzip.service");
const readXml = require("../../services/readxml.service");
const log = require("../../services/log.service")("handler:site-urls");
const path = "/site-urls/:lookUpUrl";

const SITETIMEOUT = "Website took too long to respond";

const siteUrlHandler = async (req, res, next) => {
    try {
        const url = req.params.lookUpUrl;
        const robotTxtFileUrl = `https://${url}/robots.txt`;
        const sitemaps = await requestRobotsTxtFiles(robotTxtFileUrl);
        if (sitemaps === SITETIMEOUT) throw SITETIMEOUT;
        log(`robots.service returns ${sitemaps[0].length} urls`);
        const nestedSitemap = await gunzipArrs(sitemaps[0]);
        log(`gzip.service returns ${nestedSitemap.length} urls`);
        const urlArr = await readXml(nestedSitemap);
        log(`readXml returns arr length ${urlArr.length}, arr is ${urlArr.slice(0, 20)}`);
        res.status(OK).send(urlArr);
    } catch (e) {
        if (e instanceof TypeError || e === SITETIMEOUT) {
            res.status(INTERNAL_SERVER_ERROR).send(
                `Can't get links from site. The URL might be incorrect, 
                or the site might not follow sitemap protocols. Or maybe
                the website just doesn't like strangers...`
            );
        } else {
            res.status(INTERNAL_SERVER_ERROR).send("something isn't working...");
            log(`error is ${e}`);
        }
    }
};

module.exports = {
    handler: siteUrlHandler,
    path
};
