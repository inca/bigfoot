'use strict';

module.exports = (function($) {

  $.msg['standby'] = "Please wait...";

  var useHistory = typeof(history.pushState) == "function";

  // Binding global onpopstate event on load
  if (useHistory) {
    $(function() {
      window.addEventListener("popstate", function(ev) {
        if (!ev.state) return;
        // `viewportId` from `state` must match #viewport(data-viewport-id)
        var viewportId = ev.state.id;
        if (viewportId && viewportId == id()) {
          load(location.href);
        } else {
          // reload whole page
          location.reload(true);
        }
      }, false);
    });
  }

  function timeout() {
    var t = $.scalpel.settings['viewport.timeout'];
    return t ? parseInt(t) : 500;
  }

  function container() {
    var selector = $.scalpel.settings['viewport.container'];
    return selector ? $(selector) : $("#viewport");
  }

  function id() {
    var cnt = container();
    var id = cnt.attr("data-viewport-id");
    if (id) return id;
    // Generate random id
    var rnd = Math.random().toString();
    cnt.attr("data-viewport-id", rnd);
    return rnd;
  }

  function overlay() {
    var overlay = $('<div id="viewport-standby"></div>');
    overlay.hide();
    overlay.append('<div class="message">' + $.msg['standby'] + '</div>');
    return overlay;
  }

  // Loads HTML content from specified location and
  // inserts it into the container (`#viewport` by default).
  function load(href) {
    // Trigger viewport unload
    var e = $.Event("viewportUnload");
    $(window).trigger(e);
    if (e.isDefaultPrevented()) return;
    // Adding "Please wait" overlay, hidden initially
    var o = overlay();
    $("body").append(o);
    // When timeout comes, show the overlay
    var i = setTimeout(function() {
      o.fadeIn(300);
    }, timeout());
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
        var viewportId = id();
        var cnt = $(data);
        // Wrap cnt into <div id="viewport">, if necessary
        if (cnt.attr("id") != "viewport")
          cnt = $('<div id="viewport"/>').append(cnt);
        // Assign current viewport id
        cnt.attr("data-viewport-id", viewportId);
        // Remove the overlay
        o.remove();
        clearTimeout(i);
        // Insert the data
        container().replaceWith(cnt).remove();
        // Clear `active` class from all partial links
        $("a[rel='partial']").removeClass("active");
        // Initialize the container
        $.scalpel.init(cnt);
        // See if site title needs to be replaced
        var newTitle = cnt.attr("data-title");
        if (newTitle) {
          $("head title").text(newTitle);
        }
        // Raise the event
        $("body").trigger("viewportLoad");
        // Navigate to #anchor
        scrollToAnchor();
      },
      error: function(xhr) {
        $.scalpel.ajax.processErrors(xhr);
        // Remove the overlay
        o.remove();
        clearTimeout(i);
      }
    });
  }

  // Navigates to specified `url` by loading the content into #viewport
  function navigate(url, redirect) {
    if (useHistory) {
      // Add one more replaceState with current URL
      // to allow partial `history.go(-1)`.
      window.history.replaceState({ id: id() }, "", location.href);
      if (redirect)
        window.history.replaceState({ id: id() }, "", url);
      else
        window.history.pushState({ id: id() }, "", url);
      load(url);
    } else {
      $.scalpel.notices.stash();
      if (redirect) window.location.replace(url);
      else window.location.href = url;
    }
  }

  function scrollToAnchor() {
    var hash = location.href.replace(/.*?(?=#|$)/, "");
    var scrollTarget = $(hash);
    if (scrollTarget.size() == 0)
      scrollTarget = $(".viewport-anchor").first();
    scrollTarget.scrollTo();
  }

  if (useHistory)
    $.scalpel.queue["a[rel='partial']"] = function() {
      var a = $(this);
      if (a.attr("rel") == "popup" ||
        a.attr("target") == "_blank")
        return;
      a.addClass("partial-link");
      a.unbind(".scalpel.partial-link")
        .bind("click.scalpel.partial-link", function(ev) {
          if (ev.button != 0 || ev.metaKey || ev.ctrlKey)
            return true;
          ev.preventDefault();
          var href = $(this).attr("href");
          navigate(href);
          return false;
        });
    };

  return {
    id: id,
    timeout: timeout,
    container: container,
    navigate: navigate,
    scrollToAnchor: scrollToAnchor
  };

})(jQuery);