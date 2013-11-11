'use strict';

var express = require('express');

// Common middleware

exports.multipart = require('./multipart');

exports.notices = require('./notices');

exports.params = require('./params');

// Combinations

exports.parsers = function(options) {
  var methodOverride = express.methodOverride(options)
    , urlencoded = express.urlencoded(options)
    , json = express.json(options)
    , multipart = exports.multipart(options);

  return function(req, res, next) {
    methodOverride(req, res, function(err) {
      if (err) return next(err);
      urlencoded(req, res, function(err) {
        if (err) return next(err);
        json(req, res, function(err) {
          if (err) return next(err);
          multipart(req, res, function(err) {
            if (err) return next(err);
            exports.params(options)(req, res, next);
          });
        });
      });
    });
  };

};