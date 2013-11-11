'use strict';

var multiparty = require('multiparty');

function flatObject(obj) {
  var result = {};
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    var value = obj[i];
    if (Array.isArray(value) && value.length == 1) {
      result[i] = value[0];
    } else {
      result[i] = value;
    }
  }
  return result;
}

module.exports = function(req, res, next) {
  // Check if already parsed
  if (req._body) return next();
  req.body = req.body || {};
  // Check request method
  if (req.method == "GET" || req.method == "HEAD")
    return next();
  // Check content type
  if (!req.is('multipart/form-data')) return next();
  // Parse files
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    if (err) return next(err);
    req._body = true;
    // Enhance file arrays with `name` and `type` properties
    req.files = files.map(function(array) {
      return array.map(function(file) {
        file.name = file.originalFilename;
        file.type = file.headers['content-type'];
        return file;
      });
    });
    // Field arrays are flattened
    req.body = flatObject(fields);
    next();
  });
};