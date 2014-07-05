$.bigfoot.install('[data-sticky]', function() {
  var sticky = this
    , $sticky = $(this)
    , $parent = $(this.parentNode)
    , $wnd = $(window)
    , enabled = true
    , updating = false
    , raf = window.requestAnimationFrame;

  var oldY, viewTop, windowHeight, stickyHeight, parentTop, parentBottom;

  function reinit() {
    var _float = $sticky.css('float');
    var _enabled = _float == 'left' || _float == 'right';
    // Handle special case where "switching" occurs
    if (enabled != _enabled) {
      $sticky.removeAttr('style');
      oldY = 0; // TODO remove this?
    }
    enabled = _enabled;
    oldY = 0;  // TODO Or this?
    viewTop = $wnd.scrollTop();
    windowHeight = $wnd.height();
    stickyHeight = $sticky.height();
    parentTop = $parent.offset().top;
    parentBottom = parentTop + $parent.height();
    update();
  }

  function onScroll() {
    if (!enabled)
      return;
    viewTop = $wnd.scrollTop();
    requestUpdate();
  }

  function requestUpdate() {
    if (!updating) raf(update);
    updating = true;
  }

  function update() {
    var newY = oldY
      , viewBottom = viewTop + windowHeight
      , boundTop = Math.max(viewTop + 16, parentTop) - parentTop
      , boundBottom = Math.min(viewBottom - 16, parentBottom) - parentTop
      , alwaysAtTop = stickyHeight < windowHeight && boundTop + stickyHeight < boundBottom;
    updating = false;
    if (boundTop > oldY && boundBottom < oldY + stickyHeight)
      return;
    if (boundTop < oldY || alwaysAtTop) {
      newY = boundTop;
    } else if (boundBottom > oldY + stickyHeight) {
      newY = boundBottom - stickyHeight;
    }
    if (newY != oldY) {
      oldY = newY;
      sticky.style.webkitTransform =
        sticky.style.MozTransform =
          sticky.style.msTransform =
            sticky.style.OTransform =
              sticky.style.transform =
                'translateY(' + oldY + 'px)';
    }
  }

  // Bind to events
  reinit();
  $wnd.resizeStop(reinit);
  $wnd.scroll(onScroll);

});