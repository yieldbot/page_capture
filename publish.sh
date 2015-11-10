#!/usr/bin/env bash

# reference: https://developer.chrome.com/webstore/using_webstore_api

CAN_PUBLISH=`node can_publish.js`
EXIT_CODE=$?

echo "[$EXIT_CODE] : $CAN_PUBLISH"

if [ $EXIT_CODE == '0' ]
  then

    echo "Creating zip file..."
    zip -r src.zip src

    TOKEN=`node get_refresh_token.js`
    EXIT_CODE=$?
    UPLOAD_URL="https://www.googleapis.com/upload/chromewebstore/v1.1/items/$APP_ID"
    PUBLISH_URL="https://www.googleapis.com/chromewebstore/v1.1/items/$APP_ID/publish"

    echo "[$EXIT_CODE] : $TOKEN "

    if [ $EXIT_CODE == '0' ]
      then
        # Uploading a package to update an existing store item
        curl -H "Authorization: Bearer $TOKEN" -H "x-goog-api-version: 2" -X PUT -T src.zip -s $UPLOAD_URL

        #Publishing an item to the public
        curl -H "Authorization: Bearer $TOKEN" -H "x-goog-api-version: 2" -H "Content-Length: 0" -X POST -s $PUBLISH_URL
    fi

fi
