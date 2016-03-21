/**
 * page_capture
 * Copyright (c) 2015 Yieldbot, Inc. - All rights reserved.
 */

/* globals chrome */

'use strict';

var activeTab = null;
var parentTabIndex = null;
var stack = {};

// listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (activeTab && tab.id === activeTab.id && changeInfo.status === 'loading') {
    if(typeof stack[activeTab.id] === 'function'){
      stack[activeTab.id]();
    }
  }
});

// Receive message from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Messages from content scripts should have sender.tab set
  if (sender.tab) {
    if (request.api === 'screenCapture') {
      var options = {
        //format: 'jpeg',
        //quality: 100
        format: 'png'
      };
      chrome.tabs.captureVisibleTab(options, function(res){
        chrome.tabs.getZoom(function(zoomFactor){
          sendResponse({img: res, zoomFactor: zoomFactor});
        });
      });
    }

    else if (request.api === 'captureUrl') {
      // get current tab
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        parentTabIndex = tabs[0].index;

        if(!request.url.match(/^https?\:\/\//)){
          request.url = 'http://' + request.url;
        }

        var zoomFactor = request.__zoomFactor || 1.0;

        chrome.tabs.create({url: request.url}, function(tab) {
          activeTab = tab;
          stack[tab.id] = function() {

            var opts = request;
            opts.option = 'addControls';

            // tell the content script to add control overlay on the tab that was created
            chrome.tabs.sendMessage(tab.id, opts, function(response) {
              if(response !== undefined) {

                // remove the tab that was created
                chrome.tabs.remove(activeTab.id, function() {

                  // select the tabs that initiated the request
                  chrome.tabs.highlight({tabs: parentTabIndex}, function() {

                    //send data back to client
                    sendResponse(response);
                    return true;
                  });
                  return true;
                });
              }
              return true;
            });

            // adjust the zoom
            chrome.tabs.setZoom(tab.id, zoomFactor, function() {
              return true;
            });
          };

          return true;
        });
      });
    }

    else if(request.api === 'adjustZoomFactor'){
      // get current tab
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        // adjust the zoom
        chrome.tabs.setZoom(tabs[0].id, request.zoomFactor, function() {
          sendResponse(request.zoomFactor);
          return true;
        });
        return true;
      });
    }

  }
  // all for asynchronously response
  return true;
});
