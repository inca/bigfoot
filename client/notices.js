$.bigfoot.notices = {

  timeout: function() {
    var settings = $.bigfoot.settings.notices || {};
    return settings.timeout || 10000;
  },

  container: function() {
    return $("#notices");
  },

  hasErrors: function() {
    return $(".notice.error:not(:animated)", this.container()).size() > 0;
  },

  stash: function() {
    if (window.sessionStorage) {
      var cnt = this.container();
      // Delete animating notices before stashing
      $(".notice:animated", cnt).remove();
      window.sessionStorage.setItem("bigfoot.notices", cnt.html());
      cnt.empty();
    }
    return this;
  },

  unstash: function() {
    var notices = this;
    if (window.sessionStorage) {
      var html = window.sessionStorage.getItem("bigfoot.notices");
      if (html) {
        notices.container().append(html);
        window.sessionStorage.removeItem("bigfoot.notices");
        $(".notice", notices.container()).each(function() {
          notices.initElem(this);
        });
      }
    }
    return this;
  },

  initElem: function(elem) {
    var notices = this;
    var e = $(elem);
    $(".hide", e).remove();
    var handle = $("<span class='hide'/>");
    handle.bind("click.bigfoot.notices", function() {
      notices.dispose(e);
    });
    e.prepend(handle);
    setTimeout(function() {
      notices.dispose(e);
    }, timeout());
  },

  mkElem: function(notice) {
    var kind = notice.kind;
    var msg = notice.msg
      .replace(/&quot;/g, "\"")
      .replace(/&lt;/g,"<")
      .replace(/&gt;/g,">")
      .replace(/&amp;/g, "&");
    var e = $("<div class=\"notice " + kind + "\">" + msg +"</div>");
    this.initElem(e);
    return e;
  },

  add: function(notice) {
    this.container().append(this.mkElem(notice));
    return this;
  },

  error: function(msg) {
    return this.add({kind: "error", msg: msg});
  },

  warn: function(msg) {
    return this.add({kind: "warn", msg: msg});
  },

  info: function(msg) {
    return this.add({kind: "info", msg: msg});
  },

  addAll: function(data) {
    if (data && data.notices)
      for (var i in data.notices)
        this.add(data.notices[i]);
    return this;
  },

  clear: function() {
    return this.dispose($(".notice", this.container()));
  },

  dispose: function(elems) {
    elems.fadeOut("fast", function() {
      $(this).remove();
    });
    return this;
  }

};

// Close notices on ESC
window.addEventListener("keydown", function(ev) {
  if (ev.keyCode == 0x1B) {
    clear();
  }
});

// Unstash notices on load
$(function() {
  $.bigfoot.notices.unstash();
});