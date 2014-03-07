'use strict';

var assert = require('assert');

var Conf = require('../lib/conf.js');

describe('Configuration API', function() {

  it('should detect production environment', function() {
    var conf = new Conf();
    assert.equal(conf.production, false);
    process.env.NODE_ENV = 'production';
    assert.equal(conf.production, true);
    delete process.env.NODE_ENV;
  });

  it('should return default port with no options passed', function() {
    var conf = new Conf();
    assert.equal(conf.port, 8123);
  });

  it('should override port with options', function() {
    var conf = new Conf({ port: 1234 });
    assert.equal(conf.port, 1234);
  });

  it('should override port with env variables', function() {
    process.env.PORT = 4321;
    var conf = new Conf({ port: 1234 });
    assert.equal(conf.port, 4321);
    delete process.env.PORT;
  });

  it('should override properties via the development object', function() {
    var conf = new Conf({
      port: 1234,
      development: {
        port: 4321
      }
    });
    assert.equal(conf.port, 4321);
  });

  it('development object is ignored with NODE_ENV=production', function() {
    process.env.NODE_ENV = 'production';
    var conf = new Conf({
      port: 1234,
      development: {
        port: 4321
      }
    });
    assert.equal(conf.port, 1234);
    delete process.env.NODE_ENV;
  });

});