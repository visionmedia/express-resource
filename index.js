
/*!
 * Express - Resource
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , Server = express.Server;

/**
 * Initialize a new `Resource` with the given `name` and `actions`.
 *
 * @param {String} name
 * @param {Object} actions
 * @param {Server} app
 * @api private
 */

var Resource = module.exports = function Resource(name, actions, app) {
  this.name = name;
  this.app = app;
  this.actions = actions
  this.id = actions.id || 'id';
  for (var key in actions) {
    this.defineAction(key, actions[key]);
  }
};

/**
 * Define the given action `name` with a callback `fn()`.
 *
 * @param {String} key
 * @param {Function} fn
 * @api public
 */

Resource.prototype.defineAction = function(key, fn){
  var app = this.app
    , id = this.id
    , name = '/' + this.name;

  switch (key) {
    case 'index':
      app.get(name, fn);
      break;
    case 'new':
      app.get(name + '/new', fn);
      break;
    case 'create':
      app.post(name, fn);
      break;
    case 'show':
      app.get(name + '/:' + id, fn);
      break;
    case 'edit':
      app.get(name + '/:' + id + '/edit', fn);
      break;
    case 'update':
      app.put(name + '/:' + id, fn);
      break;
    case 'destroy':
      app.del(name + '/:' + id, fn);
      break;
  }
};

/**
 * Define a resource with the given `name` and `actions`.
 *
 * @param {String} name
 * @param {Object} actions
 * @return {Resource}
 * @api public
 */

Server.prototype.resource = function(name, actions){
  this.resources = this.resources || {};
  var res = this.resources[name] = new Resource(name, actions, this);
  return res;
};
