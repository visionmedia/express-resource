
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

  'test app.nestedResource()': function(){
    var app = express.createServer();

    var ret = app.nestedResource('users', 'projects', require('./fixtures/project'));
    assert.ok(ret instanceof Resource);

    assert.response(app,
      { url: '/users/3/projects' },
      { body: 'user 3, project index' });

    assert.response(app,
      { url: '/users/3/projects/new' },
      { body: 'user 3, new project' });

    assert.response(app,
      { url: '/users/3/projects', method: 'POST' },
      { body: 'user 3, create project' });

    assert.response(app,
      { url: '/users/3/projects/5' },
      { body: 'user 3, show project 5' });

    assert.response(app,
      { url: '/users/3/projects/5/edit' },
      { body: 'user 3, edit project 5' });

    assert.response(app,
      { url: '/users/3/projects/5', method: 'PUT' },
      { body: 'user 3, update project 5' });

    assert.response(app,
      { url: '/users/3/projects/5', method: 'DELETE' },
      { body: 'user 3, destroy project 5' });
  },

  'test Resource parent app.nestedResource()': function(){
    var app = express.createServer();

    var user = app.resource('users', {});
    app.nestedResource(user, 'projects', { index: function(req, res){
      res.send('user ' + req.params.user_id + ', project index');
    }});

    assert.response(app,
      { url: '/users/3/projects' },
      { body: 'user 3, project index' });
  },

  'test deeply nested app.nestedResource()': function(){
    var app = express.createServer();

    var user = app.resource('users', {});
    var project = app.nestedResource(user, 'projects', {});
    app.nestedResource(project, 'images', { index: function(req, res){
      res.send('user ' + req.params.user_id + ', project ' + req.params.project_id + ', images index');
    }});

    assert.response(app,
      { url: '/users/3/projects/7/images' },
      { body: 'user 3, project 7, images index' });
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
