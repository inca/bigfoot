;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
'use strict';

require("./jquery-ext");
require("./jquery-sha256");

// TODO bundle'em all!!1

$.scalpel = require("./scalpel");
$.msg = $.scalpel.msg;
$.scalpel.notices = require("./notices");

$(function() {
  $.scalpel.init($("body"));
});


},{"./jquery-ext":2,"./jquery-sha256":3,"./notices":4,"./scalpel":5}],2:[function(require,module,exports){
(function($) {
// ========
// Standard jQuery extensions
// ========

// Find inside element or match itself

  $.fn.lookup = function(selector) {
    var elems = this.find(selector);
    if (this.is(selector))
      return elems.add(this);
    else return elems;
  };

// Insert at index function

  $.fn.insertAt = function(index, element) {
    var lastIndex = this.children().size();
    if (index < 0) {
      index = Math.max(0, lastIndex + 1 + index)
    }
    this.append(element);
    if (index < lastIndex) {
      this.children().eq(index).before(this.children().last());
    }
    return this;
  };

// Insert-at-caret

  $.fn.insertAtCaret = function(value) {
    return this.each(function() {
      if (document.selection) {
        this.focus();
        var sel = document.selection.createRange();
        sel.text = value;
        this.focus();
      } else if (typeof(this.selectionStart) != "undefined") {
        var startPos = this.selectionStart;
        var endPos = this.selectionEnd;
        var scrollTop = this.scrollTop;
        this.value = this.value.substring(0, startPos) +
          value + this.value.substring(endPos,this.value.length);
        this.focus();
        this.selectionStart = startPos + value.length;
        this.selectionEnd = startPos + value.length;
        this.scrollTop = scrollTop;
      } else {
        this.value += value;
        this.focus();
      }
    })
  };

// Scroll to element

  $.fn.scrollTo = function() {

    var scrollTop = -1;

    this.each(function() {
      scrollTop = $(this).offset().top;
    });

    if (scrollTop >= 0)
      $("html, body").animate({
        "scrollTop": scrollTop
      }, 200);
  };

})(jQuery);
},{}],3:[function(require,module,exports){
  (function(f){var m=8;var k=function(q,t){var s=(q&65535)+(t&65535);var r=(q>>16)+(t>>16)+(s>>16);return(r<<16)|(s&65535)};var e=function(r,q){return(r>>>q)|(r<<(32-q))};var g=function(r,q){return(r>>>q)};var a=function(q,s,r){return((q&s)^((~q)&r))};var d=function(q,s,r){return((q&s)^(q&r)^(s&r))};var h=function(q){return(e(q,2)^e(q,13)^e(q,22))};var b=function(q){return(e(q,6)^e(q,11)^e(q,25))};var p=function(q){return(e(q,7)^e(q,18)^g(q,3))};var l=function(q){return(e(q,17)^e(q,19)^g(q,10))};var c=function(r,s){var E=new Array(1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298);var t=new Array(1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225);var q=new Array(64);var G,F,D,C,A,y,x,w,v,u;var B,z;r[s>>5]|=128<<(24-s%32);r[((s+64>>9)<<4)+15]=s;for(var v=0;v<r.length;v+=16){G=t[0];F=t[1];D=t[2];C=t[3];A=t[4];y=t[5];x=t[6];w=t[7];for(var u=0;u<64;u++){if(u<16){q[u]=r[u+v]}else{q[u]=k(k(k(l(q[u-2]),q[u-7]),p(q[u-15])),q[u-16])}B=k(k(k(k(w,b(A)),a(A,y,x)),E[u]),q[u]);z=k(h(G),d(G,F,D));w=x;x=y;y=A;A=k(C,B);C=D;D=F;F=G;G=k(B,z)}t[0]=k(G,t[0]);t[1]=k(F,t[1]);t[2]=k(D,t[2]);t[3]=k(C,t[3]);t[4]=k(A,t[4]);t[5]=k(y,t[5]);t[6]=k(x,t[6]);t[7]=k(w,t[7])}return t};var j=function(t){var s=Array();var q=(1<<m)-1;for(var r=0;r<t.length*m;r+=m){s[r>>5]|=(t.charCodeAt(r/m)&q)<<(24-r%32)}return s};var n=function(s){var r="0123456789abcdef";var t="";for(var q=0;q<s.length*4;q++){t+=r.charAt((s[q>>2]>>((3-q%4)*8+4))&15)+r.charAt((s[q>>2]>>((3-q%4)*8))&15)}return t};var o=function(s,v){var u=j(s);if(u.length>16){u=core_sha1(u,s.length*m)}var q=Array(16),t=Array(16);for(var r=0;r<16;r++){q[r]=u[r]^909522486;t[r]=u[r]^1549556828}var w=c(q.concat(j(v)),512+v.length*m);return c(t.concat(w),512+256)};var i=function(q){q=typeof q=="object"?f(q).val():q.toString();return q};f.extend({sha256:function(q){q=i(q);return n(c(j(q),q.length*m))},sha256hmac:function(q,r){q=i(q);r=i(r);return n(o(q,r))},sha256config:function(q){m=parseInt(q)||8}});f.fn.sha256=function(r){f.sha256config(r);var q=i(f(this).val());var s=f.sha256(q);f.sha256config(8);return s}})(jQuery);

},{}],4:[function(require,module,exports){
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

},{"./scalpel":5}],5:[function(require,module,exports){
'use strict';

module.exports = {
  queue: {},
  init: function(ctx) {
    $.each($.scalpel.queue, function(selector, handler) {
      ctx.lookup(selector).each(handler);
    });
  },
  settings: {},
  msg: {},
  log: function(text) {
    if (typeof(console) != "undefined" && typeof(console.log) == "function")
      console.log(text);
  }
};

},{}]},{},[1])
;