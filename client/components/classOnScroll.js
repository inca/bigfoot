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

});
