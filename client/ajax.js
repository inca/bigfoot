$.bigfoot.msg['ajax.authRequired'] = "You need to login to continue.";
$.bigfoot.msg['ajax.serverDown'] = "Server is down for scheduled maintenance.";
$.bigfoot.msg['ajax.requestTimeout'] = "Request took too long to process. Please try again soon.";
$.bigfoot.msg['ajax.accessDenied'] = "You have insufficient permissions to access the resource.";
$.bigfoot.msg['ajax.failed'] = "Your request could not be processed. Please contact technical support.";

$.bigfoot.ajax = {

  processResponse: function(data, stay) {
    $.bigfoot.notices.clear();
    $.bigfoot.notices.addAll(data);
    if (data.redirect && !stay) {
      $.bigfoot.notices.stash();
      window.location.replace(data.redirect);
    }
  },

  processErrors: function(xhr) {
    if (xhr.status == 0) return true;
    else if (xhr.status == 401)
      $.bigfoot.notices.warn($.bigfoot.msg['ajax.authRequired']);
    else if (xhr.status == 502)
      $.bigfoot.notices.error($.bigfoot.msg['ajax.serverDown']);
    else if (xhr.status == 504)
      $.bigfoot.notices.error($.bigfoot.msg['ajax.requestTimeout']);
    else if (xhr.status == 403)
      $.bigfoot.notices.error($.bigfoot.msg['ajax.accessDenied']);
    else $.bigfoot.notices.error($.bigfoot.msg['ajax.failed']);
    return false;
  }

};
