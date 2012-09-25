
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
 * Pre-defined action ordering.
 */

var orderedActions = [
  'index'    //  GET  /
  ,'new'     //  GET  /new
  ,'create'  //  POST /
  ,'show'    //  GET  /:id
  ,'edit'    //  GET  /edit/:id
  ,'update'  //  PUT  /:id
  ,'destroy' //  DEL  /:id
];

var defaultMiddleware = {
  'index': null
  ,'new': null
  ,'create': null
  ,'show': null
  ,'edit': null
  ,'update': null
  ,'destroy': null
  ,'*': null
};

function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

/**
 * Initialize a new `Resource` with the given `name` and `actions`.
 *
 * @param {String} name
 * @param {Object} actions
 * @param {Server} app
 * @api private
 */

var Resource = module.exports = function Resource(name, actions, app, opts) {
  this.name = name;
  this.app = app;
  this.options = opts || {};
  this.middleware = this.options.middleware || defaultMiddleware;
  this.routes = {};
  actions = actions || {};
  this.base = actions.base || '/';
  if ('/' != this.base[this.base.length - 1]) this.base += '/';
  this.format = actions.format;
  this.id = actions.id || this.defaultId;
  this.param = ':' + this.id;

  // default actions
  for (var i=0, key; i < orderedActions.length; i++) {
    key = orderedActions[i];
    if (actions[key]) this.mapDefaultAction(key, actions[key]);
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
    function callback(err, obj){
      if (err) return next(err);
      // TODO: ideally we should next() passed the
      // route handler
      if (null == obj) return res.send(404);
      req[id] = obj;
      next();
    };
    
    // Maintain backward compatibility
    if (2 == fn.length) {
      fn(req.params[id], callback);
    } else {
      fn(req, req.params[id], callback);
    }
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
    ? en.singularize(this.name.split('/').pop())
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

Resource.prototype.map = function(method, path, fnmap){
  var self = this
    , orig = path;

  if (method instanceof Resource) return this.add(method);

  var middleware, fn;
  if ('function' == typeof fnmap) {
    middleware = [];
    fn = fnmap;
  } else if (isArray(fnmap) && (fnmap.length > 1) && ('0' in Object(fnmap))) {
    middleware = fnmap.slice(0, fnmap.length-1);
    fn = fnmap[fnmap.length-1];
  } else if (('object' == typeof fnmap) && fnmap.hasOwnProperty('fn')) {
    middleware = fnmap.middleware
    fn = fnmap.fn;
  } else {
    middleware = [];
    fn = fnmap;
  } 

   if (isArray(fn) && (fn.length > 1) && ('0' in Object(fn)) && (middleware.length == 0)) {
    middleware = middleware.concat(fn.slice(0, fn.length-1));
    fn = fn[fn.length-1];
  } else if (('object' == typeof fn) && fn.hasOwnProperty('fn') && fn.hasOwnProperty('middleware')) {
    middleware = middleware.concat(fn.middleware);
    fn = fn.fn;
  }

  if ('function' == typeof path) fn = path, path = '';
  if ('object' == typeof path) fn = path, path = '';
  if ('/' == path[0]) path = path.substr(1);
  else path = path ? this.param + '/' + path : this.param;
  method = method.toLowerCase();

  // setup route pathname
  var route = this.base + (this.name || '');
  if (this.name && path) route += '/';
  route += path;
  route += '.:format?';

  if (middleware === undefined)
    middleware = [];

  // register the route so we may later remove it
  (this.routes[method] = this.routes[method] || {})[route] = {
      method: method
    , path: route
    , orig: orig
    , middleware: middleware
    , fn: fn
    , fnmap: fnmap
  };

  // apply the route
  this.app[method](route, middleware, function(req, res, next){
    req.format = req.params.format || req.format || self.format;
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
  resource.base = this.base
    + (this.name ? this.name + '/': '')
    + this.param + '/';

  // re-define previous actions
  for (var method in resource.routes) {
    routes = resource.routes[method];
    for (var key in routes) {
      route = routes[key];
      delete routes[key];
      app[method](key).remove();
      resource.map(route.method, route.orig, route.fnmap);
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
  var middleware = this.middleware[key] || this.middleware['*'] || [];
  var fnmap = {'fn': fn, 'middleware': middleware};
  switch (key) {
    case 'index':
      this.get('/', fnmap);
      break;
    case 'new':
      this.get('/new', fnmap);
      break;
    case 'create':
      this.post('/', fnmap);
      break;
    case 'show':
      this.get(fnmap);
      break;
    case 'edit':
      this.get('edit', fnmap);
      break;
    case 'update':
      this.put(fnmap);
      break;
    case 'destroy':
      this.del(fnmap);
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
    var middleware = this.middleware[method] || [];
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
  if (!actions) return this.resources[name] || new Resource(name, null, this, opts);
  for (var key in opts) options[key] = opts[key];
  var res = this.resources[name] = new Resource(name, actions, this, opts);
  return res;
};
