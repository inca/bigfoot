'use strict';

var vsprintf = require("sprintf").vsprintf;

module.exports = function(req, res, next) {

  var notices = res.notices = res.locals.notices = {

    get: function() {
      var all = req.session.notices;
      if (!all)
        all = [];
      req.session.notices = null;
      return all;
    },

    add: function(kind, m) {
      var all = req.session.notices;
      if (!all)
        all = [];
      // Format message
      var message = m;
      var params = Array.prototype.slice.call(arguments, 2);
      if (req.i18n && req.i18n.__ && typeof req.i18n.__ == 'function') {
        message = req.i18n.__.apply(req.i18n, [m].concat(params));
      } else {
        message = vsprintf(m, params);
      }
      // Push to session
      all.push({
        kind: kind,
        msg: message
      });
      req.session.notices = all;
      return this;
    },

    add_argv: function(kind, argv) {
      return this.add.apply(this, [kind].concat(Array.prototype.slice.call(argv)));
    },

    info: function() {
      return this.add_argv('info', arguments);
    },

    warn: function() {
      return this.add_argv('warn', arguments);
    },

    error: function() {
      return this.add_argv('error', arguments);
    },

    send: function() {
      res.json({ notices: notices.get() });
      return notices;
    }

  };

  next();
};

module.exports.extend = function(obj) {
  return function(req, res, next) {
    module.exports(req, res, function() {
      for (var i in obj) {
        if (obj.hasOwnProperty(i))
          res.notices[i] = obj[i];
      }
      next();
    });
  }
};