
require.paths.unshift(__dirname + '/../support');

/**
 * Module dependencies.
 */

var express = require('express')
  , resource = require('../')
  , app = express.createServer();

var users = ['tobi', 'loki', 'jane'];

var user = {
  index: function(req, res){
    switch (req.format) {
      case 'json':
        res.send(users);
        break;
      default:
        res.contentType('txt');
        res.send(users.join(', '));
    }
  },
  
  show: function(req, res){
    var user = users[req.params.user];
    res.send(user);
  },
  
  edit: function(req, res){
    res.send('editing ' + req.params.user);
  },
  
  destroy: function(req, res){
    delete users[req.params.user];
    res.send('removed ' + req.params.user);
  }
};

app.resource('users', user);

app.listen(3000);