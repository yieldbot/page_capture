/**
 * page_capture
 * Copyright (c) 2015 Yieldbot, Inc. - All rights reserved.
 */

'use strict';

(function() {

  var loadSection = function(section) {
    $('.nav a').removeClass('active');
    if (!section.match(/^(api|quick_start|demo)$/)) {
      section = 'quick_start';
    }
    $('.nav a[href="#' + section + '"]').addClass('active');
    $('#content').load(section + '.html', function() {
      prettyPrint();
    });
  };

  loadSection(location.hash.replace(/^#/, ''));

  $('body').on('click', 'a.section', function() {
    var hash = this.hash.replace(/^#/, '');
    if (hash) {
      loadSection(hash);
    }
  });

})();
