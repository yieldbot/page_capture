/**
 * page_capture
 * Copyright (c) 2015 Yieldbot, Inc. - All rights reserved.
 */

/* globals chrome */

'use strict';

(function() {
  var manifest = chrome.runtime.getManifest();

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
        chrome.runtime.sendMessage({api: 'screenCapture'}, function(dataUrl) {
          crop(dataUrl, offset.left, offset.top, offset.width, offset.height, callback);
        });
      }, waitFor);
    }
  };

  var createControlPanel = function(){
    var frame = document.getElementById('yb-ad-builder');
    if(!frame) {
      frame = document.createElement('iframe');
      frame.setAttribute('id', 'yb-ad-builder');
      document.body.appendChild(frame);
    }
    frame.setAttribute('width', '100%');
    frame.setAttribute('height', '50px');
    frame.setAttribute('frameborder', '0');
    frame.setAttribute('style', 'position:fixed;left:0;bottom:0;border-top:2px solid #bbb;z-index:99999;min-height:50px;background:#fff;');
    //frame.setAttribute('src', chrome.extension.getURL('control_panel.html'));
    frame.contentDocument.body.innerHTML = [
      '<div style="background:#fff;">',
      '<button id="capture_btn">capture page</button>',
      '</div>'
    ].join('');

    return frame.contentDocument;
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
      send(manifest.version);
    }

    else if (data.api === 'captureElement') {
      screenCaptureHandler(data.element, function(data) {
        send(data);
        return true;
      });
    }

    else if (data.api === 'capturePage') {
      chrome.runtime.sendMessage({api: 'screenCapture'}, function(dataUrl) {
        send(dataUrl);
        return true;
      });
    }

    else if (data.api === 'captureSection') {
      chrome.runtime.sendMessage({api: 'screenCapture'}, function(dataUrl) {
        crop(dataUrl, data.x, data.y, data.width, data.height, send);
        return true;
      });
    }

    else if (data.api === 'captureUrl') {
      chrome.runtime.sendMessage(data, function(dataUrl) {
        send(dataUrl);
        return true;
      });
    }
  });

  // listens for messages from the background script
  chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.option === 'addControls') {
      var frameDoc = createControlPanel();

      setTimeout(function(){
        frameDoc.body.onclick = function(e) {
          document.getElementById('yb-ad-builder').style.display = 'none';
          if(e.target.id === 'capture_btn') {
            chrome.runtime.sendMessage({api: 'screenCapture'}, function (dataUrl) {
              sendResponse(dataUrl);
              return true;
            });
          }
        };
      }, 500);
    }
    // all for asynchronously response
    return true;
  });

  // inject the api script in the current page document
  var apiScript = document.createElement('script');
  apiScript.src = chrome.extension.getURL('public.api.js');
  apiScript.type = 'text/javascript';
  document.body.appendChild(apiScript);

  console.log();

})();
