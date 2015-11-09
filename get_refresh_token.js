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

request.post({url: 'https://www.googleapis.com/oauth2/v3/token', oauth: oauth}, function(err, res, body) {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    console.log('body', body);
  }
});
