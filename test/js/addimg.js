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

// var params = {
//   collection_id: 'colFrontView_f9cbd2',
//     image_file: fs.createReadStream('front.jpg'),
//     metadata: { product_id: 'TEST001' }
// };

// visualRecognition.addImage(params, function(err, response) {
//     if (err) {
//       		console.log(err);
//     } else {
//    		console.log(JSON.stringify(response, null, 2));
//     }
// });

// var params = {
//   collection_id: 'colLeftView_a0b862',
//     image_file: fs.createReadStream('left.jpg'),
//     metadata: { product_id: 'TEST001' }
// };

// visualRecognition.addImage(params, function(err, response) {
//     if (err) {
//       		console.log(err);
//     } else {
//    		console.log(JSON.stringify(response, null, 2));
//     }
// });

// var params = {
//   collection_id: 'colBirdEyeView_7cd99f',
//     image_file: fs.createReadStream('bird-eye.jpg'),
//     metadata: { product_id: 'TEST001' }
// };

// visualRecognition.addImage(params, function(err, response) {
//     if (err) {
//       		console.log(err);
//     } else {
//    		console.log(JSON.stringify(response, null, 2));
//     }
// });

// var params = {
//   collection_id: 'colBottomView_dfc811',
//     image_file: fs.createReadStream('bottom.jpg'),
//     metadata: { product_id: 'TEST001' }
// };

// visualRecognition.addImage(params, function(err, response) {
//     if (err) {
//       		console.log(err);
//     } else {
//    		console.log(JSON.stringify(response, null, 2));
//     }
// });

var params = {
  collection_id: 'colProductLabel_424bf4',
    image_file: fs.createReadStream('product.jpg'),
    metadata: { product_id: 'TEST001' }
};

visualRecognition.addImage(params, function(err, response) {
    if (err) {
      		console.log(err);
    } else {
   		console.log(JSON.stringify(response, null, 2));
    }
});

// result = {
//   "images": [
//     {
//       "image_id": "1cfc46",
//       "image_file": "test.jpg",
//       "created": "2017-05-07T04:49:49.767Z",
//       "metadata": {
//         "product_id": "test"
//       }
//     }
//   ],
//   "images_processed": 1
// };

