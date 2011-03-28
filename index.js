
/*!
 * Express - Resource
 * Copyright(c) 2011 Daniel Gasienica <daniel@gasienica.ch>
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , Server = express.HTTPServer
    ? express.HTTPServer
    : express.Server;

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
    , name = '/' + this.name
    , path = this.name === '' ? '/' : name + '/';

  switch (key) {
    case 'index':
      app.get(name, fn);
      break;
    case 'new':
      app.get(path + 'new', fn);
      break;
    case 'create':
      app.post(name, fn);
      break;
    case 'show':
      app.get(path + ':' + id, fn);
      break;
    case 'edit':
      app.get(path + ':' + id + '/edit', fn);
      break;
    case 'update':
      app.put(path + ':' + id, fn);
      break;
    case 'destroy':
      app.del(path + ':' + id, fn);
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
