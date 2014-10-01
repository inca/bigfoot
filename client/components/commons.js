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
