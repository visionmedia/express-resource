
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

    var users = app.resource('users');

    users.get('/', function(req, res){
      res.send('index');
    }).get('/online', function(req, res){
      res.send('users online');
    });

    users.get(function(req, res){
      res.send(req.params.user);
    }).get('online', function(req, res){
      res.send('no');
    });

    assert.response(app,
      { url: '/users/online' },
      { body: 'users online' });

    assert.response(app,
      { url: '/users' },
      { body: 'index' });

    assert.response(app,
      { url: '/users/0' },
      { body: '0' });

    assert.response(app,
      { url: '/users/0/online' },
      { body: 'no' });
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

    var ret = user.map(forum);
    ret.should.equal(user);
    
    var ret = forum.add(thread);
    ret.should.equal(forum);

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

  'test root nesting': function(){
    var app = express.createServer();
    
    var forum = app.resource(require('./fixtures/forum'));
    var thread = app.resource('threads', require('./fixtures/thread'));
    forum.map(thread);

    assert.response(app,
      { url: '/' },
      { body: 'forum index' });

    assert.response(app,
      { url: '/12' },
      { body: 'show forum 12' });

    assert.response(app,
      { url: '/12/threads' },
      { body: 'thread index of forum 12' });
    
    assert.response(app,
      { url: '/1/threads/50' },
      { body: 'show thread 50 of forum 1' });
  },

  'test shallow auto-loading': function(){
    var app = express.createServer();
    var Forum = require('./fixtures/forum').Forum;

    var actions = { show: function(req, res){
      res.end(req.forum.title);
    }};

    actions.load = Forum.get;
    var forum = app.resource('forum', actions);

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

    var forum = app.resource('forum', { load: Forum.get });
    var threads = app.resource('thread', actions, { load: Thread.get });

    forum.add(threads);

    assert.response(app,
      { url: '/forum/12/thread/1' },
      { body: 'Ferrets: Tobi rules' });
  },
  
  'test .load(fn)': function(){
    var app = express.createServer();
    var Forum = require('./fixtures/forum').Forum;

    var actions = { show: function(req, res){
      res.end(req.forum.title);
    }};

    var forum = app.resource('forum', actions);
    forum.load(Forum.get);

    assert.response(app,
      { url: '/forum/12' },
      { body: 'Ferrets' });
  },
  
  'test auto-loading no resource': function(){
     var app = express.createServer();

     function load(id, fn) { fn(); }
     var actions = { show: function(){
       assert.fail('called show when loader failed');
     }};

     app.resource('pets', actions, { load: load });

     assert.response(app,
      { url: '/pets/0' },
      { body: 'Not Found', status: 404 });
  },
  
  'test custom route configuration': function(){
    var app = express.createServer();
    var Forum = require('./fixtures/forum').Forum;
    
    function load(id, fn) { fn(null, "User"); }
    var actions = {
      login: function(req, res){
        res.end('login');
      },
      logout: function(req, res){
        res.end('logout');
      }/*,
      show: function(req, res) {
        res.end('login and logout must be registered ahead of show to work');
      }*/
    };
    
    var users = app.resource('users', actions, { load: load });
    users.map('get', 'login', actions.login);
    users.map('get', '/logout', actions.logout);
    
    assert.response(app,
      { url: '/users/1/login' },
      { body: 'login' });
      
    assert.response(app, 
      { url: '/users/logout' },
      { body: 'logout' });    
  },
  
  'test several segments': function(){
    var app = express.createServer();
    var cat = app.resource('api/cat', require('./fixtures/cat'));

    assert.response(app,
      { url: '/api/cat' },
      { body: 'list of cats' });

    assert.response(app,
      { url: '/api/cat/new' },
      { body: 'new cat' });
  },

  'test middleware by array': function() {
    var app = express.createServer();
    var cat = app.resource('api/cat', require('./fixtures/cat'));

    assert.response(app,
      { url: '/api/cat/1/edit' },
      { body: 'usertype: cat owner' });
  },

  'test middleware by array with shallow nesting and format': function(){
    var app = express.createServer();

    var forum = app.resource('forums', require('./fixtures/forum.middleware'));
    var thread = app.resource('threads', require('./fixtures/thread.middleware'));
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
      { url: '/forums/1/threads/50.json' },
      { body: '{"thread":"50","forum":"1","role":"thread owner"}'
        , headers: { 'Content-Type': 'application/json' } });
  },

  'test mapping custom actions with strings': function() {
    var app = express.createServer();
    
    var actions = {
      login: function(req, res){
        res.end('login');
      },
      logout: function(req, res){
        res.end('logout');
      }/*,
      show: function(req, res) {
        res.end('login and logout must be registered ahead of show to work');
      }*/
    };
    
    app.resource('users', actions)
      .map('all', '/login', 'login')
      .map('all', '/logout', 'logout');
    
    assert.response(app,
      { url: '/users/login' },
      { body: 'login' });

    assert.response(app,
      { url: '/users/logout' },
      { body: 'logout' });
  }
};