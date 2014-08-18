$.bigfoot.install('[data-load]', function() {

  var block = $(this)
    , wnd = $(window)
    , url = block.attr("data-load")
    , eventKey = 'scroll.bigfoot.scrollLoad-' + $.sha256(url)
    , timer;

  function checkAndLoad() {
    clearTimeout(timer);
    timer = setTimeout(function() {
      var viewBottom = wnd.scrollTop() + wnd.height();
      if (block.offset().top < viewBottom)
        load();
    }, 200);
  }

  function load() {
    wnd.unbind(eventKey);
    var tagName = block[0].tagName.toLowerCase();
    var elemName = "<" + tagName + "></" + tagName + ">";
    var ph = $.bigfoot.placeholder();
    var classes = block.attr("class");
    var styles = block.attr("style");
    block.replaceWith(ph).remove();
    $.ajax({
      dataType: "html",
      url: url,
      data: {"__" : new Date().getTime().toString()},
      type: "get",
      success: function(data) {
        $.bigfoot.log("Loaded " + url);
        var content = $(elemName);
        content.attr("data-loaded", url);
        content.attr("class", classes);
        content.attr("style", styles);
        content.append(data);
        ph.replaceWith(content).remove();
        $.bigfoot.init(content);
        $(window).trigger('sizeChanged');
      },
      error: function() {
        $.bigfoot.log("Failed to load " + url);
        ph.remove();
      }
    });
  }

  // Bind on window scroll and on init.
  checkAndLoad();

  wnd.unbind(eventKey).bind(eventKey, checkAndLoad);

});
