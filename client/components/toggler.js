$.bigfoot.install('.toggler', function() {

  var toggler = $(this);

  var buttons = $("*[data-for]", toggler);

  var cssClass = toggler.attr("data-toggler-class");
  if (!cssClass)
    cssClass = "active";

  function updateButtons() {
    buttons.each(function() {
      var b = $(this);
      var target = $(b.attr("data-for"));
      if (target.is(":visible"))
        b.addClass(cssClass);
      else b.removeClass(cssClass);
    });
  }

  function hideAll() {
    buttons.each(function() {
      $($(this).attr("data-for")).hide();
    });
  }

  buttons.unbind(".bigfoot.toggler")
    .bind("click.bigfoot.toggler", function(ev) {
      ev.preventDefault();
      var b = $(this);
      // hide all targets
      hideAll();
      // show this one
      $(b.attr("data-for")).show();
      // update buttons state
      updateButtons();
      return false;
    });

  // Init from markup -- or by reading button classes
  var active = buttons.filter('.' + cssClass);
  if (active.size() == 0) // Init toggler by reading related markup
    updateButtons();
  else { // Hide all targets except initial
    hideAll();
    $(active.attr('data-for')).show();
  }
});
