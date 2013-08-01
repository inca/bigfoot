'use strict';

module.exports = (function($) {

  $.scalpel.switcher = (function() {

    // Hide all open targets on click outside
    $(function() {
      $("html").bind("click.scalpel.switch", function() {
        hideAll()
      });
    });

    function hideAll() {
      $(".switch-target").hide();
      $("[data-switch]").each(function() {
        var e = $(this);
        var cssClass = e.attr("data-switch-class");
        if (!cssClass)
          cssClass = "active";
        e.removeClass(cssClass);
      });
    }

    return {
      hideAll: hideAll
    }

  })();

  $.scalpel.queue['[data-switch]'] = function() {

    var switcher = $(this);

    var cssClass = switcher.attr("data-switch-class");
    if (!cssClass)
      cssClass = "active";

    var target = $(switcher.attr("data-switch"));
    target.addClass("switch-target");

    if (switcher.hasClass("switch-stay"))
      target.click(function(ev) {
        ev.stopPropagation();
      });

    function update() {
      if (target.is(":visible"))
        switcher.addClass(cssClass);
      else switcher.removeClass(cssClass);
    }

    update();

    function toggle() {
      switcher.toggleClass(cssClass);
      target.toggle(0, update);
    }

    switcher.bind("click.scalpel.switch", function() {
      $.scalpel.switcher.hideAll();
      toggle();
      return false;
    });

  };

})(jQuery);