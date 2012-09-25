
/**
 * Module dependencies.
 */
var assert = require('assert')
  , express = require('express')
  , should = require('should')
  , Resource = require('../');

module.exports = {
  'test app.resource() with middleware': function(){
    var app = express.createServer();

    var authMiddleware = function (req, res, next) {
      if( req.auth ){
        next()
      } else {
        res.send('must auth')
      }
    };
    var setupMiddleware = function (req, res, next) {
      req.values = [];
      next()
    };
    var append1Middleware = function (req, res, next) {
      req.values.push(1);
      next()
    };
    var append2Middleware = function (req, res, next) {
      req.values.push(2);
      next()
    };
    var finalMiddleware = function (req, res, next) {
      res.json(req.values);
    };
    var simpleMiddlewareObj = {
      index: authMiddleware,
      create: [setupMiddleware, append1Middleware, append2Middleware, finalMiddleware]
    };

    var ret = app.resource('forums', require('./fixtures/forum'), {middleware: simpleMiddlewareObj});
    ret.should.be.an.instanceof(Resource);

    assert.response(app,
      { url: '/forums' },
      { body: 'must auth' });

    assert.response(app,
      { url: '/forums/new' },
      { body: 'new forum' });

    assert.response(app,
      { url: '/forums', method: 'POST' },
      { body: '[1,2]' });

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


  'test app.resource() with global (*) middleware': function(){
    var app = express.createServer();

    var authMiddleware = function (req, res, next) {
      if( req.auth ){
        next()
      } else {
        res.send('must auth')
      }
    };
    var simpleMiddlewareObj = {
      '*': authMiddleware,
    };

    var ret = app.resource('forums', require('./fixtures/forum'), {middleware: simpleMiddlewareObj});
    ret.should.be.an.instanceof(Resource);

    assert.response(app,
      { url: '/forums' },
      { body: 'must auth' });

    assert.response(app,
      { url: '/forums/new' },
      { body: 'must auth' });

    assert.response(app,
      { url: '/forums', method: 'POST' },
      { body: 'must auth' });

    assert.response(app,
      { url: '/forums/5' },
      { body: 'must auth' });

    assert.response(app,
      { url: '/forums/5/edit' },
      { body: 'must auth' });

    assert.response(app,
      { url: '/forums/5', method: 'PUT' },
      { body: 'must auth' });

    assert.response(app,
      { url: '/forums/5', method: 'DELETE' },
      { body: 'must auth' });
  },


  'test actions with inline middleware': function(){
    var app = express.createServer();

    var authMiddleware = function (req, res, next) {
      if( req.auth ){
        next()
      } else {
        res.send('must auth')
      }
    };
    var setupMiddleware = function (req, res, next) {
      req.values = [];
      next()
    };
    var append1Middleware = function (req, res, next) {
      req.values.push(1);
      next()
    };
    var append2Middleware = function (req, res, next) {
      req.values.push(2);
      next()
    };
    var finalMiddleware = function (req, res, next) {
      res.json(req.values);
    };

    var actions = {
      index: {
        middleware: authMiddleware,
        fn: function(req, res){
          res.end('index');
        }
      },
      'new': {
        middleware: [ setupMiddleware, append1Middleware, append2Middleware, finalMiddleware],
        fn: function(req, res){
          res.end('new');
        }
      },
      'create': [ setupMiddleware, append1Middleware, append2Middleware, finalMiddleware, function(req, res){
          res.end('create');
      } ],
      'show': function(req, res){
          res.end('show');
      }
    };

    var ret = app.resource('forums', actions);
    ret.should.be.an.instanceof(Resource);

    assert.response(app,
      { url: '/forums' },
      { body: 'must auth' });

    assert.response(app,
      { url: '/forums/new' },
      { body: '[1,2]' });

    assert.response(app,
      { url: '/forums', method: 'POST' },
      { body: '[1,2]' });
  },

  
  'test deep nesting with middleware': function(){
    var app = express.createServer();

    var authMiddleware = function (req, res, next) {
      if( req.auth ){
        next()
      } else {
        res.send('must auth')
      }
    };
    var simpleMiddlewareObj = {
      index: authMiddleware,
    };

    var user = app.resource('users', { index: function(req, res){ res.end('users'); } });
    var forum = app.resource('forums', require('./fixtures/forum'), {middleware: simpleMiddlewareObj});
    var thread = app.resource('threads', require('./fixtures/thread'));

    var ret = user.add(forum);
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
      { body: 'must auth' });
    
    assert.response(app,
      { url: '/users/5/forums/12' },
      { body: 'show forum 12' });
    
    assert.response(app,
      { url: '/users/5/forums/12/threads' },
      { body: 'thread index of forum 12' });
    
    assert.response(app,
      { url: '/users/5/forums/1/threads/50' },
      { body: 'show thread 50 of forum 1' });
  }
};