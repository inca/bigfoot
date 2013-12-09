'use strict';

var Application = require('./application')
  , express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , multipart = require('./multipart')
  , notices = require('./notices')
  , commons = require('./commons')
  , mongooseAuth = require('./auth')
  , _ = require('underscore')
  , i18n = require("i18n-2")
  , BundleUp = require("bundle-up");

// Default application skeleton

module.exports = function(options) {

  // BigFoot Express-based app

  var app = new Application(options);

  // Views

  app.set('views', options.viewsPath || './views');
  app.set('view engine', 'jade');
  app.engine('ejs', require('ejs').renderFile);
  app.locals.basedir = options.viewsPath || './views';

  // Loggers

  app.configure('development', function() {
    app.install('logger', express.logger('dev'));
  });

  // Parsers

  app.install('urlencoded', express.urlencoded());
  app.install('json', express.json());
  app.install('multipart', multipart());
  app.install('methodOverride', express.methodOverride());

  // Session with connect-redis
  var secret = (options.session && options.session.secret) || '';
  var RedisStore = require('connect-redis')(express);
  var redisOptions = _.extend({
    prefix: 'session:',
    ttl: (options.session && options.session.ttl) || 600
  }, options.redis || {});
  app.install('cookie', express.cookieParser(secret));
  app.install('session', express.session({
    key: 'sid',
    secret: secret,
    store: new RedisStore(redisOptions),
    cookie: {
      domain: options.session && options.session.domain
    }
  }));

  // Session-based authentication backed by Mongoose

  app.install('auth', mongooseAuth(options));

  // I18n

  app.install('i18n', function(req, res, next) {
    req.i18n = new i18n({
      locales: options.locales || ['en'],
      extension: '.json'
    });
    i18n.registerMethods(res.locals, req);
    next();
  });

  // Notices

  app.install('notices', notices(options));

  // Routing commons

  app.install('commons', commons(options));

  // Router

  app.install('router', app.router);

  // Stylus

  app.install('stylus', stylus.middleware({
    src: options.publicPath || './public',
    compile: function(str, path) {
      return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .use(nib());
    }
  }));

  // Public serving

  app.install('public-cors', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', options.origin);
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.install('public', express.static(options.publicPath));

  // Error handler

  app.configure('development', function() {
    app.install('errors', express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure('production', function() {
    app.install('errors', express.errorHandler());
  });

  return app;

};

// Common middleware

exports.Application = Application;

exports.multipart = multipart;

exports.notices = notices;

exports.commons = commons;

exports.mongooseAuth = mongooseAuth;


