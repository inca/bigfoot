'use strict';

module.exports = (function($) {

  $.scalpel.queue['.toggler'] = function() {

    var e = $(this);

    var buttons = $("*[data-for]", e);

    var cssClass = e.attr("data-toggler-class");
    if (!cssClass)
      cssClass = "active";

    function updateButtons() {
      buttons.each(function() {
        var b = $(this);
        var target = $(b.attr("data-for"));
        if (target.is(":visible"))
          b.addClass(cssClass);
        else b.removeClass(cssClass);
      });
    }

    buttons.unbind(".scalpel.toggler")
      .bind("click.scalpel.toggler", function(ev) {
        ev.preventDefault();
        var b = $(this);
        // hide all targets
        buttons.each(function() {
          $($(this).attr("data-for")).hide();
        });
        // show this one
        $(b.attr("data-for")).show();
        // update buttons state
        updateButtons();
        return false;
      });

    updateButtons();
  };

})(jQuery);