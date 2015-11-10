/**
 * page_capture
 * Copyright (c) 2015 Yieldbot, Inc. - All rights reserved.
 */

'use strict';

var fs = require('fs');
var manifest = require('./src/manifest.json');
var pkg = require('./package.json');

manifest.version = pkg.version;

fs.writeFileSync('./src/manifest.json', JSON.stringify(manifest, null, 2));
