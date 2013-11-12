'use strict';

var debug = require('debug')('scalpel:app');

module.exports = function() {

  var app = require('express')();

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
    debug("Installing “" + name + "” as the last one");
    app.stack.push(__(name, fn));
    return app;
  };

  app.installFirst = function(name, fn) {
    debug("Installing “" + name + "” as the first one");
    app.stack.unshift(__(name, fn));
    return app;
  };

  app.installBefore = function(thatName, name, fn) {
    debug("Installing “" + name + "” before “" + thatName + "”");
    var i = this.getMiddlewareIndex(thatName);
    this.stack.splice(i, 0, __(name, fn));
    return app;
  };

  app.installAfter = function(thatName, name, fn) {
    debug("Installing “" + name + "” after “" + thatName + "”");
    var i = this.getMiddlewareIndex(thatName);
    if (i == this.stack.length)
      this.installLast(name, fn);
    else
      this.stack.splice(i + 1, 0, __(name, fn));
    return app;
  };

  app.dumpMiddleware = function() {
    return this.stack.map(function(m) {
      return m.name || '<anonymous>';
    });
  };

  return app;

};