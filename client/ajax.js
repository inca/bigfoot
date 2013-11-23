$.bigfoot.msg['ajax.authRequired'] = "You need to login to continue.";
$.bigfoot.msg['ajax.accessDenied'] = "You have insufficient permissions to access the resource.";
$.bigfoot.msg['ajax.failed'] = "Your request could not be processed. Please contact technical support.";
$.bigfoot.msg['ajax.tooLarge'] = "Your request exceeds the size limit.";

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
    switch (xhr.status) {
      case 0:
        return true;
      case 401:
        $.bigfoot.notices.warn($.bigfoot.msg['ajax.authRequired']);
        break;
      case 403:
        $.bigfoot.notices.error($.bigfoot.msg['ajax.accessDenied']);
        break;
      case 413:
        $.bigfoot.notices.error($.bigfoot.msg['ajax.tooLarge']);
        break;
      default:
        $.bigfoot.notices.error($.bigfoot.msg['ajax.failed']);
    }
    return false;
  }

};
