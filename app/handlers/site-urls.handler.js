'use strict';

const log = require('../services/log.service')('handler:site-urls');

const requestRobotsTxtFiles = require('../services/robots.service');
const gzipArrs = require('../services/gzip.service');

const path = '/site-urls/:lookUpUrl';

async function siteUrlHandler(req, res, next) {
  const lookUpUrl = req.params.lookUpUrl;
  log(siteUrlHandler.name, { lookUpUrl });
  const robotTxtFileUrl = `https://${lookUpUrl}/robots.txt`;
  // TODO: sitemap crawaling should be recursive... 
  //       since it may contain sitemap referencing stemaps
  const sitemaps = await requestRobotsTxtFiles(robotTxtFileUrl);
  const nestedSitemaps = await gzipArrs(sitemaps); 
  log(siteUrlHandler.name, { nestedSitemapsCount: nestedSitemaps.length });
}

module.exports = {
  handler: siteUrlHandler,
  path
}
