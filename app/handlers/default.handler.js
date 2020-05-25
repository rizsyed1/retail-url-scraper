/** @format */

"use strict";

const debug = require("../../services/log.service")("handler:default");

const path = "/";

async function handler(req, res, next) {
    res.json(
        "Please open 'https://retail-url-scraper.herokuapp.com/' followed by domain of the site you want to scrape, e.g. https://retail-url-scraper.herokuapp.com/apple.com"
    );
}

module.exports = {
    handler,
    path,
};
