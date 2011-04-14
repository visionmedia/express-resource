
require.paths.unshift(__dirname + '/../support');

/**
 * Module dependencies.
 */

var express = require('express')
  , resource = require('../')
  , app = express.createServer();

var db = ['tobi', 'loki', 'jane']
  , toys = ['ball', 'tunnel'];

var pet = {
  index: {
    json: function(req, res){
      res.send(db);
    },
    
    default: function(req, res){
      res.send(db.join(', '), { 'Content-Type': 'text/plain' });
    }
  }
};

var pets = app.resource('pets', pet);

pets.load(function(id, fn){
  fn(null, db[id]);
});

// GET /pets/toys.xml
// this action must be defined above
// the one below as the :pet placeholder
// will otherwise match "/toys".

pets.get('/toys', {
  xml: function(req, res){
    res.send('<toys>' + toys.map(function(toy){
      return '<toy>' + toy + '</toy>';
    }).join('\n') + '</toys>');
  }
});

// GET /pets/1.xml

pets.get({
  xml: function(req, res){
    res.send('<pet>' + req.pet + '</pet>');
  }
});

app.listen(3000);