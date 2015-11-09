#!/usr/bin/env bash

curl \
-H "Authorization: Bearer $TOKEN"  \
-H "x-goog-api-version: 2" \
-X PUT \
-T src.zip \
-s \
https://www.googleapis.com/upload/chromewebstore/v1.1/items/$APP_ID

curl \
-H "Authorization: Bearer $TOKEN"  \
-H "x-goog-api-version: 2" \
-H "Content-Length: 0" \
-X POST \
-s \
https://www.googleapis.com/chromewebstore/v1.1/items/$APP_ID/publish
