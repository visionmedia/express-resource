
/**
 * Module dependencies.
 */
var assert = require('assert')
  , express = require('express')
  , Resource = require('../');

module.exports = {
  'test Resource.prototype.member() chain': function() {
    var app = express.createServer();


    var ret = app.resource('forums', require('./fixtures/forumplus'));

    assert.ok(ret instanceof Resource);
    ret.member('search', 'post').member('display', 'get');

    
    assert.response(app,
      { url: '/forums/5/search', method: 'POST' },
      { body: 'search forum 5' });

    assert.response(app,
      { url: '/forums/5/display' },
      { body: 'display forum 5' });

  },

  'test Resource.prototype.members()': function() {
    var app = express.createServer();


    var ret = app.resource('forums', require('./fixtures/forumplus'));

    assert.ok(ret instanceof Resource);
    ret.members({search:'post', display: 'get' });

    
    assert.response(app,
      { url: '/forums/5/search', method: 'POST' },
      { body: 'search forum 5' });

    assert.response(app,
      { url: '/forums/5/display' },
      { body: 'display forum 5' });

  },

  'test Resource.prototype.collection() chain': function() {
    var app = express.createServer();


    var ret = app.resource('forums', require('./fixtures/forumplus'));

    assert.ok(ret instanceof Resource);
    ret.collection('map', 'post').collection('sequence', 'get');

    
    assert.response(app,
      { url: '/forums/map', method: 'POST' },
      { body: 'map forums' });

    assert.response(app,
      { url: '/forums/sequence' },
      { body: 'sequence forums' });

  },

  'test Resource.prototype.collections()': function() {
    var app = express.createServer();


    var ret = app.resource('forums', require('./fixtures/forumplus'));

    assert.ok(ret instanceof Resource);
    ret.collections({map:'post', sequence: 'get' });

    
    assert.response(app,
      { url: '/forums/map', method: 'POST' },
      { body: 'map forums' });

    assert.response(app,
      { url: '/forums/sequence' },
      { body: 'sequence forums' });

    assert.response(app,
      { url: '/forums/5' },
      { body: 'show forum 5' });

  }

};