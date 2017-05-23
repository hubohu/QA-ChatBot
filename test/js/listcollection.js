'use strict';

var fs = require('fs');
var watson = require('watson-developer-cloud');

// Create the service wrapper
// If no API Key is provided here, the watson-developer-cloud@2.x.x library will check for an VISUAL_RECOGNITION_API_KEY
// environment property and then fall back to the VCAP_SERVICES property provided by Bluemix.
var visualRecognition = new watson.VisualRecognitionV3({
  api_key: '0c79ae106f06a2b11e28958eb8b670156b4f0909',
  version: 'v3',
  version_date: '2015-05-19'
});


visualRecognition.listCollections({}, function(err, response) {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(response, null, 2));
    }
});


