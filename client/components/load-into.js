$.bigfoot.install('a[data-load-into]', function() {
  var a = $(this);
  var url = a.attr("href");
  var container = $(a.attr("data-load-into"));
  if (!(container.size() > 0) || !url)
    return;
  var classes = a.attr("data-class");
  var styles = a.attr("data-style");
  a.click(function(ev) {
    ev.preventDefault();
    var ph = $.bigfoot.placeholder();
    var scrollTop = $(window).scrollTop();
    container.empty().append(ph);
    $.ajax({
      dataType: "html",
      url: url,
      data: {"__" : new Date().getTime().toString()},
      type: "get",
      success: function(data) {
        var content = $("<div/>");
        content.attr("data-loaded", url);
        content.attr("class", classes);
        content.attr("style", styles);
        content.append(data);
        // fallback to the previous position
        ph.replaceWith(content).remove();
        $(window).scrollTop(scrollTop);
        $.bigfoot.init(content);
        $(window).trigger('sizeChanged');
      },
      error: function() {
        ph.remove();
      }
    });
    return false;
  });
});
