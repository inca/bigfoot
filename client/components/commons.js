$.bigfoot.placeholder = function() {
  return $('<div class="loading"/>')
};

$.bigfoot.push('[data-ref]', function() {
  var selector = $(this).attr("data-ref");
  var cssClass = $(this).attr("data-ref-class");
  if (!cssClass)
    cssClass = "active";
  $(selector).addClass(cssClass);
});

$.bigfoot.push('.focus', function() {
  $(this).focus();
});

$.bigfoot.push('[data-set-focus]', function() {
  $(this).unbind(".bigfoot.setFocus")
    .bind("click.bigfoot.setFocus", function () {
      $($(this).attr("data-set-focus")).focus();
    });
});

$.bigfoot.push('a[rel="popup"]', function() {
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

$.bigfoot.push('[data-show]', function() {
  var elem = $(this);
  elem.unbind(".bigfoot.show")
    .bind("click.bigfoot.show", function() {
      $(elem.attr("data-show")).show(0, function() {
        // Special case if combined with data-set-focus
        $(elem.attr("data-set-focus")).focus();
      });
    });
});

$.bigfoot.push('[data-hide]', function() {
  $(this).unbind(".bigfoot.hide")
    .bind("click.bigfoot.hide", function() {
      $($(this).attr("data-hide")).hide();
    });
});
