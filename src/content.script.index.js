/**
 * page_capture
 * Copyright (c) 2015 Yieldbot, Inc. - All rights reserved.
 */

/* globals chrome */

'use strict';

(function() {
  var manifest = chrome.runtime.getManifest();
  var _controlPanel = null;
  var _image = null;
  var _imageContainer = null;
  var _message = null;
  var _sendResponse = null;

  /**
   *
   * @param {string} imageBase64
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} zoomFactor
   * @param {function} cb
   * @return {undefined}
   */
  var crop = function(imageBase64, x, y, width, height, zoomFactor, cb) {
    var img = new Image();
    img.onload = function() {
      var canvas = document.createElement('canvas');
      var canvasContext = canvas.getContext('2d');

      canvas.width = width;
      canvas.height = height;

      // update the properties if the zoom level is not 100%
      if (zoomFactor !== 1) {
        x = x * zoomFactor;
        y = y * zoomFactor;
        width = width * zoomFactor;
        height = height * zoomFactor;
      }

      canvasContext.drawImage(img, x, y, width, height, 0, 0, canvas.width, canvas.height);

      cb(canvas.toDataURL('image/jpeg', 1));
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
      setTimeout(function() {
        var offset = target.getBoundingClientRect();
        chrome.runtime.sendMessage({api: 'screenCapture'}, function(data) {
          crop(data.img, offset.left, offset.top, offset.width, offset.height, data.zoomFactor, callback);
        });
      }, 400);
    }
  };

  /**
   *
   * @return {HTMLDivElement}
   */
  var createControlPanel = function(hasImg){
    var panel = document.getElementById('pc-control-panel');
    if(!panel) {
      panel = document.createElement('iframe');
      panel.setAttribute('id', 'pc-control-panel');
      panel.setAttribute('src', chrome.extension.getURL('control.panel.html#'+hasImg));
      document.body.appendChild(panel);
    }
    panel.style.position = 'fixed';
    panel.style.top = '100px';
    panel.style.right = '10px';
    panel.style.width = '250px';
    panel.style.height = !hasImg ? '50px' : '105px';
    panel.style.border = '2px solid #aaa';
    panel.style.zIndex = '99999999';
    panel.style.borderRadius = '5px';
    panel.style.boxShadow = '0 0 30px 0 #aaa';
    return panel;
  };

  var applyPadding = function(data){
    if(_imageContainer && data.direction){
      var pos;
      if(data.direction === 'top'){
        pos = 'borderTopWidth';
      }
      if(data.direction === 'left'){
        pos = 'borderLeftWidth';
      }
      if(data.direction === 'right'){
        pos = 'borderRightWidth';
      }
      if(data.direction === 'bottom'){
        pos = 'borderBottomWidth';
      }
      _imageContainer.style[pos] = data.value + 'px';
    }
  };

  var applyPaddingColor = function(data){
    if(_imageContainer && data.value){
      _imageContainer.style.borderColor = data.value;
    }
  };

  var captureBtnHandler = function(){
    if(!_controlPanel){
      return;
    }

    _controlPanel.style.display = 'none';
    var info = null;
    if(_imageContainer && _message.imgUrl) {
      info = {};
      if (!_message.includeOverlay) {
        _imageContainer.style.display = 'none';
      }
      info.url = location.href;
      info.overlay = _imageContainer.dataset;
      info.overlay.top = Math.ceil(_image.getBoundingClientRect().top);
      info.overlay.left = Math.ceil(_image.getBoundingClientRect().left);
      info.overlay.url = _message.imgUrl;

      delete info.overlay.pcType;
    }
    setTimeout(function() {
      chrome.runtime.sendMessage({api: 'screenCapture'}, function(responseData) {

        var _send = function(){
          if(info){
            responseData.info = info;
            _sendResponse(responseData);
          } else {
            _sendResponse(responseData.img);
          }
        };

        var isMobile = /iPhone|iPad|iPod|Android|BB10|Mobile/i.test(navigator.userAgent);
        if(!isMobile && responseData.zoomFactor !== 0) {
          crop(responseData.img, 0, 0, window.innerWidth, window.innerHeight, responseData.zoomFactor, function(croppedImg){
            responseData.img = croppedImg;
            _send();
          });
        } else {
          _send();
        }

        return true;
      });
    }, 500);
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
      chrome.runtime.sendMessage({api: 'screenCapture'}, function(data) {
        send(data.img);
        return true;
      });
    }

    else if (data.api === 'captureSection') {
      chrome.runtime.sendMessage({api: 'screenCapture'}, function(responseData) {
        crop(responseData.img, data.x, data.y, data.width, data.height, responseData.zoomFactor, send);
        return true;
      });
    }

    else if (data.api === 'captureUrl') {
      chrome.runtime.sendMessage(data, function(dataUrl) {
        send(dataUrl);
        return true;
      });
    }

    // api calls from the control panel iframe
    else if(data.api === '_padding'){
      applyPadding(data);
    }
    else if(data.api === '_paddingColor'){
      applyPaddingColor(data);
    }

    else if(data.api === '_capture'){
      captureBtnHandler();
    }

  });

  // listens for messages from the background script
  chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.option === 'addControls') {
      document.addEventListener('DOMContentLoaded', function() {
        _message = message;
        _sendResponse = sendResponse;
        _controlPanel = createControlPanel(!!message.imgUrl);

        if (message.imgUrl) {
          _image = new Image();
          _imageContainer = document.createElement('div');
          _imageContainer.style.border = '0 solid #fff';
          _image.onload = function() {
            _imageContainer.style.minWidth = _image.naturalWidth + 'px';
            _imageContainer.style.minHeight = _image.naturalHeight + 'px';
            _image.style.width = _image.naturalWidth + 'px';
            _image.style.maxWidth = _image.naturalWidth + 'px';
            _image.style.float = 'left';
            _image.style.height = _image.naturalHeight + 'px';
            _image.style.maxHeight = _image.naturalHeight + 'px';
            window.__pc_draggable(_imageContainer, _image.naturalWidth, _image.naturalHeight);
          };
          _image.src = message.imgUrl;
          _imageContainer.appendChild(_image);
        }
      });
    }
    // all for asynchronously response
    return true;
  });

  document.addEventListener('DOMContentLoaded', function() {
    // inject the api script in the current page document
    var apiScript = document.createElement('script');
    apiScript.src = chrome.extension.getURL('public.api.js');
    apiScript.type = 'text/javascript';
    apiScript.async = true;
    document.body.appendChild(apiScript);
  });

})();
