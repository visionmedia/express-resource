
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
      , headers: { 'Content-Type': 'application/json; charset=utf-8' }});
  
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
      
  'test nested content-negotiation': function(){
    var app = express.createServer()
      , pets = ['tobi', 'jane', 'loki'];
  
    var users = app.resource('users');
    var pets = app.resource('pets', require('./fixtures/pets'));
    users.add(pets);
  
    assert.response(app,
      { url: '/users/1/pets.json' },
      { body: '["tobi","jane","loki"]' });
  },

  'test content-negotiation with middleware': function() {
    var app = express.createServer();

    var cat = app.resource('api/cat', require('./fixtures/cat'));

    assert.response(app,
      { url: '/api/cat/1' },
      { body: 'usertype: cat owner' });

    assert.response(app,
      { url: '/api/cat/1.json' },
      { body: '{"usertype":"cat owner"}'
        , headers: { 'Content-Type': 'application/json' } });
  }
};