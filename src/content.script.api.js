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
      callbacks[event.data.__key](event.data.value);
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
   * get the version
   * @param {function} cb
   * @return {undefined}
   */
  PageCapture.getVersion = function (cb) {
    callbacks[index] = cb;
    window.postMessage({api: 'PageCapture.getVersion', __index: index}, '*');
    index++;
  };

  /**
   * take snapshots of elements on a given url
   * @param {string} element
   * @param {function} cb
   */
  PageCapture.captureElement = function (element, cb) {
    callbacks[index] = cb;
    window.postMessage({api: 'PageCapture.captureElement', __index: index, element: element}, '*');
    index++;
  };

  /**
   * take snapshots of a give url
   * @param {function} cb
   */
  PageCapture.capturePage = function (cb) {
    callbacks[index] = cb;
    window.postMessage({api: 'PageCapture.capturePage', __index: index}, '*');
    index++;
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
