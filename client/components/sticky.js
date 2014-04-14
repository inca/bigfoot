$.bigfoot.install('[data-sticky]', function() {
  var sticky = $(this)
    , parent = $(this.parentNode)
    , wnd = $(window)
    , oldY = 0
    , enabled = true
    , continuous = $(this).attr('data-sticky') == 'continuous';
  function update() {
    if (!enabled)
      return;
    var newY = oldY
      , windowHeight = wnd.height()
      , stickyHeight = sticky.height()
      , viewTop = wnd.scrollTop()
      , viewBottom = viewTop + windowHeight
      , parentTop = parent.offset().top
      , parentBottom = parentTop + parent.height()
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
      sticky.css('transform', 'translateY(' + oldY + 'px)')
        .css('-moz-transform', 'translateY(' + oldY + 'px)')
        .css('-webkit-transform', 'translateY(' + oldY + 'px)');
    }
  }
  function reinit() {
    var _float = sticky.css('float');
    var _enabled = _float == 'left' || _float == 'right';
    // Handle special case where "switching" occurs
    if (enabled != _enabled) {
      sticky.removeAttr('style');
      oldY = 0;
    }
    enabled = _enabled;
    update();
  }
  // Bind to events
  reinit();
  if (continuous)
    wnd.scroll(update);
  else
    wnd.scrollStop(update);
  wnd.resizeStop(reinit);
});