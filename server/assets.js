'use strict';

var debug = require('debug')('bigfoot:assets')
  , path = require('path')
  , fs = require('fs');

module.exports = function(conf) {

  var packaging = process.env.NODE_ENV == 'production';
  var markup = {};

  function compileHtml(bundleName) {
    var tags = markup[bundleName] = {
      js: '',
      css: ''
    };
    if (packaging) {
      // TODO read bundle fingerprints
    } else {
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
  }

  for (var bundleName in conf.assets)
    compileHtml(bundleName);

  process.on('SIGHUP', function() {
    console.log('Updating assets bundles information.');
  });

  return function(req, res, next) {
    res.locals.emitJs = function(bundleName) {
      return markup[bundleName].js;
    };
    res.locals.emitCss = function(bundleName) {
      return markup[bundleName].css;
    };
    next();
  };

};