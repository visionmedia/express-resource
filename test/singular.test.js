
/**
 * Module dependencies.
 */
var assert = require('assert')
  , express = require('express')
  , Resource = require('../');

module.exports = {
  'test app.singular_resource()': function(){
    var app = express.createServer();

    var ret = app.singular_resource('profile', require('./fixtures/profile'));
    assert.ok(ret instanceof Resource);

    assert.response(app,
      { url: '/profiles' },
      { status: 404 });

    assert.response(app,
      { url: '/profile/new' },
      { body: 'new profile' });

    assert.response(app,
      { url: '/profile', method: 'POST' },
      { body: 'create profile' });

    assert.response(app,
      { url: '/profile' },
      { body: 'show profile' });

    assert.response(app,
      { url: '/profile/edit' },
      { body: 'edit profile' });

    assert.response(app,
      { url: '/profile', method: 'PUT' },
      { body: 'update profile' });

    assert.response(app,
      { url: '/profile', method: 'DELETE' },
      { body: 'destroy profile' });
  },
  
  'test app.singular_resource() for top level': function(){
    var app = express.createServer();

    var ret = app.singular_resource(require('./fixtures/profile'));
    assert.ok(ret instanceof Resource);

    assert.response(app,
      { url: '/new' },
      { body: 'new profile' });

    assert.response(app,
      { url: '/', method: 'POST' },
      { body: 'create profile' });

    assert.response(app,
      { url: '/' },
      { body: 'show profile' });

    assert.response(app,
      { url: '/edit' },
      { body: 'edit profile' });

    assert.response(app,
      { url: '/', method: 'PUT' },
      { body: 'update profile' });

    assert.response(app,
      { url: '/', method: 'DELETE' },
      { body: 'destroy profile' });
  }
  
};