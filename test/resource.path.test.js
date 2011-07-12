
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
    
    assert.strictEqual(app.resource.path.forums(), '/forums');
    assert.strictEqual(app.resource.path.new_forum(), '/forums/new');
    assert.strictEqual(app.resource.path.forum({id: 5}), '/forums/5');    
    assert.strictEqual(app.resource.path.edit_forum({id: 5}), '/forums/5/edit');
  },
  'test shallow nesting': function(){
    var app = express.createServer();

    var forumObj = {id: 5};
    var threadObj = {id: 50};

    var forum = app.resource('forums', require('./fixtures/forum'));
    var thread = app.resource('threads', require('./fixtures/thread'));
    forum.map(thread);
    
    assert.strictEqual(app.resource.path.forums(), '/forums');
    assert.strictEqual(app.resource.path.new_forum(), '/forums/new');
    assert.strictEqual(app.resource.path.forum(forumObj), '/forums/5');    
    assert.strictEqual(app.resource.path.edit_forum(forumObj), '/forums/5/edit');
    
    assert.strictEqual(app.resource.path.forum_threads(forumObj), '/forums/5/threads');
    assert.strictEqual(app.resource.path.new_forum_thread(forumObj), '/forums/5/threads/new');
    assert.strictEqual(app.resource.path.forum_thread(forumObj, threadObj), '/forums/5/threads/50');
    assert.strictEqual(app.resource.path.edit_forum_thread(forumObj, threadObj), '/forums/5/threads/50/edit');    
  },
  'test top level resource nesting': function(){
    var app = express.createServer();

    var forumObj = {id: 5};
    var threadObj = {id: 50};

    var forum = app.resource(require('./fixtures/forum'));
    var thread = app.resource('threads', require('./fixtures/thread'));
    forum.map(thread);
    
    assert.strictEqual(app.resource.path.roots(), '/');
    assert.strictEqual(app.resource.path.new_root(), '/new');
    assert.strictEqual(app.resource.path.root(forumObj), '/5');    
    assert.strictEqual(app.resource.path.edit_root(forumObj), '/5/edit');
    
    assert.strictEqual(app.resource.path.root_threads(forumObj), '/5/threads');
    assert.strictEqual(app.resource.path.new_root_thread(forumObj), '/5/threads/new');
    assert.strictEqual(app.resource.path.root_thread(forumObj, threadObj), '/5/threads/50');
    assert.strictEqual(app.resource.path.edit_root_thread(forumObj, threadObj), '/5/threads/50/edit');    
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
    
    assert.strictEqual(app.resource.path.users(), '/users');
    
    assert.strictEqual(app.resource.path.user_forums(userObj), '/users/1/forums');
    assert.strictEqual(app.resource.path.new_user_forum(userObj), '/users/1/forums/new');
    assert.strictEqual(app.resource.path.user_forum(userObj, forumObj), '/users/1/forums/5');    
    assert.strictEqual(app.resource.path.edit_user_forum(userObj, forumObj), '/users/1/forums/5/edit');
    
    assert.strictEqual(app.resource.path.user_forum_threads(userObj, forumObj), '/users/1/forums/5/threads');
    assert.strictEqual(app.resource.path.new_user_forum_thread(userObj, forumObj), '/users/1/forums/5/threads/new');
    assert.strictEqual(app.resource.path.user_forum_thread(userObj, forumObj, threadObj), '/users/1/forums/5/threads/50');
    assert.strictEqual(app.resource.path.edit_user_forum_thread(userObj, forumObj, threadObj), '/users/1/forums/5/threads/50/edit');    
  },  
  
};