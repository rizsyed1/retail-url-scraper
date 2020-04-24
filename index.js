'use strict'; 

const createError = require('http-errors');
const express = require('express');
const http = require('http');

const siteUrlHandler = require('./app/handlers/site-urls.handler');
const defaultHandler = require('./app/handlers/default.handler');

const log = require('./services/log.service')('app');

const PORT = process.env.PORT || 3000;

const app = express();
app.set(PORT);

const server = http.createServer(app);
server.listen(PORT);
server.on('error', (error) => {
  throw error;
});

server.on('listening', () => {
  log(`listening on ${HOST}:${PORT}`);
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//route handlers
app.get(defaultHandler.path, defaultHandler.handler);
app.get(siteUrlHandler.path, siteUrlHandler.handler);

