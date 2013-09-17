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
    var url = target.attr('data-url');

    if (switcher.hasClass("switch-stay"))
      target.click(function(ev) {
        ev.stopPropagation();
      });

    function update() {
      if (target.is(":visible")) {
        switcher.addClass(cssClass);
        if (url) { // If data-url attr exists, load remote content into target
          target.empty();
          // Insert placeholder into container
          var ph = $.scalpel.placeholder();
          target.append(ph);
          // Do AJAX
          $.scalpel.log("[dropdown] GET " + url);
          $.ajax({
            dataType: "html",
            url: url,
            type: 'get',
            success: function(data) {
              ph.remove();
              target.append(data);
              $.scalpel.init(target);
            },
            error: function(xhr) {
              ph.remove();
              $.scalpel.ajax.processErrors(xhr);
            }
          });
        }
      } else switcher.removeClass(cssClass);
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