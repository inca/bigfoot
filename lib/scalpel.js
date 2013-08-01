'use strict';

module.exports = {
  queue: {},
  init: function(ctx) {
    $.each($.scalpel.queue, function(selector, handler) {
      ctx.lookup(selector).each(handler);
    });
  },
  settings: {},
  msg: {},
  log: function(text) {
    if (typeof(console) != "undefined" && typeof(console.log) == "function")
      console.log(text);
  }
};
