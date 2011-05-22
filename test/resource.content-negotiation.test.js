
/**
 * Module dependencies.
 */
var assert = require('assert')
  , express = require('express')
  , should = require('should')
  , Resource = require('../');

module.exports = {
  'test content-negotiation via extension': function(){
    var app = express.createServer();
  
    app.resource('pets', require('./fixtures/pets'), { format: 'json' });
  
    assert.response(app,
      { url: '/pets.html' },
      { body: 'Not Acceptable'
      , status : 406 });
  
    assert.response(app,
      { url: '/pets' },
      { body: '["tobi","jane","loki"]' });
  
    assert.response(app,
      { url: '/pets.xml' },
      { body: '<pets><pet>tobi</pet><pet>jane</pet><pet>loki</pet></pets>'
      , headers: { 'Content-Type': 'application/xml' }});
  
    assert.response(app,
      { url: '/pets.json' },
      { body: '["tobi","jane","loki"]'
      , headers: { 'Content-Type': 'application/json' }});
  
    assert.response(app,
      { url: '/pets/1.json' },
      { body: '"jane"' });
  
    assert.response(app,
      { url: '/pets/0.xml' },
      { body: '<pet>tobi</pet>' });

    assert.response(app,
      { url: '/pets/0.xml', method: 'DELETE' },
      { body: '<message>pet removed</message>' });

    assert.response(app,
      { url: '/pets/0.json', method: 'DELETE' },
      { body: '{"message":"pet removed"}' });
  },
  
  'test content-negotiation via format method': function(){
    var app = express.createServer();
  
    app.resource('pets', require('./fixtures/pets.format-methods'));
  
    assert.response(app,
      { url: '/pets.xml' },
      { body: '<pets><pet>tobi</pet><pet>jane</pet><pet>loki</pet></pets>'
      , headers: { 'Content-Type': 'application/xml' }});
  
    assert.response(app,
      { url: '/pets.json' },
      { body: '["tobi","jane","loki"]'
      , headers: { 'Content-Type': 'application/json' }});
  
    assert.response(app,
      { url: '/pets' },
      { body: 'Unsupported format', status: 406 });
  },
  
  'test content-negotiation via format method without default': function(){
    var app = express.createServer();
  
    app.resource('pets', require('./fixtures/pets.format-methods-without-default'));
  
    assert.response(app,
      { url: '/pets.xml' },
      { body: '<pets><pet>tobi</pet><pet>jane</pet><pet>loki</pet></pets>'
      , headers: { 'Content-Type': 'application/xml' }});
  
    assert.response(app,
      { url: '/pets.json' },
      { body: '["tobi","jane","loki"]'
      , headers: { 'Content-Type': 'application/json' }});
  
    assert.response(app,
      { url: '/pets' },
      { body: 'Not Acceptable', status: 406 });
  },
  
  'test content-negotiation via map()': function(){
    var app = express.createServer();
  
    app.use(express.bodyParser());
  
    var pets = app.resource('pets')
      , toys = app.resource('toys')
      , toysDB = ["balls", "platforms", "tunnels"];

    toys.get('/types', function(req, res){
      res.send(toysDB);
    });  

    toys.get('/', {
      json: function(req, res){
        res.send(toysDB);
      }
    });
    
    toys.get({
      json: function(req, res){
        res.send('"' + toysDB[req.params.toy] + '"');
      }
    });
  
    pets.add(toys);
  
    pets.get('/', {
      json: function(req, res){
        res.send({ name: 'tobi' });
      }
    });
  
    assert.response(app,
      { url: '/pets/0/toys/types' },
      { body: '["balls","platforms","tunnels"]' });

    assert.response(app,
      { url: '/pets/0/toys/2.json' },
      { body: '"tunnels"' });

    assert.response(app,
      { url: '/pets/0/toys.json' },
      { body: '["balls","platforms","tunnels"]' });
      
    assert.response(app,
      { url: '/pets.json' },
      { body: '{"name":"tobi"}' });
      
    assert.response(app,
      { url: '/pets' },
      { status: 406 });
  },
  
  'test nested content-negotiation': function(){
    var app = express.createServer()
      , pets = ['tobi', 'jane', 'loki'];
  
    var users = app.resource('users');
    var pets = app.resource('pets', require('./fixtures/pets'));
    users.add(pets);
  
    assert.response(app,
      { url: '/users/1/pets.json' },
      { body: '["tobi","jane","loki"]' });
  }
};