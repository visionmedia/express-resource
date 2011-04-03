
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

var util = require('util');

/**
 * Initialize a new `Resource` with the given `name` and `actions`.
 *
 * @param {String} name
 * @param {Object} actions
 * @param {Server} app
 * @param {Boolean} singular
 * @api private
 */

var Resource = module.exports = function Resource(name, actions, app, singular) {
  this.name = name;
  this.app = app;
  this.actions = actions
  this.id = actions.id || 'id';
  for (var key in actions) {
    this.defineAction(key, actions[key], singular);
  }
};

/**
 * Define the given action `name` with a callback `fn()`.
 *
 * @param {String} key
 * @param {Function} fn
 * @param {Boolean} singular
 * @api public
 */

Resource.prototype.defineAction = function(key, fn, singular){
  var app = this.app
    , id = this.id
    , name = '/' + (this.name || '')
    , slash1 = this.name? '/' : ''
		, slash2 = (this.name || !singular)? '/': ''
    , id_segment = singular? '': slash1 + ':' + id;
    
    if (!singular && key == 'index') {
      app.get(name, fn);
    }
    else {
      switch (key) {
        case 'new':
          app.get(name + slash1 + 'new', fn);
          break;
        case 'create':
          app.post(name, fn);
          break;
        case 'show':
          app.get(name + id_segment, fn);
          break;
        case 'edit':
          app.get(name + id_segment + slash2 + 'edit', fn);
          break;
        case 'update':
          app.put(name + id_segment, fn);
          break;
        case 'destroy':
          app.del(name + id_segment, fn);
          break;
      }
  }
};

/**
 * Add a member route `key` invoked using the HTTP verb `verb`.
 *
 * @param {String} key
 * @param {String} verb
 * @api public
 */

Resource.prototype.member = function(key, verb) {
  var app = this.app
    , id = this.id
    , name = '/' + (this.name || '')
    , slash = this.name? '/' : ''
    , id_segment = slash + ':' + id;
  var fn = this.actions[key];
  
  app[verb](name + id_segment + '/' + key, fn);
	return this;
};

/**
 * Add a bunch of member routes.
 *
 * @param {Object} mems
 * @api public
 */

Resource.prototype.members = function(mems) {
  for (var key in mems) {
    this.member(key, mems[key]);
	}
};

/**
 * Add a collection route `key` invoked using the HTTP verb `verb`.
 *
 * @param {String} key
 * @param {String} verb
 * @api public
 */

Resource.prototype.collection = function(key, verb) {
  var app = this.app
    , id = this.id
    , name = '/' + (this.name || '')
    , slash = this.name? '/' : '';
  var fn = this.actions[key];
  
  app[verb](name + slash + key, fn);
	return this;
};

/**
 * Add a bunch of collection routes.
 *
 * @param {Object} mems
 * @api public
 */

Resource.prototype.collections = function(colls) {
  for (var key in colls)
    this.collection(key, colls[key]);
};

/**
 * Define a resource with the given `name` and `actions`.
 *
 * @param {String|Object} name or actions
 * @param {Object} actions
 * @param {Boolan} singular
 * @return {Resource}
 * @api public
 */
 
var define_resource = function(singular) {
  return function(name, actions){
    if ('object' == typeof name) { actions = name; name = null; }
    this.resources = this.resources || {};
    var res = this.resources[name] = new Resource(name, actions, this, singular);
    return res;
  };
}

express.HTTPServer.prototype.resource =
express.HTTPSServer.prototype.resource = define_resource(false);

express.HTTPServer.prototype.singular_resource =
express.HTTPSServer.prototype.singular_resource = define_resource(true);
