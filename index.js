
/*!
 * Express - Resource
 * Copyright(c) 2010-2011 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2011 Daniel Gasienica <daniel@gasienica.ch>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express');

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
  this.base = '/';
  this.id = actions.id || 'id';
  for (var key in actions) {
    this.defineDefaultAction(key, actions[key]);
  }
};

/**
 * Map http `method` and optional `path` to `fn`.
 *
 * @param {String} method
 * @param {String|Function} path
 * @param {Function} fn
 * @return {Resource} for chaining
 * @api public
 */

Resource.prototype.map = function(method, path, fn){
  if ('function' == typeof path) fn = path, path = '';
  method = method.toLowerCase();
  var name = this.base + (this.name || '');
  name += (this.name && path) ? '/' : '';
  name += path;
  this.app[method](name, fn);
  return this;
};

/**
 * Define the given action `name` with a callback `fn()`.
 *
 * @param {String} key
 * @param {Function} fn
 * @api private
 */

Resource.prototype.defineDefaultAction = function(key, fn){
  var id = this.id

  switch (key) {
    case 'index':
      this.map('GET', fn);
      break;
    case 'new':
      this.map('GET', 'new', fn);
      break;
    case 'create':
      this.map('POST', fn);
      break;
    case 'show':
      this.map('GET', ':' + id, fn);
      break;
    case 'edit':
      this.map('GET', ':' + id + '/edit', fn);
      break;
    case 'update':
      this.map('PUT', ':' + id, fn);
      break;
    case 'destroy':
      this.map('DEL', ':' + id, fn);
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
