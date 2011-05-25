
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
  , join = require('path').join
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
  this.name = name;
  this.app = app;
  this.routes = {};
  actions = actions || {};
  this.base = actions.base || '/';
  if ('/' != this.base[this.base.length - 1]) this.base += '/';
  this.format = actions.format;
  this.id = actions.id || this.defaultId;
  this.param = ':' + this.id;

  // default actions
  for (var key in actions) {
    this.mapDefaultAction(key, actions[key]);
  }

  // auto-loader
  if (actions.load) this.load(actions.load);
};

/**
 * Set the auto-load `fn`.
 *
 * @param {Function} fn
 * @return {Resource} for chaining
 * @api public
 */

Resource.prototype.load = function(fn){
  var self = this
    , id = this.id;

  this.loadFunction = fn;
  this.app.param(this.id, function(req, res, next){
    fn(req.params[id], function(err, obj){
      if (err) return next(err);
      // TODO: ideally we should next() passed the
      // route handler
      if (null == obj) return res.send(404);
      req[id] = obj;
      next();
    });
  });

  return this;
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
 * @param {String|Function|Object} path
 * @param {Function} fn
 * @return {Resource} for chaining
 * @api public
 */

Resource.prototype.map = function(method, path, fn){
  var self = this
    , orig = path;

  if (method instanceof Resource) return this.add(method);
  if ('function' == typeof path) fn = path, path = '';
  if ('object' == typeof path) fn = path, path = '';
  if ('/' == path[0]) path = path.substr(1);
  else path = join(this.param, path);
  method = method.toLowerCase();

  // setup route pathname
  var route = this.base + (this.name || '');
  if (this.name && path) route += '/';
  route += path;
  route += '.:format?';

  // register the route so we may later remove it
  (this.routes[method] = this.routes[method] || {})[route] = {
      method: method
    , path: route
    , orig: orig
    , fn: fn
  };

  // apply the route
  this.app[method](route, function(req, res, next){
    req.format = req.params.format || self.format;
    if (req.format) res.contentType(req.format);
    if ('object' == typeof fn) {
      if (req.format && fn[req.format]) {
        fn[req.format](req, res, next);
      } else if (fn.default) {
        fn.default(req, res, next);
      } else {
        res.send(406);
      }
    } else {
      fn(req, res, next);
    }
  });

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
  var app = this.app
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
      app[method](key).remove();
      resource.map(route.method, route.orig, route.fn);
    }
  }

  return this;
};

/**
 * Map the given action `name` with a callback `fn()`.
 *
 * @param {String} key
 * @param {Function} fn
 * @api private
 */

Resource.prototype.mapDefaultAction = function(key, fn){
  switch (key) {
    case 'index':
      this.get('/', fn);
      break;
    case 'new':
      this.get('/new', fn);
      break;
    case 'create':
      this.post('/', fn);
      break;
    case 'show':
      this.get(fn);
      break;
    case 'edit':
      this.get('edit', fn);
      break;
    case 'update':
      this.put(fn);
      break;
    case 'destroy':
      this.del(fn);
      break;
  }
};

/**
 * Setup http verb methods.
 */

express.router.methods.concat(['del', 'all']).forEach(function(method){
  Resource.prototype[method] = function(path, fn){
    if ('function' == typeof path
      || 'object' == typeof path) fn = path, path = '';
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
express.HTTPSServer.prototype.resource = function(name, actions, opts){
  var options = actions || {};
  if ('object' == typeof name) actions = name, name = null;
  if (options.id) actions.id = options.id;
  this.resources = this.resources || {};
  if (!actions) return this.resources[name] || new Resource(name, null, this);
  for (var key in opts) options[key] = opts[key];
  var res = this.resources[name] = new Resource(name, actions, this);
  return res;
};
