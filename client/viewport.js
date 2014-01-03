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
        // See if site title needs to be replaced
        var newTitle = cnt.attr("data-title");
        if (newTitle) {
          $("head title").text(newTitle);
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
