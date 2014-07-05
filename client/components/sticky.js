$.bigfoot.install('[data-sticky]', function() {
  var sticky = this
    , $sticky = $(this)
    , $parent = $(this.parentNode)
    , $wnd = $(window)
    , confStr = $sticky.attr('data-sticky')
    , enabled = true
    , detectBounds = confStr.indexOf('detect-bounds') >= 0;

  var updating = false
    , raf = window.requestAnimationFrame;

  var oldY, viewTop, windowHeight, stickyHeight, parentTop, parentBottom;

  function reinit() {
    var _float = $sticky.css('float');
    var _enabled = _float == 'left' || _float == 'right';
    // Handle special case where "switching" occurs
    if (enabled != _enabled)
      $sticky.removeAttr('style');
    // Recalc dimensions
    enabled = _enabled;
    oldY = 0;
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
      if (detectBounds)
        $sticky.addClass('boundTop');
    } else if (boundBottom > oldY + stickyHeight) {
      newY = boundBottom - stickyHeight;
      if (detectBounds)
        $sticky.addClass('boundBottom');
    } else if (detectBounds) {
      $sticky.removeClass('boundTop').removeClass('boundBottom');
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