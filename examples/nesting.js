
require.paths.unshift(__dirname + '/../support');

/**
 * Module dependencies.
 */

var express = require('express')
  , resource = require('../')
  , app = express.createServer();

var forums = app.resource('forums', require('./controllers/forum'));
var threads = app.resource('threads', require('./controllers/thread'));
forums.add(threads);

app.listen(3000);