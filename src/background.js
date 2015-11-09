/**
 * page_capture
 * Copyright (c) 2015 Yieldbot, Inc. - All rights reserved.
 */

/* globals chrome */

'use strict';

// listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    console.log('>>>', changeInfo, tab);
  }
});

// Receive message from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Messages from content scripts should have sender.tab set
  if (sender.tab && request.option === 'screenCapture') {
    var options = {
      //format: 'jpeg',
      //quality: 100
      format: 'png'
    };
    chrome.tabs.captureVisibleTab(options, sendResponse);
  }

  return true;
});
