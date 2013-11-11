'use strict';

module.exports = (function($) {

  $.msg["Close"] = "Close";

  function get() {
    init();
    return $("#ibox");
  }

  function init() {
    var cnt = $("#ibox");
    if (cnt.size() > 0)
      return;
    cnt = $('<div id="ibox"></div>');
    cnt.hide();
    $("body").prepend(cnt);
    $(window)
      .unbind(".ibox")
      .bind("keydown.ibox", function(ev) {
        if (ev.keyCode == 0x1B)
          close();
      });
    cnt.bind("click.ibox", function(ev) {
      close();
    });
  }

  function close() {
    var cnt = $("#ibox");
    $("iframe", cnt).remove();
    cnt.fadeOut(300, function() {
      $(this).remove();
    });
  }

  function isVisible() {
    return $("#ibox").is(":visible");
  }

  function load(href) {
    $.ajax({
      url: href,
      dataType: "html",
      type: "GET",
      data: {
        "__": new Date().getTime().toString()
      },
      success: function(data) {
        show(data);
      },
      error: $.scalpel.ajax.processErrors
    });
  }

  function show(data) {
    var content = $(data);
    // Trigger viewport unload
    var e = $.Event("viewportUnload");
    $(window).trigger(e);
    if (e.isDefaultPrevented()) return;
    // Show ibox
    var cnt = get().empty();
    var wrapper = $('<div id="ibox-wrapper"></div>');
    wrapper.append(content);
    cnt.append(wrapper);
    var _close = $('<div id="ibox-close"></div>');
    _close.attr("title", $.msg['Close']);
    wrapper.append(_close);
    cnt.fadeIn(300, function() {
      $("body").animate({scrollTop: cnt.offset().top}, 300);
      cnt.trigger("ibox_load");
      $.scalpel.init(wrapper);
      wrapper
        .unbind(".ibox")
        .bind("click.ibox", function(ev) {
          ev.stopPropagation();
        });
      $("a.close", content)
        .add(_close)
        .bind("click.ibox", close);
    });
  }

  return {
    get: get,
    init: init,
    close: close,
    isVisible: isVisible,
    show: show,
    load: load
  };

})(jQuery);
