# Page Capture (by Yieldbot)

[![Build Status](https://travis-ci.org/yieldbot/page_capture.svg?branch=master)](https://travis-ci.org/yieldbot/page_capture)
[![GitHub version](https://badge.fury.io/gh/yieldbot%2Fpage_capture.svg)](https://badge.fury.io/gh/yieldbot%2Fpage_capture)

A [Chrome Extension](https://chrome.google.com/webstore/detail/page-capture-by-yieldbot/jalljeamdfcpcigocpbgfbebdjfmpdof) that allows page capturing from within your Web Application.

### API (TODO - hook up jsdoc)

- `getVersion()`: get the version number
- `capturePage([url])`: capture the entire page of a given url
- `captureElement(elementId, [url])`: capture an element on a given url
- `captureSection(x, y, width, height, [url])`: capture a section a given url

### Deploy Process

- npm run cut_release
- git fetch
- git rebase
- git push
- git push origin --tags
- check the [travis build](https://travis-ci.org/yieldbot/page_capture)


### Example

see [test/index.html](test/index.html) 

### License

Licensed under The MIT License (MIT)

For the full copyright and license information, please view the LICENSE.txt file.
