'use strict';

const log = require('../services/log.service')('handler:default');

const path = '/';

async function handler(req, res, next) {
  log(handler.name);
  res.json('Welcome to the express app')
}

module.exports = {
  handler,
  path
};
