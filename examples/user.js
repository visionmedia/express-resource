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
  },
  
  login: function(req, res){
    res.send('logged in ' + req.params.user);
  },
  
  logout: function(req, res){
    res.send('logged out');
  }
};

var userResource = app.resource('users', user);
userResource.map('get', 'login', user.login);    // relative path accesses element (/users/1/login)
userResource.map('get', '/logout', user.logout); // absolute path accesses collection (/users/logout)

app.listen(3000);