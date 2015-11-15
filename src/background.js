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
  if (activeTab && tab.id === activeTab.id && changeInfo.status === 'complete') {
    if(stack[activeTab.id]){
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
      chrome.tabs.captureVisibleTab(options, sendResponse);
    }

    else if (request.api === 'captureUrl') {
      // get current tab
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        console.log('tabs', tabs);
        parentTabIndex = tabs[0].index;

        if(!request.url.match(/^https?\:\/\//)){
          request.url = 'http://' + request.url;
        }

        chrome.tabs.create({url: request.url}, function(tab) {
          activeTab = tab;
          stack[tab.id] = function() {

            // only run this once
            stack[activeTab.id] = null;

            var opts = request;
            opts.option = 'addControls';

            // tell the content script to add control overlay on the tab that was created
            chrome.tabs.sendMessage(tab.id, opts, function(response) {

              // remove the tab that was created
              chrome.tabs.remove(activeTab.id, function() {

                // select the tabs that initiated the request
                chrome.tabs.highlight({tabs: parentTabIndex}, function() {

                  //send data back to client
                  sendResponse(response);
                });
              });
            });
          };
        });
      });
    }
  }
  // all for asynchronously response
  return true;
});
