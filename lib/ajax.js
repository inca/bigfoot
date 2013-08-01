'use strict';

module.exports = (function($) {

  $.msg['ajax.authRequired'] = "You need to login to continue.";
  $.msg['ajax.serverDown'] = "Server is down for scheduled maintenance.";
  $.msg['ajax.requestTimeout'] = "Request took too long to process. Please try again soon.";
  $.msg['ajax.accessDenied'] = "You have insufficient permissions to access the resource.";
  $.msg['ajax.failed'] = "Your request could not be processed. Please contact technical support.";

  var inputTypes = ["text", "checkbox", "radio", "select", "textarea", "date"];

  function processResponse(data, stay) {
    $.scalpel.notices.clear();
    $.scalpel.notices.addAll(data);
    if (data.redirect && !stay) {
      $.scalpel.notices.stash();
      window.location.replace(data.redirect);
    }
  }

  function processErrors(xhr) {
    if (xhr.status == 0) return true;
    else if (xhr.status == 401)
      $.scalpel.notices.addWarn($.msg['ajax.authRequired']);
    else if (xhr.status == 502)
      $.scalpel.notices.addError($.msg['ajax.serverDown']);
    else if (xhr.status == 504)
      $.scalpel.notices.addError($.msg['ajax.requestTimeout']);
    else if (xhr.status == 403)
      $.scalpel.notices.addError($.msg['ajax.accessDenied']);
    else $.scalpel.notices.addError($.msg['ajax.failed']);
    return false;
  }

  return {
    processResponse: processResponse,
    processErrors: processErrors,
    inputTypes: inputTypes
  };

})(jQuery);