$.bigfoot.push('[data-load]', function() {
  var block = $(this);
  var scrollContainer = $(block.attr('data-scroll-container') || window);
  var url = block.attr("data-load");
  var hash = $.sha256(url);

  function loadInViewport() {
    if (!block) return;
    var tagName = block[0].tagName.toLowerCase();
    var elemName = "<" + tagName + "></" + tagName + ">";
    var viewBottom = $(window).scrollTop() + $(window).height();
    if (block.offset().top < viewBottom) {
      var ph = $.bigfoot.placeholder();
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
          $.bigfoot.log("Loaded " + url);
          var content = $(elemName);
          content.attr("data-loaded", url);
          content.attr("class", classes);
          content.attr("style", styles);
          content.append(data);
          ph.replaceWith(content).remove();
          $.bigfoot.init(content);
        },
        error: function() {
          $.bigfoot.log("Failed to load " + url);
          ph.remove();
        }
      });
    }
  }

  scrollContainer
    .unbind("." + hash + '.bigfoot.scrollLoad')
    .bind("scroll." + hash + ".bigfoot.scrollLoad", loadInViewport);

  $(loadInViewport); // Bind on jQuery ready
});