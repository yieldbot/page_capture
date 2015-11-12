/**
 * page_capture
 * Copyright (c) 2015 Yieldbot, Inc. - All rights reserved.
 */

/* globals chrome */

'use strict';

(function() {
  var mainfest = chrome.runtime.getManifest();

  /**
   *
   * @param {string} imageBase64
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {function} cb
   * @return {undefined}
   */
  var crop = function(imageBase64, x, y, width, height, cb) {
    var img = new Image();
    img.onload = function() {
      var canvas = document.createElement('canvas');
      var canvasContext = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;

      canvasContext.drawImage(img, x, y, width, height, 0, 0, width, height);

      cb(canvas.toDataURL());
    };
    img.src = imageBase64;
  };

  /**
   *
   * @param {string} selectors
   * @param {function} callback
   * @return {undefined}
   */
  var screenCaptureHandler = function(selectors, callback) {
    var target = document.querySelector(selectors);

    if (!target) {
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
          crop(dataUrl, offset.left, offset.top, offset.width, offset.height, callback);
        });
      }, waitFor);
    }
  };

  // listen to messages from clients using the the public api's
  window.addEventListener('message', function(event) {
    var data = event.data || {};

    if (!data.__index || !data.ns || !data.api) {
      return;
    }

    var send = function(value) {
      var opt = {
        __key: data.__index,
        value: value
      };
      window.postMessage(opt, '*');
    };

    console.log('page_capture api', data.api);

    if (data.api === 'getVersion') {
      send(mainfest.version);
    }

    else if (data.api === 'captureElement') {
      screenCaptureHandler(data.element, function(data) {
        send(data);
      });
    }

    else if (data.api === 'capturePage') {
      chrome.runtime.sendMessage({option: 'screenCapture'}, function(dataUrl) {
        send(dataUrl);
        return true;
      });
    }

    else if (data.api === 'captureSection') {
      chrome.runtime.sendMessage({option: 'screenCapture'}, function(dataUrl) {
        crop(dataUrl, data.x, data.y, data.width, data.height, send);
        return true;
      });
    }
  });

  // inject the api script in the current page document
  var apiScript = document.createElement('script');
  apiScript.src = chrome.extension.getURL('public.api.js');
  apiScript.type = 'text/javascript';
  document.body.appendChild(apiScript);

  console.log();

})();
