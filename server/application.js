'use strict';

var debug = require('debug')('bigfoot:app')
  , http = require('http')
  , mongoose = require('mongoose');

module.exports = function(options) {

  this.options = options;

  options = options || {};

  // Main configurables

  if (!options.id) {
    console.warn('Please set `options.id` with application identifier.')
  }

  if (!options.port) {
    console.warn('Specify `options.port`.');
  }

  if (!options.schema) {
    console.warn('Specify `options.schema` (default is http).');
    options.schema = 'http';
  }

  if (!options.domain) {
    console.warn('Specify `options.domain`.');
  }

  if (!options.publicPath) {
    console.warn('Specify `options.publicPath` to point to your static assets.');
  }

  options.origin = options.schema + '://' + options.domain;

  if (!options.cdnDomain) {
    console.warn('Specify `options.cdnDomain` for static serving.');
    options.cdnDomain = options.domain;
  }

  options.cdnOrigin = '//' + options.cdnDomain;

  if (!options.redis) {
    console.warn('Specify `options.redis` with Redis connection settings.')
  }

  if (!options.mongo) {
    console.warn('Specify `options.mongo` with Mongo connection settings.')
  }

  // Create Express application

  var app = require('express')();

  // Install middleware management on top of it

  function __(name, fn) {
    return { route: '', name: name, handle: fn };
  }

  app.getMiddlewareIndex = function(thatName) {
    for (var i = 0; i < this.stack.length; i++) {
      var h = this.stack[i];
      if ((h.name || h.handle.name) == thatName)
        break;
    }
    return i;
  };

  app.installLast = app.install = function(name, fn) {
    debug('Installing “' + name + '” as the last one');
    app.stack.push(__(name, fn));
    return app;
  };

  app.installFirst = function(name, fn) {
    debug('Installing “' + name + '” as the first one');
    app.stack.unshift(__(name, fn));
    return app;
  };

  app.installBefore = function(thatName, name, fn) {
    debug('Installing “' + name + '” before “' + thatName + '”');
    var i = this.getMiddlewareIndex(thatName);
    this.stack.splice(i, 0, __(name, fn));
    return app;
  };

  app.installAfter = function(thatName, name, fn) {
    debug('Installing “' + name + '” after “' + thatName + '”');
    var i = this.getMiddlewareIndex(thatName);
    if (i == this.stack.length)
      this.installLast(name, fn);
    else
      this.stack.splice(i + 1, 0, __(name, fn));
    return app;
  };

  app.replace = function(name, fn) {
    debug('Replacing “' + name + '”.');
    var i = this.getMiddlewareIndex(name);
    if (i == this.stack.length)
      console.warn('Replacing “' + name + '” failed. Try installing instead.');
    else
      this.stack.splice(i, 1, __(name, fn));
    return app;
  };

  app.names = function() {
    return this.stack.map(function(m) {
      return m.name || '<anonymous>';
    });
  };

  // Add run stuff

  app.run = function(cb) {
    var server = this.server = http.createServer(app);
    var port = options.port || process.ENV.port;
    var appId = options.id + '@' + port;

    // Graceful shutdown

    var shutdown = function() {
      if (app.shuttingDown)
        return;
      app.shuttingDown = true;
      console.log(appId + ': shutting down.');
      server.close(function() {
        mongoose.disconnect(function() {
          console.log(appId + ': exiting.');
          process.exit(0);
        });
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    mongoose.connect(options.mongo.url, function() {
      debug('Connected to Mongo @ ' + options.mongo.url);
      server.listen(port, function() {
        console.log(appId + ': visit ' + options.origin + ' to begin your work.');
        if (typeof(cb) == 'function')
          cb();
      });
    });

    return this;
  };

  // We're done in here

  return app;

};