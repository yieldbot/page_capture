/**
 * page_capture
 *
 * check if the current codebase should be published (based on version numbers)
 *
 * Copyright (c) 2015 Yieldbot, Inc. - All rights reserved.
 */

'use strict';

// check manifest.json and package.json versions
// if versions are the same
//    check draft manifest version
//    if manifest.json > draft manifest version
//       publish
//    else
//       no publish
// else
//    log that versions are different

var request = require('request');
var pkgVersion = require('./package.json').version;
var manifestVersion = require('./src/manifest.json').version;

var oauth = {
  grant_type: 'refresh_token',
  refresh_token: process.env.REFRESH_TOKEN_READ_ONLY,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET
};

var fields = '';
for (var p in oauth) {
  fields += p + '=' + oauth[p] + '&';
}

var postConfig = {
  url: 'https://www.googleapis.com/oauth2/v3/token?' + fields,
  json: true
};

var versionToNumber = function(version) {
  return Number(('' + version).replace(/[^0-9]/g, ''));
};

//https://developer.chrome.com/webstore/webstore_api/items/get
var getManifestInfo = function(token, cb) {
  var options = {
    url: 'https://www.googleapis.com/chromewebstore/v1.1/items/' + process.env.APP_ID + '?projection=DRAFT',
    json: true,
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-goog-api-version': '2',
      'Content-Length': '0',
      'Expect': ''
    }
  };

  request(options, function callback(err, res, body) {
    if (err) {
      console.error('ERROR.3', err);
      process.exit(1);
    } else {
      try {
        if (body.crxVersion) {
          var version = body.crxVersion;
          cb(version);
        } else {
          console.error('ERROR.4', 'no "crxVersion" property on', body);
          process.exit(1);
        }
      } catch (err) {
        console.error('ERROR.5', err);
        process.exit(1);
      }
    }
  });
};

if (pkgVersion !== manifestVersion) {
  console.log('package and manifest versions are different');
  process.exit(1);
} else {
  // get the readonly refresh token
  request.post(postConfig, function(err, res, body) {
    if (err) {
      console.error('ERROR.1', err);
      process.exit(1);
    } else {
      try {
        getManifestInfo(body.access_token, function(version) {
          if (versionToNumber(manifestVersion) > versionToNumber(version)) {
            console.log(manifestVersion, '>', version);
            process.exit();
          } else {
            console.log(manifestVersion, 'not_greater_than', version);
            process.exit(1);
          }
        });
      } catch (err) {
        console.error('ERROR.2', err);
        process.exit(1);
      }
    }
  });
}
