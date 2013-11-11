'use strict';

var moment = require('moment')
  , flatMap = require('flatmap')
  , _ = require('underscore')
  , debug = require('debug')('scalpel:commons');

module.exports = function(options) {

  return function(req, res, next) {

    debug('Extending req, res with commons.');

    // Params coercion

    req.getParam = function(name, defaultValue) {
      var body = req.body || {};
      var query = req.query || {};
      return body[name] || query[name] || defaultValue;
    };

    req.getString = function(name, defaultValue) {
      var value = req.getParam(name);
      return typeof(value) == 'string' ? value : defaultValue;
    };

    req.getStrings = function(name, defaultValue) {
      var value = req.getParam(name);
      if (typeof(value) == 'string') return [value];
      if (Array.isArray(value))
        return value.filter(function(v) {
          return typeof(v) == 'string';
        });
      return defaultValue || [];
    };

    req.getInt = function(name, defaultValue) {
      var value = parseInt(req.getParam(name));
      return isNaN(value) ? defaultValue : value;
    };

    req.getInts = function(name, defaultValue) {
      var value = req.getParam(name);
      var num = parseInt(value);
      if (!isNaN(num)) return [num];
      if (Array.isArray(value))
        return flatMap(value, function(v) {
          var num = parseInt(v);
          return isNaN(num) ? null : num;
        });
      return defaultValue || [];
    };

    req.getFloat = function(name, defaultValue) {
      var value = parseFloat(req.getParam(name));
      return isNaN(value) ? defaultValue : value;
    };

    req.getFloats = function(name, defaultValue) {
      var value = req.getParam(name);
      var num = parseFloat(value);
      if (!isNaN(num)) return [num];
      if (Array.isArray(value))
        return flatMap(value, function(v) {
          var num = parseFloat(v);
          return isNaN(num) ? null : num;
        });
      return defaultValue || [];
    };

    req.getMoment = function(name, defaultValue) {
      var d = moment(req.getString(name), 'YYYY-MM-DD');
      return d.isValid() ? d : moment(defaultValue);
    };

    req.getMoments = function(name, defaultValue) {
      var value = req.getParam(name);
      var mom = moment(value);
      if (mom.isValid()) return [mom];
      if (Array.isArray(value))
        return flatMap(value, function(v) {
          var mom = moment(v);
          return mom.isValid() ? mom : null;
        });
      return defaultValue || [];
    };

    req.getFile = function(name) {
      var files = req.files || {};
      var file = files[name];
      return file && file[0];
    };

    req.getFiles = function(name) {
      var files = req.files || {};
      return files[name] || [];
    };

    req.getArray = function(name, defaultValue) {
      var value = req.getParam(name, defaultValue);
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    };

    // Some useful response locals

    _.extend(res.locals, {
      _: _,
      xhr: req.xhr,
      moment: function() {
        return moment.apply(arguments).lang(req.i18n.getLocale());
      },
      duration: function() {
        return moment.duration.apply(arguments).lang(req.i18n.getLocale());
      }
    });

    next();

  };

};
