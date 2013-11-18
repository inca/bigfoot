$.bigfoot = {

  settings: {},

  msg: {},

  log: function(text) {
    if (typeof(console) != "undefined" && typeof(console.log) == "function")
      console.log(text);
  },

  queue: [],

  init: function(ctx) {
    this.queue.forEach(function(handle) {
      ctx.lookup(handle.selector).each(handle.fn)
    });
  },

  install: function(selector, fn) {
    this.queue.push({ selector: selector, fn: fn });
    return this;
  },

  installLast: this.install,

  installFirst: function(selector, fn) {
    this.queue.unshift({ selector: selector, fn: fn });
    return this;
  },

  installBefore: function(that, selector, fn) {
    for (var i = 0; i < this.queue.length; i++)
      if (this.queue[i].selector == that)
        break;
    this.queue.splice(i, 0, { selector: selector, fn: fn });
    return this;
  },

  installAfter: function(that, selector, fn) {
    for (var i = 0; i < this.queue.length; i++)
      if (this.queue[i].selector == that)
        break;
    if (i == this.queue.length)
      this.installLast(selector, fn);
    else
      this.queue.splice(i + 1, 0, { selector: selector, fn: fn });
  },

  replace: function(selector, fn) {
    for (var i = 0; i < this.queue.length; i++)
      if (this.queue[i].selector == selector)
        break;
    if (i == this.queue.length)
      $.bigfoot.log('Replacing “' + selector + '” failed. Try installing instead.');
    else
      this.queue.splice(i, 1, { selector: selector, fn: fn });
  }

};
