
/**
 * Module dependencies.
 */
var assert = require('assert')
  , express = require('express')
  , should = require('should')
  , Resource = require('../');

module.exports = {
  'test app.resource()': function(){
    var app = express.createServer();

    var ret = app.resource('forums', require('./fixtures/forum'));
    ret.should.be.an.instanceof(Resource);

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

  'test top-level app.resource()': function(){
    var app = express.createServer();

    var ret = app.resource(require('./fixtures/forum'), { id: 'forum' });
    ret.should.be.an.instanceof(Resource);

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
  },
  
  'test fetching a resource object': function(){
    var app = express.createServer();
    app.resource('users', { index: function(){} });
    app.resource('users').should.be.an.instanceof(Resource);
    app.resource('foo').should.be.an.instanceof(Resource);
  },

  'test http methods': function(){
    var app = express.createServer();

    var user = app.resource('user');
    user.get(function(req, res){ res.end('tj'); });
    user.get('clone', function(req, res){ res.end('tj clone'); });

    assert.response(app,
      { url: '/user' },
      { body: 'tj' });

    assert.response(app,
      { url: '/user/clone' },
      { body: 'tj clone' });
  },
  
  'test shallow nesting': function(){
    var app = express.createServer();

    var forum = app.resource('forums', require('./fixtures/forum'));
    var thread = app.resource('threads', require('./fixtures/thread'));
    forum.map(thread);

    assert.response(app,
      { url: '/forums' },
      { body: 'forum index' });

    assert.response(app,
      { url: '/forums/12' },
      { body: 'show forum 12' });

    assert.response(app,
      { url: '/forums/12/threads' },
      { body: 'thread index of forum 12' });
    
    assert.response(app,
      { url: '/forums/1/threads/50' },
      { body: 'show thread 50 of forum 1' });
  },
  
  'test deep nesting': function(){
    var app = express.createServer();

    var user = app.resource('users', { index: function(req, res){ res.end('users'); } });
    var forum = app.resource('forums', require('./fixtures/forum'));
    var thread = app.resource('threads', require('./fixtures/thread'));

    user.add(forum);
    forum.add(thread);

    assert.response(app,
      { url: '/forums/20' },
      { status: 404 });

    assert.response(app,
      { url: '/users' },
      { body: 'users' });

    assert.response(app,
      { url: '/users/5/forums' },
      { body: 'forum index' });
    
    assert.response(app,
      { url: '/users/5/forums/12' },
      { body: 'show forum 12' });
    
    assert.response(app,
      { url: '/users/5/forums/12/threads' },
      { body: 'thread index of forum 12' });
    
    assert.response(app,
      { url: '/users/5/forums/1/threads/50' },
      { body: 'show thread 50 of forum 1' });
  },

  'test shallow auto-loading': function(){
    var app = express.createServer();
    var Forum = require('./fixtures/forum').Forum;

    var actions = { show: function(req, res){
      res.end(req.forum.title);
    }};

    var forum = app.resource('forum', actions);
    app.param('forum', function(req, res, next){
      Forum.get(req.params.forum, function(err, obj){
        if (err) return next(err);
        req.forum = obj;
        next();
      });
    });

    assert.response(app,
      { url: '/forum/12' },
      { body: 'Ferrets' });
  },
  
  'test deep auto-loading': function(){
    var app = express.createServer();
    var Forum = require('./fixtures/forum').Forum
      , Thread = require('./fixtures/thread').Thread;

    var actions = { show: function(req, res){
      res.end(req.forum.title + ': ' + req.thread.title);
    }};

    var forum = app.resource('forum');
    app.param('forum', function(req, res, next){
      Forum.get(req.params.forum, function(err, obj){
        if (err) return next(err);
        req.forum = obj;
        next();
      });
    });

    var threads = app.resource('thread', actions);
    app.param('thread', function(req, res, next){
      Thread.get(req.params.thread, function(err, obj){
        if (err) return next(err);
        req.thread = obj;
        next();
      });
    });

    forum.add(threads);

    assert.response(app,
      { url: '/forum/12/thread/1' },
      { body: 'Ferrets: Tobi rules' });
  }
};