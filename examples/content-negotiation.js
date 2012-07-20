
var express = require('express')
  , resource = require('..')
  , app = express();

var users = app.resource('users', require('./controllers/user'));

app.get('/', function(req, res){
  res.send('<a href="/users">View users</a>');
});

app.listen(3000);
console.log('Listening on :3000');