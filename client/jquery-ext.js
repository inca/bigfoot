$.fn.lookup = function(selector) {
  if (!selector)
    return this;
  var elems = this.find(selector);
  if (this.is(selector))
    return elems.add(this);
  else return elems;
};

// Insert at index function

$.fn.insertAt = function(index, element) {
  var lastIndex = this.children().size();
  if (index < 0) {
    index = Math.max(0, lastIndex + 1 + index)
  }
  this.append(element);
  if (index < lastIndex) {
    this.children().eq(index).before(this.children().last());
  }
  return this;
};

// Insert-at-caret

$.fn.insertAtCaret = function(value) {
  return this.each(function() {
    if (document.selection) {
      this.focus();
      var sel = document.selection.createRange();
      sel.text = value;
      this.focus();
    } else if (typeof(this.selectionStart) != "undefined") {
      var startPos = this.selectionStart;
      var endPos = this.selectionEnd;
      var scrollTop = this.scrollTop;
      this.value = this.value.substring(0, startPos) +
        value + this.value.substring(endPos,this.value.length);
      this.focus();
      this.selectionStart = startPos + value.length;
      this.selectionEnd = startPos + value.length;
      this.scrollTop = scrollTop;
    } else {
      this.value += value;
      this.focus();
    }
  })
};

// Scroll to element

$.fn.scrollTo = function() {

  var scrollTop = -1;

  this.each(function() {
    scrollTop = $(this).offset().top;
  });

  if (scrollTop >= 0)
    $("html, body").animate({
      "scrollTop": scrollTop
    }, 300);
};

// Shuffle elements

$.fn.shuffle = function() {

  function rnd(max) {
    return Math.floor(Math.random() * max);
  }

  var all = this.get();

  var shuffled = $.map(all, function() {
    var random = rnd(all.length),
      randEl = $(all[random]).clone(true)[0];
    all.splice(random, 1);
    return randEl;
  });

  this.each(function(i){
    $(this).replaceWith($(shuffled[i]));
  });

  return $(shuffled);

};

// Events on scroll stop

$.fn.scrollStop = function(cb) {
  var timer;
  $(this).bind('scroll.scrollStop', function(ev) {
    var elem = this;
    clearTimeout(timer);
    timer = setTimeout(function() {
      cb.call(elem, ev);
    }, 100);
  });
};

// Events on resize stop

$.fn.resizeStop = function(cb) {
  var timer;
  $(this).bind('resize.resizeStop', function(ev) {
    var elem = this;
    clearTimeout(timer);
    timer = setTimeout(function() {
      cb.call(elem, ev);
    }, 100);
  });
};

// Events on scroll per animation frame

$.fn.scrollAnim = function(cb) {

  var updating = false
    , raf = window.requestAnimationFrame;

  if (typeof raf != 'function')
    return $(this).scroll(cb);

  function onScroll(ev) {
    if (!updating)
      raf(function() {
        updating = false;
        cb(ev);
      });
    updating = true;
  }

  return $(this).bind('scroll', onScroll);

};
