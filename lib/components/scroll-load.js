'use strict';

module.exports = (function($) {

  $.scalpel.queue['[data-load]'] = function() {
    var block = $(this);
    var scrollContainer = $(block.attr('data-scroll-container') || window);
    var url = block.attr("data-load");

    function loadInViewport() {
      if (!block) return;
      var viewBottom = $(window).scrollTop() + $(window).height();
      if (block.offset().top < viewBottom) {
        var ph = $.scalpel.placeholder();
        var classes = block.attr("class");
        var styles = block.attr("style");
        block.replaceWith(ph).remove();
        block = null;
        $.ajax({
          dataType: "html",
          url: url,
          data: {"__" : new Date().getTime().toString()},
          type: "get",
          success: function(data) {
            $.scalpel.log("Loaded " + url);
            var content = $("<div/>");
            content.attr("data-loaded", url);
            content.attr("class", classes);
            content.attr("style", styles);
            content.append(data);
            ph.replaceWith(content).remove();
            $.scalpel.init(content);
          },
          error: function() {
            $.scalpel.log("Failed to load " + url);
            ph.remove();
          }
        });
      }
    }

    scrollContainer
      .unbind('.scalpel.scrollLoad')
      .bind("scroll.scalpel.scrollLoad", loadInViewport);

    $(loadInViewport); // Bind on jQuery ready
  };

})(jQuery);