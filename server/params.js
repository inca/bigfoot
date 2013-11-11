'use strict';

var moment = require('moment')
  , flatMap = require('flatmap');

module.exports = function() {

  return function(req, res, next) {

    req.getParam = function(name, defaultValue) {
      var body = req.body || {};
      var query = req.query || {};
      return body[name] || query[name] || defaultValue;
    };

    req.getString = function(name, defaultValue) {
      var value = req.getParam(name);
      return typeof(value) == 'string' ? value : defaultValue;
    };

    req.getStrings = function(name) {
      var value = req.getParam(name);
      if (typeof(value) == 'string') return [value];
      if (Array.isArray(value))
        return value.filter(function(v) {
          return typeof(v) == 'string';
        });
      return [];
    };

    req.getInt = function(name, defaultValue) {
      var value = parseInt(req.getParam(name));
      return isNaN(value) ? defaultValue : value;
    };

    req.getInts = function(name) {
      var value = req.getParam(name);
      var num = parseInt(value);
      if (!isNaN(num)) return [num];
      if (Array.isArray(value))
        return flatMap(value, function(v) {
          var num = parseInt(v);
          return isNaN(num) ? null : num;
        });
      return [];
    };

    req.getFloat = function(name, defaultValue) {
      var value = parseFloat(req.getParam(name));
      return isNaN(value) ? defaultValue : value;
    };

    req.getFloats = function(name) {
      var value = req.getParam(name);
      var num = parseFloat(value);
      if (!isNaN(num)) return [num];
      if (Array.isArray(value))
        return flatMap(value, function(v) {
          var num = parseFloat(v);
          return isNaN(num) ? null : num;
        });
      return [];
    };

    req.getMoment = function(name, defaultValue) {
      var d = moment(req.getString(name), 'YYYY-MM-DD');
      return d.isValid() ? d : moment(defaultValue);
    };

    req.getMoments = function(name) {
      var value = req.getParam(name);
      var mom = moment(value);
      if (mom.isValid()) return [mom];
      if (Array.isArray(value))
        return flatMap(value, function(v) {
          var mom = moment(v);
          return mom.isValid() ? mom : null;
        });
      return [];
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

    next();

  }

};
