/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// Module dependencies
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var compression = require('compression');
var expressBrowserify = require('express-browserify');
var os = require('os');

module.exports = function(app) {

  // Configure Express
  app.set('view engine', 'jade');
  app.use(require('express-status-monitor')());
  app.use(compression({filter: function (req, res) {

    // fallback to standard filter function
    return compression.filter(req, res)
  }}));
  app.use(cookieParser());
  if (app.get('env') === 'development') {
    // set up request logging for local development and non-bluemix servers
    // (bluemix's router automatically logs all requests there)
    app.use(morgan('dev'));
  }
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '40mb'
  }));
  app.use(bodyParser.json({
    limit: '40mb'
  }));

  // Setup static public directory
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // When running in Bluemix add rate-limitation
  // and some other features around security
  if (process.env.VCAP_APPLICATION) {
    require('./security')(app);
  }
};
