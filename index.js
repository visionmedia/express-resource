
/*!
 * Express - Resource
 * Copyright(c) 2010-2011 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2011 Daniel Gasienica <daniel@gasienica.ch>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , en = require('lingo').en;

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
    , name = '/' + (this.name || '')
    , path = this.name ? name + '/' : '/';

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
 * @param {String|Object} name or actions
 * @param {Object} actions
 * @return {Resource}
 * @api public
 */

express.HTTPServer.prototype.resource =
express.HTTPSServer.prototype.resource = function(name, actions){
  if ('object' == typeof name) actions = name, name = null;
  this.resources = this.resources || {};
  var res = this.resources[name] = new Resource(name, actions, this);
  return res;
};

/**
 * Define a nested resource with the given `parent`, `name` and `actions`.
 *
 * @param {String} parent
 * @param {String} name
 * @param {Object} actions
 * @return {Resource}
 * @api public
 */

express.HTTPServer.prototype.nestedResource =
express.HTTPSServer.prototype.nestedResource = function(parent, name, actions){
  name = parent + '/:' + en.singularize(parent) + '_id/' + name;
  return this.resource.call(this, name, actions);
};

