'use strict';

module.exports = (function($) {

  $.scalpel.queue['input[type="checkbox"][data-toggle]'] = function() {
    var input = $(this);
    var selector = input.attr('data-toggle');
    var key = input.attr('data-key') || "scalpel.toggle(" + selector + ")";
    restore();

    function restore() {
      if (localStorage.getItem(key) == 'false')
        input.removeAttr('checked');
      else if (localStorage.getItem(key) == 'true')
        input.attr('checked', 'checked');
      update(0);
    }

    function update(speed) {
      var showing = input.is(':checked');
      localStorage.setItem(key, showing);
      var items = $(selector);
      if (showing) items.fadeIn(speed);
      else items.fadeOut(speed);
    }

    input.unbind('.scalpel.toggle')
      .bind('change.scalpel.toggle', function() {
        update(300);
      });
  };

})(jQuery);