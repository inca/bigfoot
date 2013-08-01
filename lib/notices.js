'use strict';

var scalpel = require("./scalpel");

module.exports = (function($) {

  var s = $.scalpel.settings;

  // Close on escape
  window.addEventListener("keydown", function(ev) {
    if (ev.keyCode == 0x1B) {
      clear();
    }
  });

  function timeout() {
    var t = s['notices.timeout'];
    return t ? parseInt(t) : 10000;
  }

  function container() {
    return $("#notices");
  }

  function hasErrors() {
    return $(".notice.error:not(:animated)", container()).size() > 0;
  }

  function stash() {
    if (window.sessionStorage) {
      var cnt = container();
      // Delete animating notices before stashing
      $(".notice:animated", cnt).remove();
      window.sessionStorage.setItem("scalpel.notices", cnt.html());
      cnt.empty();
    }
    return $.scalpel.notices;
  }

  function unstash() {
    if (window.sessionStorage) {
      var html = window.sessionStorage.getItem("scalpel.notices");
      if (html) {
        container().append(html);
        window.sessionStorage.removeItem("scalpel.notices");
        $(".notice", container()).each(function() {
          initElem(this);
        });
      }
    }
    return $.scalpel.notices;
  }

  function initElem(elem) {
    var e = $(elem);
    $(".hide", e).remove();
    var handle = $("<span class='hide'/>");
    handle.bind("click.scalpel.notices", function() {
      dispose(e);
    });
    e.prepend(handle);
    setTimeout(function() {
      dispose(e);
    }, timeout());
  }

  function mkElem(notice) {
    var kind = notice.kind;
    var msg = notice.msg
      .replace(/&quot;/g, "\"")
      .replace(/&lt;/g,"<")
      .replace(/&gt;/g,">")
      .replace(/&amp;/g, "&");
    var e = $("<div class=\"notice " + kind + "\">" + msg +"</div>");
    initElem(e);
    return e;
  }

  function add(notice) {
    container().append(mkElem(notice));
    return $.scalpel.notices;
  }

  function addError(msg) {
    return add({kind: "error", msg: msg});
  }

  function addWarn(msg) {
    return add({kind: "warn", msg: msg});
  }

  function addInfo(msg) {
    return add({kind: "info", msg: msg});
  }

  function addAll(data) {
    if (data && data.notices) {
      for (var i in data.notices) {
        var n = data.notices[i];
        add(n);
      }
    }
    return $.scalpel.notices;
  }

  function clear() {
    return dispose($(".notice", container()));
  }

  function dispose(elems) {
    elems.fadeOut("fast", function() {
      $(this).remove();
    });
    return $.scalpel.notices;
  }

  // Unstash on load
  $(function() {
    unstash();
  });

  return {
    timeout: timeout,
    container: container,
    hasErrors: hasErrors,
    stash: stash,
    unstash: unstash,
    initElem: initElem,
    mkElem: mkElem,
    clear: clear,
    dispose: dispose,
    add: add,
    addInfo: addInfo,
    addWarn: addWarn,
    addError: addError,
    addAll: addAll
  };

})(jQuery);
