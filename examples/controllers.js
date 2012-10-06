
var express = require('express')
  , resource = require('..')
  , app = express();

var main = app.resource(require('./controllers/main'));
var forums = app.resource('forums', require('./controllers/forum'));
var threads = app.resource('threads', require('./controllers/thread'));
forums.add(threads);

app.listen(3000);
console.log('Listening on :3000');