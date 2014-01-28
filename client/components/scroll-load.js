$.bigfoot.install('[data-load]', function() {

  $(this).becomeVisible(function(ev) {
    var block = $(this);
    var url = block.attr("data-load");
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
      },
      error: function() {
        $.bigfoot.log("Failed to load " + url);
        ph.remove();
      }
    });
  });

});
