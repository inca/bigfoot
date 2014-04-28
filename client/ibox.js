'use strict';

$.bigfoot.msg["Close"] = "Close";

$.bigfoot.ibox = {

  get: function() {
    this.init();
    return $("#ibox");
  },

  init: function() {
    var ibox = this;
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
          ibox.close();
      });
    cnt.bind("click.ibox", function(ev) {
      ibox.close();
    });
  },

  close: function() {
    var cnt = $("#ibox");
    $("iframe", cnt).remove();
    cnt.fadeOut(300, function() {
      $(this).remove();
    });
  },

  isVisible: function() {
    return $("#ibox").is(":visible");
  },

  show: function(data) {
    var ibox = this;
    var content = $(data);
    // Trigger viewport unload
    var e = $.Event("viewportUnload");
    $(window).trigger(e);
    if (e.isDefaultPrevented()) return;
    // Show ibox
    var cnt = this.get().empty();
    var wrapper = $('<div id="ibox-wrapper"></div>');
    wrapper.append(content);
    cnt.append(wrapper);
    var _close = $('<div id="ibox-close"></div>');
    _close.attr("title", $.bigfoot.msg['Close']);
    wrapper.append(_close);
    cnt.fadeIn(300, function() {
      $("body").animate({scrollTop: cnt.offset().top}, 300);
      cnt.trigger("ibox_load");
      $.bigfoot.init(wrapper);
      wrapper
        .unbind(".ibox")
        .bind("click.ibox", function(ev) {
          ev.stopPropagation();
        });
      $("a.close", content)
        .add(_close)
        .bind("click.ibox", function(ev) {
          ibox.close();
          ev.preventDefault();
          return false;
        });
    });
  },

  load: function(href) {
    var ibox = this;
    $.ajax({
      url: href,
      dataType: "html",
      type: "GET",
      data: {
        "__": new Date().getTime().toString()
      },
      success: function(data) {
        ibox.show(data);
      },
      error: $.bigfoot.ajax.processErrors
    });
  }
};
