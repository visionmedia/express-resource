
/**
 * Module dependencies.
 */
var assert = require('assert')
  , express = require('express')
  , Resource = require('../');

module.exports = {
  'test app.resource()': function(){
    var app = express.createServer();

    var ret = app.resource('forums', require('./fixtures/forum'));
    assert.ok(ret instanceof Resource);

    assert.response(app,
      { url: '/forums' },
      { body: 'forum index' });

    assert.response(app,
      { url: '/forums/new' },
      { body: 'new forum' });

    assert.response(app,
      { url: '/forums', method: 'POST' },
      { body: 'create forum' });

    assert.response(app,
      { url: '/forums/5' },
      { body: 'show forum 5' });

    assert.response(app,
      { url: '/forums/5/edit' },
      { body: 'edit forum 5' });

    assert.response(app,
      { url: '/forums/5', method: 'PUT' },
      { body: 'update forum 5' });

    assert.response(app,
      { url: '/forums/5', method: 'DELETE' },
      { body: 'destroy forum 5' });
  },

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

  'test top-level app.resource()': function(){
    var app = express.createServer();

    var ret = app.resource(require('./fixtures/forum'));
    assert.ok(ret instanceof Resource);

    assert.response(app,
      { url: '/' },
      { body: 'forum index' });

    assert.response(app,
      { url: '/new' },
      { body: 'new forum' });

    assert.response(app,
      { url: '/', method: 'POST' },
      { body: 'create forum' });

    assert.response(app,
      { url: '/5' },
      { body: 'show forum 5' });

    assert.response(app,
      { url: '/5/edit' },
      { body: 'edit forum 5' });

    assert.response(app,
      { url: '/5', method: 'PUT' },
      { body: 'update forum 5' });

    assert.response(app,
      { url: '/5', method: 'DELETE' },
      { body: 'destroy forum 5' });
  },

  'test app.resource() id option': function(){
    var app = express.createServer();

    app.resource('users', {
      id: 'uid',
      show: function(req, res){
        res.send(req.params.uid);
      }
    });

    assert.response(app,
      { url: '/users' },
      { status: 404 });

    assert.response(app,
      { url: '/users/10' },
      { body: '10' });
  }
};