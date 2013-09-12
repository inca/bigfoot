'use strict';

module.exports = (function($) {

  $.scalpel.queue['form'] = function() {

    var form = $(this);

    form.bind("submit.scalpel.forms", function(ev) {
      // Default submit function on DOM is sometimes rewritten,
      // so we delegate standard submit event to `DOM.submit()`
      ev.preventDefault();
      // Read-only forms do not submit.
      if (form.hasClass("readonly")) {
        return false;
      } else this.submit();
      return false;
    });

    // Handlers is an array of functions which are executed one-by-one
    // before form submission. They are designed to modify parameters
    // sent to server on submit.

    form[0].handlers = [];

    form[0].executeHandlers = function(params) {
      for (var i in form[0].handlers) {
        var handler = form[0].handlers[i];
        var result = handler.call(form[0], { params: params });
        if (result === false)
          return false;
      }
      return true;
    };

  };

// Partial forms are somewhat PJAXy, but notices-aware.

  $.scalpel.queue['form.partial'] = function() {

    var form = $(this);

    var stay = form.hasClass("stay");
    var action = form.attr("action");
    var method = form.attr("method").toUpperCase();
    var multipart = form.attr('enctype') == 'multipart/form-data';

    form[0].submit = function() {
      if (form.hasClass("readonly")) return;
      // Replace submission buttons with loading placeholder temporarily
      var ph = $.scalpel.placeholder();
      var submits = $(".submits", form);
      var h = submits.height();
      submits.hide();
      ph.insertAfter(submits);
      ph.height(h);
      // Prepare params
      var params = form[0];
      if (multipart)
        $.scalpel.log(method + " " + action + " [multipart data]");
      else {
        params = $(":not(.exclude)", form).serializeArray();
        params.push({
          name: "__",
          value: new Date().getTime().toString()
        });
        // Execute handlers
        if (!form[0].executeHandlers(params)) { // Submit prevented
          submits.show();
          ph.remove();
          return;
        }
        $.scalpel.log(method + " " + action + " " + JSON.stringify(params));
      }
      // Now do AJAX
      if (method == "GET") {
        var url = action + "?" + $.param(params);
        $.scalpel.viewport.navigate(url);
      } else {
        var settings = {
          data: params,
          dataType: "json",
          url: action,
          type: method,
          cache: false,
          success: function(data) {
            form.trigger("postSubmit", data);
            $.scalpel.ajax.processResponse(data, stay);
            submits.show();
            ph.remove();
            $("input[type='password'], .cleanup", form).val("");
          },
          error: function(xhr) {
            submits.show();
            ph.remove();
            $.scalpel.ajax.processErrors(xhr);
          }
        };
        if (multipart) {
          settings.processData = false;
          settings.contentType = false;
        }
        // Perform ajax submit
        $.ajax(settings);
      }
    };

  };

// Controls inside forms marked `.submit` will submit the form.

  $.scalpel.queue['form :input.submit'] = function() {

    var input = $(this);

    input.unbind(".scalpel.submit")
      .bind("change.scalpel.submit", function() {
        var form = input.parents("form");
        form.submit();
      });

  };

  $.scalpel.queue['form a.submit'] = function() {
    var a = $(this);
    a.unbind(".scalpel.submit")
      .bind("click.scalpel.submit", function(ev) {
        a.parents("form").submit();
        ev.preventDefault();
        return false;
      });
  };

// Forms marked `data-load-into` load the contents into specified container element.

  $.scalpel.queue['form[data-load-into]'] = function() {
    var form = $(this);
    var cnt = $(form.attr("data-load-into"));

    var method = form.attr("method");
    var action = form.attr("action");

    form[0].submit = function() {
      // Insert placeholder into container
      var ph = $.scalpel.placeholder();
      var submits = $(".submits", form);
      submits.hide();
      cnt.empty().append(ph);
      // Prepare params
      var params = $(":not(.exclude)", form).serializeArray();
      params.push({"name": "__", "value": new Date().getTime().toString()});
      // Execute handlers
      if (!form[0].executeHandlers(params)) { // Submit prevented
        submits.show();
        ph.remove();
        return;
      }
      // Do AJAX
      $.scalpel.log(method + " " + action + " " + JSON.stringify(params));
      $.ajax({
        data: params,
        dataType: "html",
        url: action,
        type: method,
        success: function(data) {
          form.trigger("postSubmit", data);
          ph.remove();
          cnt.append(data);
          $.scalpel.init(cnt);
        },
        error: function(xhr) {
          ph.remove();
          submits.show();
          $.scalpel.ajax.processErrors(xhr);
        }
      });
    };
  };

// Warnings can be shown on unload, if the form marked `.unload-warn` has changed.

  $.msg["form.unload.warn"] = "Warning! If you leave this page, all unsaved changes will be lost.";
  $.msg["viewportUnload.warn"] = "Warning! If you continue, all unsaved changed will be lost. Are you sure you want to continue?";

  $.scalpel.queue["form.unload-warn"] = function() {
    var form = $(this);
    updateInitialState();
    form.bind("submit.scalpel.unload-warn", updateInitialState);

    function updateInitialState() {
      var data = $(":not(.exclude)", form).serialize();
      form.data("initial-state", data);
    }

    $(window).unbind("beforeunload.scalpel")
      .bind("beforeunload.scalpel.unload-warn", function() {
        var changedForms = $("form.unload-warn").filter(function() {
          var f = $(this);
          var currentState = $(":not(.exclude)", f).serialize();
          var initialState = f.data("initial-state");
          return currentState != initialState && f.is(":visible")
        });
        if (changedForms.size() > 0) return $.msg['form.unload.warn'];
      });

    $(window).unbind("viewportUnload.scalpel")
      .bind("viewportUnload.scalpel.unload-warn", function(ev) {
        var changedForms = $("form.unload-warn").filter(function() {
          var f = $(this);
          var currentState = $(":not(.exclude)", f).serialize();
          var initialState = f.data("initial-state");
          return currentState != initialState;
        });
        if (changedForms.size() > 0) {
          if (!confirm($.msg['viewportUnload.warn']))
            ev.preventDefault();
        }
      });
  };

})(jQuery);

