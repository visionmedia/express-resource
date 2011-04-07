
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
  , lingo = require('lingo')
  , en = lingo.en;

/**
 * Initialize a new `Resource` with the given `name` and `actions`.
 *
 * @param {String} name
 * @param {Object} actions
 * @param {Server} app
 * @api private
 */

var Resource = module.exports = function Resource(name, actions, app) {
  this.base = '/';
  this.name = name;
  this.app = app;
  this.routes = {};
  actions = actions || {};
  var id = this.id = actions.id || this.defaultId;
  this.param = ':' + this.id;

  // default actions
  for (var key in actions) {
    this.mapDefaultAction(key, actions[key]);
  }

  // auto-loader
  if (actions.load) {
    app.param(this.id, function(req, res, next){
      actions.load(req.params[id], function(err, obj){
        if (err) return next(err);
        req[id] = obj;
        next();
      });
    });
  }
};

/**
 * Retun this resource's default id string.
 *
 * @return {String}
 * @api private
 */

Resource.prototype.__defineGetter__('defaultId', function(){
  return this.name
    ? en.singularize(this.name)
    : 'id';
});

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
  if (method instanceof Resource) return this.add(method);
  if ('function' == typeof path) fn = path, path = '';
  method = method.toLowerCase();
  var route = this.base + (this.name || '');
  route += (this.name && path) ? '/' : '';
  route += path;
  (this.routes[method] = this.routes[method] || {})[route] = {
      method: method
    , path: route
    , orig: path
    , fn: fn
  };
  this.app[method](route, fn);
  return this;
};

/**
 * Nest the given `resource`.
 *
 * @param {Resource} resource
 * @return {Resource} for chaining
 * @see Resource#map()
 * @api public
 */

Resource.prototype.add = function(resource){
  var router = this.app.router
    , routes
    , route;

  // relative base
  resource.base = this.base + this.name + '/' + this.param + '/';

  // re-define previous actions
  for (var method in resource.routes) {
    routes = resource.routes[method];
    for (var key in routes) {
      route = routes[key];
      delete routes[key];
      router.remove(key, route.method);
      resource.map(route.method, route.orig, route.fn);
    }
  }
};

/**
 * Map the given action `name` with a callback `fn()`.
 *
 * @param {String} key
 * @param {Function} fn
 * @api private
 */

Resource.prototype.mapDefaultAction = function(key, fn){
  var id = this.param;

  switch (key) {
    case 'index':
      this.get(fn);
      break;
    case 'new':
      this.get('new', fn);
      break;
    case 'create':
      this.post(fn);
      break;
    case 'show':
      this.get(id, fn);
      break;
    case 'edit':
      this.get(id + '/edit', fn);
      break;
    case 'update':
      this.put(id, fn);
      break;
    case 'destroy':
      this.del(id, fn);
      break;
  }
};

/**
 * Setup http verb methods.
 */

express.router.methods.concat(['del', 'all']).forEach(function(method){
  Resource.prototype[method] = function(path, fn){
    if ('function' == typeof path) fn = path, path = '';
    this.map(method, path, fn);
    return this;
  }
});

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
  var options = actions || {};
  if ('object' == typeof name) actions = name, name = null;
  if (options.id) actions.id = options.id;
  this.resources = this.resources || {};
  if (!actions) return this.resources[name] || new Resource(name, null, this);
  var res = this.resources[name] = new Resource(name, actions, this);
  return res;
};
