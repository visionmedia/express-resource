
require.paths.unshift(__dirname + '/../support');

/**
 * Module dependencies.
 */

var express = require('express')
  , resource = require('../')
  , app = express.createServer();

app.resource({
  index: function(req, res){
    res.send('index page');
  },
  
  show: function(req, res){
    res.send('item ' + req.params.id);
  }
});

app.listen(3000);