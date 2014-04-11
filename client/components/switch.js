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
  var url = target.attr('data-url');

  if (switcher.hasClass("switch-stay"))
    target.click(function(ev) {
      ev.stopPropagation();
    });

  function update() {
    if (target.is(":visible")) {
      switcher.addClass(cssClass);
      if (url) { // If data-url attr exists, load remote content into target
        target.empty();
        // Insert placeholder into container
        var ph = $.bigfoot.placeholder();
        target.append(ph);
        // Do AJAX
        $.bigfoot.log("[dropdown] GET " + url);
        $.ajax({
          dataType: "html",
          url: url,
          type: 'get',
          success: function(data) {
            ph.remove();
            target.append(data);
            $.bigfoot.init(target);
          },
          error: function(xhr) {
            ph.remove();
            $.bigfoot.ajax.processErrors(xhr);
          }
        });
      }
    } else {
      switcher.removeClass(cssClass);
    }
  }

  update();

  function toggle() {
    switcher.toggleClass(cssClass);
    target.toggle(0, update);
  }

  switcher.bind("click.bigfoot.switch", function() {
    $.bigfoot.switcher.hideAll(target[0]);
    toggle();
    return false;
  });

});
