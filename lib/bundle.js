'use strict';

require("./jquery-ext");
require("./jquery-sha256");

// TODO bundle'em all!!1

$.scalpel = require("./scalpel");
$.msg = $.scalpel.msg;

$.scalpel.notices = require("./notices");
$.scalpel.viewport = require("./viewport");
$.scalpel.ajax = require("./ajax");
$.scalpel.ibox = require("./ibox");

require("./components/commons");
require("./components/forms");
require("./components/switch");
require("./components/toggler");
require("./components/stashed");

$(function() {
  $.scalpel.init($("body"));
});

