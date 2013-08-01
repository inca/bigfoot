'use strict';

require("./jquery-ext");
require("./jquery-sha256");

// TODO bundle'em all!!1

$.scalpel = require("./scalpel");
$.msg = $.scalpel.msg;
$.scalpel.notices = require("./notices");

$(function() {
  $.scalpel.init($("body"));
});

