'use strict';

(function($) {

  require("./jquery-ext");
  require("./jquery-sha256");

  require("./bigfoot");
  require("./notices");
  require("./viewport");
  require("./ajax");
  require("./ibox");

  require("./components/commons");
  require("./components/forms");
  require("./components/switch");
  require("./components/toggler");
  require("./components/stashed");
  require("./components/scroll-load");
  require("./components/checkbox-toggle");
  require("./components/retina");
  require("./components/load-into");

  $(function() {
    $.bigfoot.init($("body"));
  });

})(jQuery);

