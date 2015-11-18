/**
 * page_capture
 * Copyright (c) 2015 Yieldbot, Inc. - All rights reserved.
 */

'use strict';

(function() {
  var isLocal = /file/.test(location.protocol);

  var pcQueue = pcQueue || [];
  var result = document.getElementById('result');

//pcQueue.push(function() {
//
//  document.getElementById('get_version').disabled = false;
//  document.getElementById('get_version').onclick = function() {
//    PageCapture.getVersion(function(v) {
//      result.innerHTML = 'version = ' + v;
//    });
//  };
//
//  document.getElementById('pc_box1').disabled = false;
//  document.getElementById('pc_box1').onclick = function() {
//    var selector = document.getElementById('#elementId').value.trim();
//    PageCapture.captureElement(selector, function(img) {
//      result.innerHTML = '<img src="' + img + '">';
//    });
//  };
//
//  document.getElementById('pc_page').disabled = false;
//  document.getElementById('pc_page').onclick = function() {
//    PageCapture.capturePage(function(img) {
//      result.innerHTML = '<img src="' + img + '">';
//    });
//  };
//
//  document.getElementById('pc_section').disabled = false;
//  document.getElementById('pc_section').onclick = function() {
//    var x = document.getElementById('section_x').value.trim();
//    var y = document.getElementById('section_y').value.trim();
//    var width = document.getElementById('section_w').value.trim();
//    var height = document.getElementById('section_h').value.trim();
//    PageCapture.captureSection(x, y, width, height, function(img) {
//      result.innerHTML = '<img src="' + img + '">';
//    });
//  };
//
//  document.getElementById('pc_image').disabled = false;
//  document.getElementById('pc_image').onclick = function() {
//    var url = document.getElementById('image_url').value;
//    PageCapture.captureImage(url, 300, 250, function(img) {
//      result.innerHTML = '<img src="' + img + '">';
//    });
//  };
//
//  document.getElementById('pc_url').disabled = false;
//  document.getElementById('pc_url').onclick = function() {
//    var url = document.getElementById('url').value;
//    PageCapture.captureUrl(url, function(img) {
//      result.innerHTML = '<img src="' + img + '">';
//    });
//  };
//
//  document.getElementById('pc_url2').disabled = false;
//  document.getElementById('pc_url2').onclick = function() {
//    var url = document.getElementById('url2').value;
//    var overlay = document.getElementById('overlay_image').value;
//    var includeOverlay = document.getElementById('include_overlay').checked;
//    PageCapture.captureUrlWithOverlay(url, overlay, includeOverlay, function(data) {
//      var overlayInfo = 'Raw Response <pre>' + JSON.stringify(data, null, 2) + '</pre><br>';
//      result.innerHTML = overlayInfo + '<img src="' + data.img + '">';
//    });
//  };
//
//});

  var loadSection = function(section){
    $('.nav a').removeClass('active');
    if(!section.match(/^(api|quick_start|demo)$/)){
      section = 'quick_start';
    }
    $('.nav a[href="#' + section + '"]').addClass('active');
    $('#content').load(section + '.html', function(){
      prettyPrint();
    });
  };

  loadSection(location.hash.replace(/^#/, ''));

  $('body').on('click', 'a.section', function() {
    var hash = this.hash.replace(/^#/, '');
    if(hash){
      loadSection(hash);
    }
  });

})();
