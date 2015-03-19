;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$.ajaxSetup({
  headers: {
    "X-Requested-With": "XMLHttpRequest"
  }
});

$.bigfoot.msg['ajax.authRequired'] = "You need to login to continue.";
$.bigfoot.msg['ajax.accessDenied'] = "You have insufficient permissions to access the resource.";
$.bigfoot.msg['ajax.failed'] = "Your request could not be processed. Please contact technical support.";
$.bigfoot.msg['ajax.tooLarge'] = "Your request exceeds the size limit.";

$.bigfoot.ajax = {

  processResponse: function(data, stay) {
    $.bigfoot.notices.clear();
    $.bigfoot.notices.addAll(data);
    if (data.redirect && !stay) {
      $.bigfoot.notices.stash();
      window.location.replace(data.redirect);
    }
  },

  processErrors: function(xhr) {
    switch (xhr.status) {
      case 0:
        return true;
      case 401:
        $.bigfoot.notices.warn($.bigfoot.msg['ajax.authRequired']);
        break;
      case 403:
        $.bigfoot.notices.error($.bigfoot.msg['ajax.accessDenied']);
        break;
      case 413:
        $.bigfoot.notices.error($.bigfoot.msg['ajax.tooLarge']);
        break;
      default:
        $.bigfoot.notices.error($.bigfoot.msg['ajax.failed']);
    }
    return false;
  }

};

},{}],2:[function(require,module,exports){
$.bigfoot = {

  settings: {},

  msg: {},

  log: function(text) {
    if (typeof(console) != "undefined" && typeof(console.log) == "function")
      console.log(text);
  },

  queue: [],

  init: function(ctx) {
    this.queue.forEach(function(handle) {
      ctx.lookup(handle.selector).each(handle.fn)
    });
  },

  install: function(selector, fn) {
    this.queue.push({ selector: selector, fn: fn });
    return this;
  },

  installLast: this.install,

  installFirst: function(selector, fn) {
    this.queue.unshift({ selector: selector, fn: fn });
    return this;
  },

  installBefore: function(that, selector, fn) {
    for (var i = 0; i < this.queue.length; i++)
      if (this.queue[i].selector == that)
        break;
    this.queue.splice(i, 0, { selector: selector, fn: fn });
    return this;
  },

  installAfter: function(that, selector, fn) {
    for (var i = 0; i < this.queue.length; i++)
      if (this.queue[i].selector == that)
        break;
    if (i == this.queue.length)
      this.installLast(selector, fn);
    else
      this.queue.splice(i + 1, 0, { selector: selector, fn: fn });
  },

  replace: function(selector, fn) {
    for (var i = 0; i < this.queue.length; i++)
      if (this.queue[i].selector == selector)
        break;
    if (i == this.queue.length)
      $.bigfoot.log('Replacing “' + selector + '” failed. Try installing instead.');
    else
      this.queue.splice(i, 1, { selector: selector, fn: fn });
  }

};

},{}],3:[function(require,module,exports){
require("../jquery-ext");
require("../jquery-sha256");

require("../bigfoot");
require("../notices");
require("../viewport");
require("../ajax");
require("../ibox");

require("../components/commons");
require("../components/forms");
require("../components/switch");
require("../components/toggler");
require("../components/scroll-load");
require("../components/checkbox-toggle");
require("../components/retina");
require("../components/load-into");
require("../components/lightform");
require("../components/sticky");
require("../components/classOnScroll");
require("../components/multiselect");



},{"../ajax":1,"../bigfoot":2,"../components/checkbox-toggle":5,"../components/classOnScroll":6,"../components/commons":7,"../components/forms":8,"../components/lightform":9,"../components/load-into":10,"../components/multiselect":11,"../components/retina":12,"../components/scroll-load":13,"../components/sticky":14,"../components/switch":15,"../components/toggler":16,"../ibox":17,"../jquery-ext":18,"../jquery-sha256":19,"../notices":20,"../viewport":21}],4:[function(require,module,exports){
(function($) {

  require('./modules');

})(jQuery);


},{"./modules":3}],5:[function(require,module,exports){
$.bigfoot.install('input[type="checkbox"][data-toggle]', function() {
  var input = $(this);
  var selector = input.attr('data-toggle');
  var key = input.attr('data-key') || "bigfoot.toggle(" + selector + ")";
  restore();

  function restore() {
    if (localStorage.getItem(key) == 'false')
      input.removeAttr('checked');
    else if (localStorage.getItem(key) == 'true')
      input.attr('checked', 'checked');
    update(0);
  }

  function update(speed) {
    var showing = input.is(':checked');
    localStorage.setItem(key, showing);
    var items = $(selector);
    if (showing) items.fadeIn(speed);
    else items.fadeOut(speed);
  }

  input.unbind('.bigfoot.toggle')
    .bind('change.bigfoot.toggle', function() {
      update(300);
    });
});

},{}],6:[function(require,module,exports){
$.bigfoot.install('[data-class-on-scroll]', function() {

  var wnd = $(window)
    , cnt = $(this)
    , classes = cnt.attr('data-class-on-scroll')
    , enabled = true;

  function checkAndUpdate() {
    if (!enabled) return;
    var viewBottom = wnd.scrollTop() + wnd.height()
      , cntTop = cnt.offset().top;
    if (viewBottom >= cntTop) {
      cnt.addClass(classes);
      enabled = false;
    }
  }

  checkAndUpdate();
  wnd.scrollAnim(checkAndUpdate);
  wnd.on('sizeChanged', checkAndUpdate);

});

},{}],7:[function(require,module,exports){
$.bigfoot.placeholder = function() {
  return $('<div class="loading"/>')
};

$.bigfoot.install('[data-ref]', function() {
  var selector = $(this).attr("data-ref");
  var cssClass = $(this).attr("data-ref-class");
  if (!cssClass)
    cssClass = "active";
  $(selector).addClass(cssClass);
});

$.bigfoot.install('.focus', function() {
  $(this).focus();
});

$.bigfoot.install('[data-set-focus]', function() {
  $(this).unbind(".bigfoot.setFocus")
    .bind("click.bigfoot.setFocus", function () {
      $($(this).attr("data-set-focus")).focus();
    });
});

$.bigfoot.install('a[rel="popup"]', function() {
  $(this).unbind("click.bigfoot.popup")
    .bind("click.bigfoot.popup", function(ev) {
      var a = $(this);
      var href = a.attr("href");
      if (href) {
        $.bigfoot.ibox.load(href);
        ev.preventDefault();
        return false;
      }
    });
});

$.bigfoot.install('[data-show]', function() {
  var elem = $(this);
  elem.unbind(".bigfoot.show")
    .bind("click.bigfoot.show", function() {
      var target = $(elem.attr("data-show"));
      target.show(0, function() {
        $(window).trigger('sizeChanged');
        // Special case if combined with data-set-focus
        $(elem.attr("data-set-focus")).focus();
        if (elem.hasClass('scrollTo'))
          target.scrollTo();
      });
    });
});

$.bigfoot.install('[data-hide]', function() {
  $(this).unbind(".bigfoot.hide")
    .bind("click.bigfoot.hide", function() {
      $($(this).attr("data-hide")).hide(0, function() {
        $(window).trigger('sizeChanged');
      });
    });
});

},{}],8:[function(require,module,exports){
'use strict';

$.bigfoot.install('form', function() {

  var form = $(this);

  form.bind("submit.bigfoot.forms", function(ev) {
    // Default submit function on DOM is sometimes rewritten,
    // so we delegate standard submit event to `DOM.submit()`
    ev.preventDefault();
    // Read-only forms do not submit.
    if (form.hasClass("readonly")) {
      return false;
    } else this.submit();
    return false;
  });

  // Handlers is an array of functions which are executed one-by-one
  // before form submission. They are designed to modify parameters
  // sent to server on submit.

  form[0].handlers = [];

  form[0].executeHandlers = function(params) {
    for (var i in form[0].handlers) {
      var handler = form[0].handlers[i];
      var result = handler.call(form[0], { params: params });
      if (result === false)
        return false;
    }
    return true;
  };

});

// Partial forms are somewhat PJAXy, but notices-aware.

$.bigfoot.install('form.partial', function() {

  var form = $(this);

  var stay = form.hasClass("stay");
  var action = form.attr("action");
  var method = form.attr("method").toUpperCase();
  var multipart = form.attr('enctype') == 'multipart/form-data';

  form[0].submit = function() {
    if (form.hasClass("readonly")) return;
    // Replace submission buttons with loading placeholder temporarily
    var ph = $.bigfoot.placeholder();
    var submits = $(".submits", form);
    var h = submits.height();
    submits.hide();
    ph.insertAfter(submits);
    ph.height(h);
    // Prepare params
    var params = new FormData(form[0]);
    if (multipart)
      $.bigfoot.log(method + " " + action + " [multipart data]");
    else {
      params = $(":input:not(.exclude)", form).serializeArray();
      params.push({
        name: "__",
        value: new Date().getTime().toString()
      });
      // Execute handlers
      if (!form[0].executeHandlers(params)) { // Submit prevented
        submits.show();
        ph.remove();
        return;
      }
      $.bigfoot.log(method + " " + action + " " + JSON.stringify(params));
    }
    // Now do AJAX
    if (method == "GET") {
      var url = action + "?" + $.param(params);
      $.bigfoot.viewport.navigate(url);
    } else {
      var settings = {
        data: params,
        dataType: "json",
        url: action,
        type: method,
        cache: false,
        success: function(data) {
          form.trigger("postSubmit", data);
          $.bigfoot.ajax.processResponse(data, stay);
          if (!data.redirect) {
            submits.show();
            ph.remove();
            $("input[type='password'], .cleanup", form).val("");
          }
        },
        error: function(xhr) {
          submits.show();
          ph.remove();
          $.bigfoot.ajax.processErrors(xhr);
        }
      };
      if (multipart) {
        settings.processData = false;
        settings.contentType = false;
      }
      // Perform ajax submit
      $.ajax(settings);
    }
  };

});

// Controls inside forms marked `.submit` will submit the form.

$.bigfoot.install('form :input.submit', function() {

  var input = $(this);

  input.unbind(".bigfoot.submit")
    .bind("change.bigfoot.submit", function() {
      var form = input.parents("form");
      form.submit();
    });

});

$.bigfoot.install('form a.submit', function() {
  var a = $(this);
  a.unbind(".bigfoot.submit")
    .bind("click.bigfoot.submit", function(ev) {
      a.parents("form").submit();
      ev.preventDefault();
      return false;
    });
});

// Forms marked `data-load-into` load the contents into specified container element.

$.bigfoot.install('form[data-load-into]', function() {
  var form = $(this);
  var cnt = $(form.attr("data-load-into"));

  var method = form.attr("method");
  var action = form.attr("action");

  form[0].submit = function() {
    // Insert placeholder into container
    var ph = $.bigfoot.placeholder();
    var submits = $(".submits", form);
    submits.hide();
    cnt.empty().append(ph);
    // Prepare params
    var params = $(":input:not(.exclude)", form).serializeArray();
    params.push({"name": "__", "value": new Date().getTime().toString()});
    // Execute handlers
    if (!form[0].executeHandlers(params)) { // Submit prevented
      submits.show();
      ph.remove();
      return;
    }
    // Do AJAX
    $.bigfoot.log(method + " " + action + " " + JSON.stringify(params));
    $.ajax({
      data: params,
      dataType: "html",
      url: action,
      type: method,
      success: function(data) {
        form.trigger("postSubmit", data);
        ph.remove();
        cnt.append(data);
        $.bigfoot.init(cnt);
      },
      error: function(xhr) {
        ph.remove();
        submits.show();
        $.bigfoot.ajax.processErrors(xhr);
      }
    });
  };
});

// Warnings can be shown on unload, if the form marked `.unload-warn` has changed.

$.bigfoot.msg["form.unload.warn"] = "Warning! If you leave this page, all unsaved changes will be lost.";
$.bigfoot.msg["viewportUnload.warn"] = "Warning! If you continue, all unsaved changed will be lost. Are you sure you want to continue?";

$.bigfoot.install("form.unload-warn", function() {
  var form = $(this);
  updateInitialState();
  form.bind("submit.bigfoot.unload-warn", updateInitialState);

  function updateInitialState() {
    var data = $(":input:not(.exclude)", form).serialize();
    form.data("initial-state", data);
  }

  $(window).unbind("beforeunload.bigfoot")
    .bind("beforeunload.bigfoot.unload-warn", function() {
      var changedForms = $("form.unload-warn").filter(function() {
        var f = $(this);
        var currentState = $(":input:not(.exclude)", f).serialize();
        var initialState = f.data("initial-state");
        return currentState != initialState && f.is(":visible")
      });
      if (changedForms.size() > 0) return $.bigfoot.msg['form.unload.warn'];
    });

  $(window).unbind("viewportUnload.bigfoot")
    .bind("viewportUnload.bigfoot.unload-warn", function(ev) {
      var changedForms = $("form.unload-warn").filter(function() {
        var f = $(this);
        var currentState = $(":input:not(.exclude)", f).serialize();
        var initialState = f.data("initial-state");
        return currentState != initialState;
      });
      if (changedForms.size() > 0) {
        if (!confirm($.bigfoot.msg['viewportUnload.warn']))
          ev.preventDefault();
      }
    });
});



},{}],9:[function(require,module,exports){
$.bigfoot.install('[data-method][data-action]', function() {
  var e = $(this);
  var method = e.attr("data-method").toUpperCase();
  var action = e.attr("data-action");
  e.click(function(ev) {
    ev.preventDefault();
    $.bigfoot.viewport.showStandBy();
    $.ajax({
      dataType: "json",
      url: action,
      data: { "__" : new Date().getTime().toString() },
      type: method,
      success: function(data) {
        e.trigger("postSubmit", data);
        $.bigfoot.ajax.processResponse(data);
        if (!data.redirect) {
          $.bigfoot.viewport.hideStandBy();
        }
      },
      error: function(xhr) {
        $.bigfoot.ajax.processErrors(xhr);
        $.bigfoot.viewport.hideStandBy();
      }
    });
    return false;
  });
});

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
$.bigfoot.install('form.multiselect', function() {
  var form = $(this)
    , selectAll = form.find('#selectAll, .selectAll')
    , selectItems = form.find('.selectItem:not([disabled])')
    , selectBy = form.find('.selectBy')
    , enableIfSelected= $('.enableIfSelected')
    , showIfSelected = $('.showIfSelected')
    , selectCount = $('.selectedCount');

  function update() {
    var count = selectItems.filter(':checked').size();
    selectCount.text(' (' + count + ')');
    if (count == 0) {
      showIfSelected.hide();
      enableIfSelected.each(function() {
        var elem = $(this)
          , href = elem.attr('href');
        elem.attr('disabled', 'disabled');
        if (href != 'javascript:;') {
          elem.attr('data-href', href);
          elem.attr('href', 'javascript:;');
        }
      });
    } else {
      showIfSelected.show();
      enableIfSelected.each(function() {
        var elem = $(this)
          , originalHref = elem.attr('data-href');
        elem.removeAttr('disabled');
        if (originalHref)
          elem.attr('href', originalHref);
      });
    }
    selectAll.prop('checked', count == selectItems.size());
    selectAll.prop('indeterminate',
      count < selectItems.size() && count > 0);
    selectBy.each(function() {
      var trigger = $(this)
        , selector = trigger.attr('data-selector')
        , items = selectItems.filter(selector)
        , selected = items.filter(':checked');
      trigger.prop('checked', items.size() == selected.size());
      trigger.prop('indeterminate',
        selected.size() < items.size() && selected.size() > 0);
    });
  }

  selectItems.unbind('.multiselect')
    .bind('change.multiselect', update);

  selectAll.unbind('.multiselect')
    .bind('change.multiselect', function() {
      selectItems.prop('checked', $(this).is(':checked'));
      update();
    });

  selectBy.each(function() {
    var trigger = $(this)
      , selector = trigger.attr('data-selector');
    trigger.unbind('.multiselect')
      .bind('change.multiselect', function() {
        selectItems.filter(selector).prop('checked', trigger.is(':checked'));
        update();
      });
  });

  update();
});

},{}],12:[function(require,module,exports){
$.bigfoot.isRetina = function() {
  var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
                      (min--moz-device-pixel-ratio: 1.5),\
                      (-o-min-device-pixel-ratio: 3/2),\
                      (min-resolution: 1.5dppx)";
  if (window.devicePixelRatio > 1)
    return true;
  return window.matchMedia && window.matchMedia(mediaQuery).matches;
};

$.bigfoot.install('img.retina', function() {
  var img = $(this);

  if ($.bigfoot.isRetina()) {
    if (img[0].complete) swap();
    else img.one('load.bigfoot.retina', swap);
  }

  function swap() {
    var width = img.width();
    var height = img.height();
    img.attr('src', img.attr('src').replace(/\.([^.]+)$/, '@2X.$1'));
    img.attr('width', width);
    img.attr('height', height);
  }

});

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
$.bigfoot.install('[data-sticky]', function() {
  var $wnd = $(window)
    , $sticky = $(this)
    , $parent = $(this.parentNode)
    , yPadding = parseInt($sticky.attr('data-y-padding')) || 16
    , _el = $sticky[0]
    , enabled = true;

  var oldY, windowHeight, updating = false;

  function reinit() {
    var _float = window.getComputedStyle(_el).float;
    var _enabled = _float == 'left' || _float == 'right';
    // Handle special case where "switching" occurs
    if (enabled != _enabled)
      $sticky.removeAttr('style');
    // Recalc dimensions
    enabled = _enabled;
    oldY = 0;
    windowHeight = window.innerHeight;
    redraw();
  }

  function redraw() {
    if (!enabled) return;
    var newY = oldY;
    var elementBox = _el.getBoundingClientRect();
    var parentBox = $parent[0].getBoundingClientRect();
    var boundTop = Math.max(-parentBox.top + yPadding, 0);
    var boundBottom = Math.min(window.innerHeight - parentBox.top - yPadding, parentBox.height);
    var alwaysAtTop = elementBox.height < windowHeight &&
      boundTop + elementBox.height < boundBottom;
    if (boundTop > oldY && boundBottom < oldY + elementBox.height)
      return;
    if (alwaysAtTop || boundTop < oldY) {
      newY = boundTop;
    } else if (boundBottom > oldY + elementBox.height) {
      newY = boundBottom - elementBox.height;
    }
    if (newY != oldY) {
      oldY = newY;
      _el.style.webkitTransform =
        _el.style.MozTransform =
          _el.style.msTransform =
            _el.style.OTransform =
              _el.style.transform =
                'translateY(' + oldY + 'px)';
    }
    if (newY == 0) $sticky.addClass('atTop');
    else $sticky.removeClass('atTop');
  }

  function onScroll(ev) {
    if (!updating)
      window.requestAnimationFrame(function() {
        updating = false;
        redraw(ev);
      });
    updating = true;
  }

  // Bind to events
  reinit();
  $wnd.resizeStop(reinit);
  $wnd.scroll(redraw);
  $wnd.on('sizeChanged', reinit);

});

},{}],15:[function(require,module,exports){
$.bigfoot.switcher = {

  hideAll: function(currentTarget) {
    $(".switch-target").filter(function(){
      return this != currentTarget;
    }).hide();
    $("[data-switch]").each(function() {
      var e = $(this);
      var cssClass = e.attr("data-switch-class");
      if (!cssClass)
        cssClass = "active";
      e.removeClass(cssClass);
    });
  }

};

// Hide all open targets on click outside

$(function() {
  $("html").bind("click.bigfoot.switcher", function() {
    $.bigfoot.switcher.hideAll();
  });
});

$.bigfoot.install('[data-switch]', function() {

  var switcher = $(this);

  var cssClass = switcher.attr("data-switch-class");
  if (!cssClass)
    cssClass = "active";

  var target = $(switcher.attr("data-switch"));
  target.addClass("switch-target");

  if (switcher.hasClass("switch-stay"))
    target.click(function(ev) {
      ev.stopPropagation();
    });

  function update() {
    if (target.is(":visible")) {
      switcher.addClass(cssClass);
    } else {
      switcher.removeClass(cssClass);
    }
  }

  update();

  function toggle() {
    target.toggle(0, update);
  }

  function close() {
    target.hide(0, update);
  }

  switcher
    .unbind('.bigfoot.switch')
    .bind("click.bigfoot.switch", function(ev) {
      ev.preventDefault();
      $.bigfoot.switcher.hideAll(target[0]);
      toggle();
      return false;
    });

  $(switcher).find('.close')
    .unbind('.bigfoot.switch')
    .bind('click.bigfoot.switch', function(ev) {
      ev.preventDefault();
      close();
      return false;
    });

});

},{}],16:[function(require,module,exports){
$.bigfoot.install('.toggler', function() {

  var toggler = $(this);

  var buttons = $("*[data-for]", toggler);

  var cssClass = toggler.attr("data-toggler-class");
  if (!cssClass)
    cssClass = "active";

  function updateButtons() {
    buttons.each(function() {
      var b = $(this);
      var target = $(b.attr("data-for"));
      if (target.is(":visible"))
        b.addClass(cssClass);
      else b.removeClass(cssClass);
    });
  }

  function hideAll() {
    buttons.each(function() {
      $($(this).attr("data-for")).hide();
    });
  }

  buttons.unbind(".bigfoot.toggler")
    .bind("click.bigfoot.toggler", function(ev) {
      ev.preventDefault();
      var b = $(this);
      // hide all targets
      hideAll();
      // show this one
      $(b.attr("data-for")).show();
      // update buttons state
      updateButtons();
      return false;
    });

  // Init from markup -- or by reading button classes
  var active = buttons.filter('.' + cssClass);
  if (active.size() == 0) // Init toggler by reading related markup
    updateButtons();
  else { // Hide all targets except initial
    hideAll();
    $(active.attr('data-for')).show();
  }
});

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
$.fn.lookup = function(selector) {
  if (!selector)
    return this;
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
    }, 300);
};

// Shuffle elements

$.fn.shuffle = function() {

  function rnd(max) {
    return Math.floor(Math.random() * max);
  }

  var all = this.get();

  var shuffled = $.map(all, function() {
    var random = rnd(all.length),
      randEl = $(all[random]).clone(true)[0];
    all.splice(random, 1);
    return randEl;
  });

  this.each(function(i){
    $(this).replaceWith($(shuffled[i]));
  });

  return $(shuffled);

};

// Events on scroll stop

$.fn.scrollStop = function(cb) {
  var timer;
  $(this).bind('scroll.scrollStop', function(ev) {
    var elem = this;
    clearTimeout(timer);
    timer = setTimeout(function() {
      cb.call(elem, ev);
    }, 100);
  });
};

// Events on resize stop

$.fn.resizeStop = function(cb) {
  var timer;
  $(this).bind('resize.resizeStop', function(ev) {
    var elem = this;
    clearTimeout(timer);
    timer = setTimeout(function() {
      cb.call(elem, ev);
    }, 100);
  });
};

// Events on scroll per animation frame

$.fn.scrollAnim = function(cb) {

  var updating = false
    , raf = window.requestAnimationFrame;

  if (typeof raf != 'function')
    return $(this).scroll(cb);

  function onScroll(ev) {
    if (!updating)
      raf(function() {
        updating = false;
        cb(ev);
      });
    updating = true;
  }

  return $(this).bind('scroll', onScroll);

};

},{}],19:[function(require,module,exports){
  (function(f){var m=8;var k=function(q,t){var s=(q&65535)+(t&65535);var r=(q>>16)+(t>>16)+(s>>16);return(r<<16)|(s&65535)};var e=function(r,q){return(r>>>q)|(r<<(32-q))};var g=function(r,q){return(r>>>q)};var a=function(q,s,r){return((q&s)^((~q)&r))};var d=function(q,s,r){return((q&s)^(q&r)^(s&r))};var h=function(q){return(e(q,2)^e(q,13)^e(q,22))};var b=function(q){return(e(q,6)^e(q,11)^e(q,25))};var p=function(q){return(e(q,7)^e(q,18)^g(q,3))};var l=function(q){return(e(q,17)^e(q,19)^g(q,10))};var c=function(r,s){var E=new Array(1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298);var t=new Array(1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225);var q=new Array(64);var G,F,D,C,A,y,x,w,v,u;var B,z;r[s>>5]|=128<<(24-s%32);r[((s+64>>9)<<4)+15]=s;for(var v=0;v<r.length;v+=16){G=t[0];F=t[1];D=t[2];C=t[3];A=t[4];y=t[5];x=t[6];w=t[7];for(var u=0;u<64;u++){if(u<16){q[u]=r[u+v]}else{q[u]=k(k(k(l(q[u-2]),q[u-7]),p(q[u-15])),q[u-16])}B=k(k(k(k(w,b(A)),a(A,y,x)),E[u]),q[u]);z=k(h(G),d(G,F,D));w=x;x=y;y=A;A=k(C,B);C=D;D=F;F=G;G=k(B,z)}t[0]=k(G,t[0]);t[1]=k(F,t[1]);t[2]=k(D,t[2]);t[3]=k(C,t[3]);t[4]=k(A,t[4]);t[5]=k(y,t[5]);t[6]=k(x,t[6]);t[7]=k(w,t[7])}return t};var j=function(t){var s=Array();var q=(1<<m)-1;for(var r=0;r<t.length*m;r+=m){s[r>>5]|=(t.charCodeAt(r/m)&q)<<(24-r%32)}return s};var n=function(s){var r="0123456789abcdef";var t="";for(var q=0;q<s.length*4;q++){t+=r.charAt((s[q>>2]>>((3-q%4)*8+4))&15)+r.charAt((s[q>>2]>>((3-q%4)*8))&15)}return t};var o=function(s,v){var u=j(s);if(u.length>16){u=core_sha1(u,s.length*m)}var q=Array(16),t=Array(16);for(var r=0;r<16;r++){q[r]=u[r]^909522486;t[r]=u[r]^1549556828}var w=c(q.concat(j(v)),512+v.length*m);return c(t.concat(w),512+256)};var i=function(q){q=typeof q=="object"?f(q).val():q.toString();return q};f.extend({sha256:function(q){q=i(q);return n(c(j(q),q.length*m))},sha256hmac:function(q,r){q=i(q);r=i(r);return n(o(q,r))},sha256config:function(q){m=parseInt(q)||8}});f.fn.sha256=function(r){f.sha256config(r);var q=i(f(this).val());var s=f.sha256(q);f.sha256config(8);return s}})(jQuery);

},{}],20:[function(require,module,exports){
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
    }, this.timeout());
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
    $.bigfoot.notices.clear();
  }
});

// Unstash notices on load
$(function() {
  $.bigfoot.notices.unstash();
});
},{}],21:[function(require,module,exports){
'use strict';

$.bigfoot.msg['standby'] = "Please wait...";

var useHistory = typeof(history.pushState) == "function";

// Binding global onpopstate event on load
if (useHistory) {
  $(function() {
    window.addEventListener("popstate", function(ev) {
      if (!ev.state) return;
      // `viewportId` from `state` must match #viewport(data-viewport-id)
      var viewportId = ev.state.id;
      if (viewportId && viewportId == $.bigfoot.viewport.id()) {
        $.bigfoot.viewport.load(location.href);
      } else {
        // reload whole page
        location.reload(true);
      }
    }, false);
  });
}

$.bigfoot.viewport = {

  id: function() {
    var cnt = this.container();
    var id = cnt.attr("data-viewport-id");
    if (id) return id;
    // Generate random id
    var rnd = Math.random().toString();
    cnt.attr("data-viewport-id", rnd);
    return rnd;
  },

  container: function() {
    return $("#viewport");
  },

  timeout: function() {
    var settings = $.bigfoot.settings.viewport || {};
    return settings.timeout || 500;
  },

  showStandBy: function() {
    var overlay = $('#viewport-standby');
    if (overlay.size() == 0) {
      overlay = $('<div id="viewport-standby"></div>');
      overlay.hide();
      overlay.append('<div class="message">' + $.bigfoot.msg['standby'] + '</div>');
    }
    $("body").append(overlay);
    this._standByTimer = setTimeout(function() {
      overlay.fadeIn(300);
    }, this.timeout());
  },

  hideStandBy: function() {
    clearTimeout(this._standByTimer);
    $('#viewport-standby').remove();
  },

  // Loads `href` partially into the `#viewport` container
  load: function(href) {
    var viewport = this;
    // Trigger viewport unload
    var e = $.Event("viewportUnload");
    $(window).trigger(e);
    if (e.isDefaultPrevented()) return;
    // Adding "Please wait" overlay
    viewport.showStandBy();
    // Perform AJAX request
    $.ajax({
      url: href,
      headers: {"X-Render-Mode": "partial-viewport" },
      dataType: "html",
      data: {
        "__": new Date().getTime().toString()
      },
      type: "GET",
      success: function(data) {
        var viewportId = viewport.id();
        var cnt = $(data);
        // Wrap cnt into <div id="viewport">, if necessary
        if (cnt.attr("id") != "viewport")
          cnt = $('<div id="viewport"/>').append(cnt);
        // Assign current viewport id
        cnt.attr("data-viewport-id", viewportId);
        // Remove the overlay
        viewport.hideStandBy();
        // Insert the data
        viewport.container().replaceWith(cnt).remove();
        // Clear `active` class from all partial links
        $("a[rel='partial']").removeClass("active");
        // Initialize the container
        $.bigfoot.init(cnt);
        // See if there's a title tag inside — and replace the title
        var newTitle = $('title', cnt);
        if (newTitle.size() > 0) {
          $("head title").text(newTitle.text());
          newTitle.remove();
        }
        // Raise the event
        $("body").trigger("viewportLoad");
        // Navigate to #anchor
        viewport.scrollToAnchor();
      },
      error: function(xhr) {
        $.bigfoot.ajax.processErrors(xhr);
        // Remove the overlay
        viewport.hideStandBy();
      }
    });
  },

  // Navigates to specified `url` by loading the content into `#viewport`
  navigate: function(url, redirect) {
    if (useHistory) {
      var id = $.bigfoot.viewport.id();
      // Add one more replaceState with current URL
      // to allow partial `history.go(-1)`.
      window.history.replaceState({ id: id }, "", location.href);
      if (redirect)
        window.history.replaceState({ id: id }, "", url);
      else
        window.history.pushState({ id: id }, "", url);
      this.load(url);
    } else {
      $.bigfoot.notices.stash();
      if (redirect) window.location.replace(url);
      else window.location.href = url;
    }
  },

  scrollToAnchor: function() {
    var hash = location.href.replace(/.*?(?=#|$)/, "");
    var scrollTarget = $(hash);
    if (scrollTarget.size() == 0)
      scrollTarget = $(".viewport-anchor").first();
    scrollTarget.scrollTo();
  }

};

if (useHistory)
  $.bigfoot.install("a[rel='partial']", function() {
    var a = $(this);
    if (a.attr("rel") == "popup" ||
      a.attr("target") == "_blank")
      return;
    a.addClass("partial-link");
    a.unbind(".bigfoot.partial-link")
      .bind("click.bigfoot.partial-link", function(ev) {
        if (ev.button != 0 || ev.metaKey || ev.ctrlKey)
          return true;
        ev.preventDefault();
        var href = $(this).attr("href");
        $.bigfoot.viewport.navigate(href);
        return false;
      });
  });

},{}]},{},[4])
;