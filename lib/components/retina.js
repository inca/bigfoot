'use strict';

module.exports = (function($) {

  $.scalpel.isRetina = function() {
    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
                      (min--moz-device-pixel-ratio: 1.5),\
                      (-o-min-device-pixel-ratio: 3/2),\
                      (min-resolution: 1.5dppx)";
    if (window.devicePixelRatio > 1)
      return true;
    return window.matchMedia && window.matchMedia(mediaQuery).matches;
  };

  $.scalpel.queue['img.retina'] = function() {
    var img = $(this);

    if ($.scalpel.isRetina()) {
      if (img[0].complete) swap();
      else img.one('load.scalpel.retina', swap);
    }

    function swap() {
      var width = img.width();
      var height = img.height();
      img.attr('src', img.attr('src').replace(/\.([^.]+)$/, '@2X.$1'));
      img.attr('width', width);
      img.attr('height', height);
    }

  };

})(jQuery);