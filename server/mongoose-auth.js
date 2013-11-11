'use strict';

module.exports = function(options) {

  var debug = require('debug')('scalpel:auth');

  var User = options.auth && options.auth.model;

  if (!User) {
    console.error('Please configure `options.auth.model` to your mongoose User model.');
  }

  return function(req, res, next) {

    req.login = function(user, cb) {
      req.session.principalId = user.id.toString();
      if (typeof cb == "function")
        cb();
    };

    req.logout = function() {
      delete req.session.principalId;
    };

    req.rememberLocation = function() {
      if (req.route.method == 'get' && !req.xhr)
        res.cookie("loc", res.locals.origin + req.path, {
          domain: options.cookieDomain
        });
    };

    req.lastLocation = function() {
      return req.cookies.loc || '/';
    };

    // Finally, populate `req.principal`
    if (req.session.principalId) {
      debug('PrincipalId is ' + req.session.principalId);
      User.findOne({ _id: req.session.principalId })
        .exec(function(err, user) {
          if (err) return next(err);
          req.principal = res.locals.principal = user;
          return next();
        });
    } else next();

  }

};