$.bigfoot.install('[data-method][data-action]', function() {
  var e = $(this);
  var method = e.attr("data-method").toUpperCase();
  var action = e.attr("data-action");
  e.click(function(ev) {
    ev.preventDefault();
    $.bigfoot.viewport.showStandBy();
    $.ajax({
      dataType: "json",
      url: action,
      data: { "__" : new Date().getTime().toString() },
      type: method,
      success: function(data) {
        e.trigger("postSubmit", data);
        $.bigfoot.ajax.processResponse(data);
        if (!data.redirect) {
          $.bigfoot.viewport.hideStandBy();
        }
      },
      error: function(xhr) {
        $.bigfoot.ajax.processErrors(xhr);
        $.bigfoot.viewport.hideStandBy();
      }
    });
    return false;
  });
});
