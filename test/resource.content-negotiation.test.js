
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
      { body: 'Unsupported Media Type'
      , status : 415 });

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
      { body: 'Unsupported format', status: 415 });
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
      { body: 'Unsupported Media Type', status: 415 });
  },
  
  'test content-negotiation via map()': function(){
    var app = express.createServer();

    app.use(express.bodyParser());

    var pets = app.resource('pets')
      , toys = app.resource('toys');

    toys.get({
      json: function(req, res){
        res.send(["ball"]);
      }
    });

    toys.get('/types', function(req, res){
      res.send(["balls", "platforms", "tunnels"]);
    });

    pets.add(toys);

    pets.get({
      json: function(req, res){
        res.send({ name: 'tobi' });
      }
    });

    assert.response(app,
      { url: '/pets/0/toys/types' },
      { body: '["balls","platforms","tunnels"]' });

    assert.response(app,
      { url: '/pets/0/toys.json' },
      { body: '["ball"]' });

    assert.response(app,
      { url: '/pets.json' },
      { body: '{"name":"tobi"}' });

    assert.response(app,
      { url: '/pets' },
      { status: 415 });
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