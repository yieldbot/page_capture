/**
 * page_capture
 * Copyright (c) 2016 Yieldbot, Inc. - All rights reserved.
 */

/* global paddingTop, paddingLeft, paddingRight, paddingBottom, paddingColor, captureButton */

'use strict';

(function() {
  var sendSpacing = function(e) {
    e.preventDefault();
    var opt = {
      ns: 'page_capture',
      api: '_padding',
      direction: this.name,
      value: this.value,
      __index: -1,
    };
    parent.postMessage(opt, '*');
  };

  var onClickHandler = function(e) {
    e.preventDefault();
    var opt = {
      ns: 'page_capture',
      api: '_capture',
      __index: -1,
    };
    parent.postMessage(opt, '*');
  };

  var colorInputHandler = function(e){
    e.preventDefault();
    var opt = {
      ns: 'page_capture',
      api: '_paddingColor',
      value: this.value,
      __index: -1,
    };
    parent.postMessage(opt, '*');
  };

  paddingTop.onchange = sendSpacing;
  paddingTop.oninput = sendSpacing;

  paddingLeft.onchange = sendSpacing;
  paddingLeft.oninput = sendSpacing;

  paddingRight.onchange = sendSpacing;
  paddingRight.oninput = sendSpacing;

  paddingBottom.onchange = sendSpacing;
  paddingBottom.oninput = sendSpacing;

  paddingColor.oninput = colorInputHandler;

  var isMobile = /iPhone|iPad|iPod|Android|BB10|Mobile/i.test(navigator.userAgent);
  if (isMobile) {
    captureButton.addEventListener('touchend', onClickHandler, false);
  } else {
    captureButton.addEventListener('click', onClickHandler, false);
  }

  if(location.hash === '#false'){
    document.querySelector('#ctn').style.display = 'block';
    document.querySelector('#btn-ctn').style.textAlign = 'center';
    var elements = document.querySelectorAll('.img-contols');
    for(var i=0; i<elements.length; i++){
      elements[i].style.display = 'none';
    }
  }

})();
