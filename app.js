
'use strict';

var express = require('express');
var app = express();
var fs = require('fs');
var extend = require('extend');
var path = require('path');
var async = require('async');
var watson = require('watson-developer-cloud');
var uuid = require('uuid');
var os = require('os');

var formidable = require('formidable');
var readChunk = require('read-chunk');
var fileType = require('file-type');

var ONE_HOUR = 3600000;
var TWENTY_SECONDS = 20000;

// Bootstrap application settings
require('./config/express')(app);

// Create the service wrapper
// If no API Key is provided here, the watson-developer-cloud@2.x.x library will check for an VISUAL_RECOGNITION_API_KEY
// environment property and then fall back to the VCAP_SERVICES property provided by Bluemix.
var visualRecognition = new watson.VisualRecognitionV3({
  api_key: '0c79ae106f06a2b11e28958eb8b670156b4f0909',
  version: 'v3',
  version_date: '2015-05-19'
});

var collectionIds = ['colFrontView_f9cbd2', 'colLeftView_a0b862', 'colBirdEyeView_7cd99f', 'colBottomView_dfc811', 'colProductLabel_424bf4'];

var collectionIndex = {
    colFrontView_f9cbd2 : 0,
    colLeftView_a0b862 : 1,
    colBirdEyeView_7cd99f : 2,
    colBottomView_dfc811 : 3,
    colProductLabel_424bf4 : 4
}

app.get('/', function(req, res) {
  res.render('use', {
    bluemixAnalytics: process.env.BLUEMIX_ANALYTICS
  });
});

/**
 * Parse a base 64 image and return the extension and buffer
 * @param  {String} imageString The image data as base65 string
 * @return {Object}             { type: String, data: Buffer }
 */
function parseBase64Image(imageString) {
  var matches = imageString.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
  var resource = {};

  if (matches.length !== 3) {
    return null;
  }

  resource.type = matches[1] === 'jpeg' ? 'jpg' : matches[1];
  resource.data = new Buffer(matches[2], 'base64');
  return resource;
}


/**
 * compare imgs route.
 */
app.post('/compare_similarity', function (req, res) {

    var form = new formidable.IncomingForm();
    var productId;
    var targetFiles = new Array();
    var collectionIdentifiers = new Array(5);
    var rtnData = [0.5, 0.5, 0.5, 0.5, 0.5];

    // Tells formidable that there will be multiple files sent.
    form.multiples = true;
    // Upload directory for the images
    form.uploadDir = path.join(__dirname, 'tmp_uploads');

    // Parse the incoming form fields.
    form.parse(req, function (err, fields, files) {
        // console.log(JSON.stringify(fields));
    });

    form.on('field', function(name, value) {

        if (name == 'model') {
            productId = value;
        } else {
            var index = collectionIndex[name];
            collectionIdentifiers[index] = value;
        }

    });

    // Invoked when a file has finished uploading.
    form.on('file', function (name, file) {
        targetFiles.push(file);
    });

    form.on('error', function(err) {
        console.log('Error occurred during processing - ' + err);
    });

    // Invoked when all the fields have been processed.
    form.on('end', function() {

        console.log('All the request fields have been processed.');
        var proceeded = 0;
        var sortedtargetFiles = new Array(5);

        targetFiles.forEach(function(file) {

            var fileIdentifier = [file.size, file.name, file.type].join('-');

            for (var index in collectionIdentifiers) {
                var identifier = collectionIdentifiers[index];
                if (identifier == fileIdentifier) {
                    sortedtargetFiles[index] = file;
                }
            }
        });

        sortedtargetFiles.forEach(function(file, index) {

            var colId = collectionIds[index];

            var params = {
                collection_id: colId,
                image_file: fs.createReadStream(file.path),
                product_id: productId
            };

            console.log('start compare : %s', JSON.stringify(params));
            visualRecognition.findSimilar(params, function(err, response) {

                if (err) {
                    console.log(err);
                } else {
                    // console.log(JSON.stringify(response, null, 2));
                    response.similar_images.forEach(function (image){
                        var rtnProductId = image.metadata.product_id;
                        if (rtnProductId == productId) {
                            var rtnScore = roundDecimal(image.score, 1);
                            rtnData[index] = rtnScore;
                        }
                    }, this);
                }

                proceeded++;
                console.log('file proceeded : %d', proceeded);
                console.log('file index : %d', index);

                if (proceeded == sortedtargetFiles.length) {
                    // var rtnData = {result: [0.9, 0.5, 0.7, 0.4, 0.5]}
                    res.status(200).json({result:rtnData});
                    console.log('response end');

                    sortedtargetFiles.forEach(function(file) {
                        // delete all temp files
                        if (fs.existsSync(file.path)) {
                            // delete temp file
                            fs.unlinkSync(file.path);
                            // console.log('file deleted:' + file.path);
                        }
                    }, this);
                }

            });
            // vr API callback end

        }, this);
        // for each file

    });
    // on end

});
// post

// round decimal to a determined precision
function roundDecimal(num, precision) {
    return Number(+(Math.round(num + "e+" + precision)  + "e-" + precision)).toFixed(precision);;
}

module.exports = app;
