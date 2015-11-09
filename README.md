# Page Capture (by Yieldbot)

[![Build Status](https://travis-ci.org/yieldbot/page_capture.svg?branch=master)](https://travis-ci.org/yieldbot/page_capture)

A [Chrome Extension](https://developer.chrome.com/extensions) that allows page capturing from within your UI Application.

### API (TODO - hook up jsdoc)

- `getVersion()`: get the version number
- `capturePage([url])`: capture the entire page of a given url
- `captureElement(elementId, [url])`: capture an element on a given url
- `captureSection(x, y, width, height, [url])`: capture a section a given url

### Deploy Process

- npm run cut_deploy
- git fetch
- git rebase
- git push
- git push origin --tags
- check the travis build


### Example

see [test/index.html](test/index.html) 
