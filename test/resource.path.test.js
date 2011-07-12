
/**
 * Module dependencies.
 */
var assert = require('assert')
  , express = require('express')
  , should = require('should')
  , Resource = require('../');

module.exports = {
  'test resource': function(){
    var app = express.createServer();
    var ret = app.resource('forums', require('./fixtures/forum'));    
    
    assert.strictEqual(app.resource.path.forums_path(), '/forums');
    assert.strictEqual(app.resource.path.new_forum_path(), '/forums/new');
    assert.strictEqual(app.resource.path.forum_path({id: 5}), '/forums/5');    

    assert.strictEqual(app.resource.path.forum_path({id: 10}), '/forums/10');    
    
    assert.strictEqual(app.resource.path.edit_forum_path({id: 5}), '/forums/5/edit');
  },  
  'test shallow nesting': function(){
    var app = express.createServer();

    var forumObj = {id: 5};
    var threadObj = {id: 50};

    var forum = app.resource('forums', require('./fixtures/forum'));
    var thread = app.resource('threads', require('./fixtures/thread'));
    forum.map(thread);
    
    assert.strictEqual(app.resource.path.forums_path(), '/forums');
    assert.strictEqual(app.resource.path.new_forum_path(), '/forums/new');
    assert.strictEqual(app.resource.path.forum_path(forumObj), '/forums/5');    
    assert.strictEqual(app.resource.path.edit_forum_path(forumObj), '/forums/5/edit');
    
    assert.strictEqual(app.resource.path.forum_threads_path(forumObj), '/forums/5/threads');
    assert.strictEqual(app.resource.path.new_forum_thread_path(forumObj), '/forums/5/threads/new');
    assert.strictEqual(app.resource.path.forum_thread_path(forumObj, threadObj), '/forums/5/threads/50');
    assert.strictEqual(app.resource.path.edit_forum_thread_path(forumObj, threadObj), '/forums/5/threads/50/edit');    
  },
  'test top level resource nesting': function(){
    var app = express.createServer();

    var forumObj = {id: 5};
    var threadObj = {id: 50};

    var forum = app.resource(require('./fixtures/forum'));
    var thread = app.resource('threads', require('./fixtures/thread'));
    forum.map(thread);
    
    assert.strictEqual(app.resource.path.roots_path(), '/');
    assert.strictEqual(app.resource.path.new_root_path(), '/new');
    assert.strictEqual(app.resource.path.root_path(forumObj), '/5');    
    assert.strictEqual(app.resource.path.edit_root_path(forumObj), '/5/edit');
    
    assert.strictEqual(app.resource.path.root_threads_path(forumObj), '/5/threads');
    assert.strictEqual(app.resource.path.new_root_thread_path(forumObj), '/5/threads/new');
    assert.strictEqual(app.resource.path.root_thread_path(forumObj, threadObj), '/5/threads/50');
    assert.strictEqual(app.resource.path.edit_root_thread_path(forumObj, threadObj), '/5/threads/50/edit');    
  },
  'test deep resource nesting': function(){
    var app = express.createServer();

    var userObj = {id: 1};
    var forumObj = {id: 5};
    var threadObj = {id: 50};

    var user = app.resource('users', { index: function(req, res){ res.end('users'); } });
    var forum = app.resource('forums', require('./fixtures/forum'));
    var thread = app.resource('threads', require('./fixtures/thread'));

    var ret = user.add(forum);
    ret.should.equal(user);
    
    var ret = forum.add(thread);
    ret.should.equal(forum);
    
    assert.strictEqual(app.resource.path.users_path(), '/users');
    
    assert.strictEqual(app.resource.path.user_forums_path(userObj), '/users/1/forums');
    assert.strictEqual(app.resource.path.new_user_forum_path(userObj), '/users/1/forums/new');
    assert.strictEqual(app.resource.path.user_forum_path(userObj, forumObj), '/users/1/forums/5');    
    assert.strictEqual(app.resource.path.edit_user_forum_path(userObj, forumObj), '/users/1/forums/5/edit');
    
    assert.strictEqual(app.resource.path.user_forum_threads_path(userObj, forumObj), '/users/1/forums/5/threads');
    assert.strictEqual(app.resource.path.new_user_forum_thread_path(userObj, forumObj), '/users/1/forums/5/threads/new');
    assert.strictEqual(app.resource.path.user_forum_thread_path(userObj, forumObj, threadObj), '/users/1/forums/5/threads/50');
    assert.strictEqual(app.resource.path.edit_user_forum_thread_path(userObj, forumObj, threadObj), '/users/1/forums/5/threads/50/edit');    
  },  
  'test resource with custom actions': function(){
    var app = express.createServer();
    var ret = app.resource('forums', require('./fixtures/forum'));   
    
    var actions = {
      lock: function(req, res){
        res.end('login');
      },
      design: function(req, res){
        res.end('logout');
      }
    };

    ret.map('get', 'lock', actions.lock);
    ret.map('get', '/design', actions.design);
     
    assert.strictEqual(app.resource.path.design_forums_path(), '/forums/design');
    assert.strictEqual(app.resource.path.lock_forum_path({id: 5}), '/forums/5/lock');
  },
  'test resource with custom id field': function(){
    var app = express.createServer();
    var ret = app.resource('forums', require('./fixtures/forum'));    

    // NOTE: because this is set across all resources, this test should be run last or it will need
    // to be reset for each test.  If this is too confusing, we could change to set in on a per-resource basis. 
    app.resource.path.idField = '_id';

    assert.strictEqual(app.resource.path.forum_path({_id: 5}), '/forums/5');    
    assert.strictEqual(app.resource.path.edit_forum_path({_id: 5}), '/forums/5/edit');
  },  
  
};