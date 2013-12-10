'use strict';

var path = require('path')
  , fs = require('fs');

module.exports = function(conf) {

  var assetsJson = path.join(conf.publicPath, 'assets.json')
    , assetsCache = {};

  function init() {
    if (process.env.NODE_ENV == 'production')
      try {
        assetsCache = JSON.parse(
          fs.readFileSync(assetsJson, { encoding: 'utf-8' }));
        return;
      } catch(e) {
        console.warn(assetsJson + " missing or broken.");
      }
    // Fallback to default multi-files markup
    initDev();
  }

  function initDev() {
    for (var bundleName in conf.assets)
      compileDev(bundleName);
  }

  function compileDev(bundleName) {
    var tags = assetsCache[bundleName] = {
      js: '',
      css: ''
    };
    conf.assets[bundleName].forEach(function(asset) {
      if (/\.js$/i.test(asset)) {
        tags.js +=
          '<script type="text/javascript" src="' +
            asset + '"></script>';
      } else if (/\.css/i.test(asset)) {
        tags.css +=
          '<link rel="stylesheet" type="text/css" href="' +
            asset + '"/>';
      }
    });
  }

  init();

  return function(req, res, next) {
    res.locals.emitJs = function(bundleName) {
      return assetsCache[bundleName].js;
    };
    res.locals.emitCss = function(bundleName) {
      return assetsCache[bundleName].css;
    };
    next();
  };

};