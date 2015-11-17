# Page Capture (by Yieldbot)

[![Build Status](https://travis-ci.org/yieldbot/page_capture.svg?branch=master)](https://travis-ci.org/yieldbot/page_capture)
[![GitHub version](https://badge.fury.io/gh/yieldbot%2Fpage_capture.svg)](https://badge.fury.io/gh/yieldbot%2Fpage_capture)

A [Chrome Extension](https://chrome.google.com/webstore/detail/page-capture-by-yieldbot/jalljeamdfcpcigocpbgfbebdjfmpdof) that allows page capturing from within your Web Application.

http://yieldbot.github.io/page_capture/

### API (TODO - hook up jsdoc)

- `getVersion(cb)`: get the version number
- `capturePage(cb)`: capture the entire page of a given url
- `captureElement(elementId, cb)`: capture an element on a given url
- `captureSection(x, y, width, height, cb)`: capture a section a given url
- `captureImage(imgUrl, width, height, cb)`: capture an external image
- `captureUrl(url, cb)`: capture an external page
- `captureUrlWithOverlay(url, imgUrl, includeOverlay, cb)`: capture an external page with an overlay

### Want to contribute?

- [fork the repo](https://help.github.com/articles/fork-a-repo/)
- `npm run dev`: this will start a new chrome profile with the unpacked version on this extension
- commit your changes
- [submit a pull request](https://help.github.com/articles/using-pull-requests/)

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
