'use strict'; 

const createError = require('http-errors');
const express = require('express');
const http = require('http');

const siteUrlHandler = require('./app/handlers/site-urls.handler');
const defaultHandler = require('./app/handlers/default.handler');

const log = require('./services/log.service')('app');

const PORT = 3000;
const HOST = 'localhost';

const app = express();
app.set('port', PORT);

const server = http.createServer(app);
server.listen(PORT, HOST);
server.on('error', onError);
server.on('listening', () => {
  log(`listening on ${HOST}:${PORT}`);
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//route handlers
app.get(defaultHandler.path, defaultHandler.handler);
app.get(siteUrlHandler.path, siteUrlHandler.handler);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  log('not found');
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  };

  switch(error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};
