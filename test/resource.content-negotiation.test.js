
/**
 * Module dependencies.
 */
var assert = require('assert')
  , express = require('express')
  , should = require('should')
  , Resource = require('../');

module.exports = {
  'test content-negotiation via extension': function(){
    var app = express.createServer()
      , pets = ['tobi', 'jane', 'loki'];

    var actions = {
      index: function(req, res){
        switch (req.format) {
          case 'json':
            res.send(pets);
            break;
          case 'xml':
            res.send('<pets>' + pets.map(function(pet){
              return '<pet>' + pet + '</pet>';
            }).join('') + '</pets>');
            break;
          default:
            res.send(415);
        }
      }
    };

    app.resource('pets', actions, { format: 'json' });

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
  }
};