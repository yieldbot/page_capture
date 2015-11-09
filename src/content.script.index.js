/**
 * page_capture
 * Copyright (c) 2015 Yieldbot, Inc. - All rights reserved.
 */

/* globals chrome */

'use strict';

(function () {
  var mainfest = chrome.runtime.getManifest();
  console.log('manifest', mainfest);

  /**
   *
   * @param {string} selectors
   * @param {function} callback
   * @return {undefined}
   */
  var screenCaptureHandler = function (selectors, callback) {
    var target = document.querySelector(selectors);

    if(!target){
      callback(null);
    } else {

      var offset = target.getBoundingClientRect();
      var waitFor = 0;

      if (offset.top < 0) {
        target.scrollIntoView();
        waitFor = 200;
      }

      setTimeout(function() {
        offset = target.getBoundingClientRect();
        chrome.runtime.sendMessage({option: 'screenCapture'}, function(dataUrl) {
          var img = new Image();
          img.onload = function() {
            var canvas = document.createElement('canvas');
            var canvasContext = canvas.getContext('2d');
            canvas.width = offset.width;
            canvas.height = offset.height;

            canvasContext.drawImage(img, offset.left, offset.top, offset.width, offset.height, 0, 0, offset.width, offset.height);

            var content = canvas.toDataURL();//'image/jpeg', 1.0);

            callback(content);
          };
          img.src = dataUrl;
        });
      }, waitFor);
    }
  };

  // listen to messages from clients using the the public api's
  window.addEventListener('message', function (event) {
    if (event.data.__index && typeof event.data === 'object' && typeof event.data.api === 'string') {
      console.log('page_capture api', event.data.api);

      if (event.data.api === 'PageCapture.getVersion') {
        window.postMessage({__key: event.data.__index, value: mainfest.version}, '*');
      }

      else if (event.data.api === 'PageCapture.captureElement') {
        screenCaptureHandler(event.data.element, function (data) {
          window.postMessage({__key: event.data.__index, value: data}, '*');
        });
      }

      else if (event.data.api === 'PageCapture.capturePage') {
        chrome.runtime.sendMessage({option: 'screenCapture'}, function (dataUrl) {
          window.postMessage({__key: event.data.__index, value: dataUrl}, '*');
          return true;
        });
      }
    }
  });

  // inject the api script in the current page document
  var apiScript = document.createElement('script');
  apiScript.src = chrome.extension.getURL('content.script.api.js');
  apiScript.type = 'text/javascript';
  document.body.appendChild(apiScript);

  console.log();

})();
