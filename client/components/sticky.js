$.bigfoot.install('[data-sticky]', function() {
  var sticky = this
    , $sticky = $(this)
    , $parent = $(this.parentNode)
    , $wnd = $(window)
    , enabled = true;

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

  function update() {
    if (!enabled)
      return;
    var newY = oldY
      , viewTop = $wnd.scrollTop()
      , viewBottom = viewTop + windowHeight
      , boundTop = Math.max(viewTop + 16, parentTop) - parentTop
      , boundBottom = Math.min(viewBottom - 16, parentBottom) - parentTop
      , alwaysAtTop = stickyHeight < windowHeight && boundTop + stickyHeight < boundBottom;
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
    if (newY == 0) $sticky.addClass('atTop');
    else $sticky.removeClass('atTop');
  }

  // Bind to events
  reinit();
  $wnd.resizeStop(reinit);
  $wnd.scrollAnim(update);

});