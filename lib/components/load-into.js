'use strict';

module.exports = (function($) {

  $.scalpel.queue['a[data-load-into]'] = function() {
    var a = $(this);
    var url = a.attr("href");
    var container = $(a.attr("data-load-into"));
    if (!(container.size() > 0) || !url)
      return;
    var classes = a.attr("data-classes");
    var styles = a.attr("data-styles");

    a.click(function(ev){
      var ph = $.scalpel.placeholder();
      ev.preventDefault();
      var scrollTop = $(window).scrollTop();
      container.empty().append(ph);
      $.ajax({
        dataType: "html",
        url: url,
        data: {"__" : new Date().getTime().toString()},
        type: "get",
        success: function(data) {
          $.scalpel.log("Loaded " + url + " into container " + a.attr("data-load-into"));
          var content = $("<div/>");
          content.attr("data-loaded", url);
          content.attr("class", classes);
          content.attr("style", styles);
          content.append(data);
          // fallback to the previous position
          ph.replaceWith(content).remove();
          $(window).scrollTop(scrollTop);
          $.scalpel.init(content);
        },
        error: function() {
          $.scalpel.log("Failed to load " + url);
          ph.remove();
        }
      });
      return false;
    });
  };

})(jQuery);
