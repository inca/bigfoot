'use strict';

module.exports = (function($) {

  $.scalpel.placeholder = function() {
    return $('<div class="loading"/>')
  };

  $.scalpel.queue['[data-deref]'] = function() {
    var selector = $(this).attr("data-deref");
    var cssClass = $(this).attr("data-deref-class");
    if (!cssClass)
      cssClass = "active";
    $(selector).removeClass(cssClass);
  };

  $.scalpel.queue['[data-ref]'] = function() {
    var selector = $(this).attr("data-ref");
    var cssClass = $(this).attr("data-ref-class");
    if (!cssClass)
      cssClass = "active";
    $(selector).addClass(cssClass);
  };

  $.scalpel.queue['.focus'] = function() {
    $(this).focus();
  };

  $.scalpel.queue['[data-set-focus]'] = function() {
    $(this).unbind(".scalpel.setFocus")
      .bind("click.scalpel.setFocus", function () {
        $($(this).attr("data-set-focus")).focus();
      });
  };

  $.scalpel.queue['a[rel="popup"]'] = function() {
    $(this).unbind("click.scalpel.popup")
      .bind("click.scalpel.popup", function(ev) {
        var a = $(this);
        var href = a.attr("href");
        if (href) {
          $.scalpel.ibox.load(href);
          ev.preventDefault();
          return false;
        }
      });
  };

  $.scalpel.queue['[data-show]'] = function() {
    $(this).unbind(".scalpel.show")
      .bind("click.scalpel.show", function () {
        $($(this).attr("data-show")).show();
      });
  };

  $.scalpel.queue['[data-hide]'] = function() {
    $(this).unbind(".scalpel.hide")
      .bind("click.scalpel.hide", function () {
        $($(this).attr("data-hide")).hide();
      });
  };

  $.scalpel.queue['form .instant-edit'] = function() {
    var field = $(this);
    var form = field.parents("form");
    if (form.size() <= 0)
      return;
    var input = field.is(":input") ? field : $(":input", field);
    // Submit on change
    input
      .unbind(".scalpel.instantEdit")
      .bind("change.scalpel.instantEdit", function() {
        form.submit();
      });
  };

})(jQuery);