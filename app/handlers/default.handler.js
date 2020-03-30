/** @format */

"use strict";

const debug = require("../../services/log.service")("handler:default");

const path = "/";

async function handler(req, res, next) {
    res.json("Welcome to the Express app");
}

module.exports = {
    handler,
    path
};
