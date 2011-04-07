
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