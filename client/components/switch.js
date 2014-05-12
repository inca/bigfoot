$.bigfoot.switcher = {

  hideAll: function(currentTarget) {
    $(".switch-target").filter(function(){
      return this != currentTarget;
    }).hide();
    $("[data-switch]").each(function() {
      var e = $(this);
      var cssClass = e.attr("data-switch-class");
      if (!cssClass)
        cssClass = "active";
      e.removeClass(cssClass);
    });
  }

};

// Hide all open targets on click outside

$(function() {
  $("html").bind("click.bigfoot.switcher", function() {
    $.bigfoot.switcher.hideAll();
  });
});

$.bigfoot.install('[data-switch]', function() {

  var switcher = $(this);

  var cssClass = switcher.attr("data-switch-class");
  if (!cssClass)
    cssClass = "active";

  var target = $(switcher.attr("data-switch"));
  target.addClass("switch-target");

  if (switcher.hasClass("switch-stay"))
    target.click(function(ev) {
      ev.stopPropagation();
    });

  function update() {
    if (target.is(":visible")) {
      switcher.addClass(cssClass);
    } else {
      switcher.removeClass(cssClass);
    }
  }

  update();

  function toggle() {
    target.toggle(0, update);
  }

  function close() {
    target.hide(0, update);
  }

  switcher
    .unbind('.bigfoot.switch')
    .bind("click.bigfoot.switch", function(ev) {
      ev.preventDefault();
      $.bigfoot.switcher.hideAll(target[0]);
      toggle();
      return false;
    });

  $(switcher).find('.close')
    .unbind('.bigfoot.switch')
    .bind('click.bigfoot.switch', function(ev) {
      ev.preventDefault();
      close();
      return false;
    });

});
