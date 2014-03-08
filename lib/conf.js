'use strict';

var _ = require('underscore');

/**
 * BigFoot configuration API.
 *
 * Most configuration parameters are provided with suitable defaults
 * and can be overridden via process environment variables and supplied `options`
 * (with environment variables taking precedence).
 *
 * A special case is the `development` object in `options` which will overwrite any
 * configuration property in non-production environment (production environment
 * is assumed if process is run with environment variable `NODE_ENV=production`).
 *
 * Note that environment variables take precedence over `options.development`
 * properties as well.
 *
 * @type {Function} (constructor)
 * @return new BigFoot app configuration instance.
 */
var Configuration
  = module.exports
  = exports
  = function(options) {

  this.options = options = options || {};

  // Override options in non-production environment
  if (!this.production && options.development)
    _.extend(options, options.development);

};

/**
 * Whether application is run in production environment.
 *
 * @type {boolean}
 */
Object.defineProperty(Configuration.prototype, 'production', {
  get: function() {
    return process.env.NODE_ENV == 'production';
  }
});

/**
 * HTTP port applications listens on.
 *
 * @type {number}
 */
Object.defineProperty(Configuration.prototype, 'port', {
  get: function() {
    return process.env.PORT || this.options.port || 8123;
  }
});

/**
 * Set `options.ssl` to `true` if application is behind a trusted proxy
 * (Nginx) which handles SSL certificates.
 *
 * This one is used in `origin` property globally and can be overridden
 * on request inside a middleware or a route.
 *
 * @type {boolean}
 */
Object.defineProperty(Configuration.prototype, 'ssl', {
  get: function() {
    return process.env.SSL || this.options.ssl || false;
  }
});

/**
 * Main application origin (e.g. `https://mydomain.tld`).
 *
 * Depends on `ssl` and domain properties.
 *
 * @type {string}
 * @return origin — a string composed of HTTP schema and main domain.
 */
Object.defineProperty(Configuration.prototype, 'origin', {
  get: function() {
    var protocol = process.env.PROTOCOL || this.ssl ? 'https' : 'http';
    return protocol + '://' + this.domain;
  }
});

