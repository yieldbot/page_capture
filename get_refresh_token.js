/**
 * page_capture
 * Copyright (c) 2015 Yieldbot, Inc. - All rights reserved.
 */


'use strict';

//var pkg = require('../package.json');
var request = require('request');

var oauth = {
  grant_type: 'refresh_token',
  refresh_token: process.env.REFRESH_TOKEN,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET
};

var fields = '';
for (var p in oauth) {
  fields += p + '=' + oauth[p] + '&';
}

request.post('https://www.googleapis.com/oauth2/v3/token?' + fields, function(err, res, body) {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    try {
      console.log(JSON.parse(body).access_token);
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }
});
