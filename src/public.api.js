/**
 * page_capture
 * Copyright (c) 2015 Yieldbot, Inc. - All rights reserved.
 */

'use strict';

/* exported PageCapture */

var pcQueue = pcQueue || [];

// public api
var PageCapture = {};

(function () {
  var index = 10;
  var callbacks = {};

  // listen to messages from the content script
  window.addEventListener('message', function (event) {
    if (event.data.__key && typeof callbacks[event.data.__key] === 'function') {
      if(Boolean(event.data.value) || Boolean(event.data.error)){
        callbacks[event.data.__key](event.data.value, event.data.error);
      }
    }
  });

  /**
   *
   * @param {function} cmd
   * @return {undefined}
   */
  var runCmd = function(cmd){
    if (typeof cmd === 'function') {
      cmd();
    }
  };

  /**
   *
   * @param {string} api
   * @param {object} opt
   * @param {function} cb
   * @return {undefined}
   */
  var send = function(api, opt, cb){
    opt.ns = 'page_capture';
    opt.api = api;
    opt.__index = index;
    opt.__zoomFactor = window.devicePixelRatio;
    callbacks[index] = cb;

    try {
      // send message to content.script.index.js
      window.postMessage(opt, '*');
      index++;
    } catch(e){
      callbacks[index](null, e.stack);
    }
  };

  /**
   * get the version
   * @param {function} cb
   * @return {undefined}
   */
  PageCapture.getVersion = function (cb) {
    var opt = {};
    send('getVersion', opt, cb);
  };

  /**
   * take snapshots of elements on a given url
   * @param {string} element
   * @param {function} cb
   */
  PageCapture.captureElement = function (element, cb) {
    var opt = {element: element};
    send('captureElement', opt, cb);
  };

  /**
   * take snapshots of elements on a given url
   * @param {string} element
   * @param {function} cb
   */
  PageCapture.captureElementWithOffset = function (element, extraLeft, extraTop, cb) {
    var opt = {
      element: element, 
      extraLeft: extraLeft,
      extraTop: extraTop
    };
    send('captureElementWithOffset', opt, cb);
  };

  /**
   * take snapshots of a given url
   * @param {function} cb
   */
  PageCapture.capturePage = function (cb) {
    var opt = {};
    send('capturePage', opt, cb);
  };

  /**
   * take snapshots of a section on a given url
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {function} cb
   */
  PageCapture.captureSection = function (x, y, width, height, cb) {
    var opt = {
      x: x,
      y: y,
      width: width,
      height: height
    };
    send('captureSection', opt, cb);
  };

  /**
   *
   * @param {string} imgUrl
   * @param {number} width
   * @param {number} height
   * @param {function} cb
   */
  PageCapture.captureImage = function(imgUrl, width, height, cb){
    var img = document.getElementById('__pc_image_');

    if(!img){
      img = new Image();
      img.id = '__pc_image_';
      img.style.position = 'fixed';
      img.style.top = '10px';
      img.style.left = '10px';
    }

    img.style.display = 'block';
    img.style.zIndex = '99999999999';

    img.onload = function() {
      document.body.appendChild(img);
      setTimeout(function(){
        PageCapture.captureElement('#__pc_image_', function(imgData) {
          cb(imgData);
          img.style.display = 'none';
        });
      }, 300);
    };

    if (width) {
      img.width = width;
    }
    if (height) {
      img.height = height;
    }

    img.src = imgUrl;
  };

  /**
   *
   * @param {string} url
   * @param {function} cb
   */
  PageCapture.captureUrl = function(url, cb){
    var opt = {
      url: url,
    };
    send('captureUrl', opt, cb);
  };

  /**
   *
   * @param {string} url
   * @param {string} imgUrl
   * @param {boolean} includeOverlay
   * @param {function} cb
   */
  PageCapture.captureUrlWithOverlay = function(url, imgUrl, includeOverlay, cb){
    var opt = {
      url: url,
      imgUrl: imgUrl,
      includeOverlay: includeOverlay
    };
    send('captureUrl', opt, cb);
  };

  /**
   *
   * @param {Number} zoomFactor
   * @param {function} cb
   */
  PageCapture.adjustZoomFactor = function(zoomFactor, cb){
    var opt = {
      zoomFactor: parseFloat(zoomFactor) || 1,
    };
    send('adjustZoomFactor', opt, cb);
  };

  // process the queue
  if (Array.isArray(pcQueue)) {
    pcQueue.forEach(runCmd);
  }

  // redefine pcQueue as an object
  pcQueue = {
    push: function (cmd) {
      runCmd(cmd);
    }
  };

})();
