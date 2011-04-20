var assert = require('assert')
  , express = require('express')
  , Resource = require('../');

var app = express.createServer();

var ret = app.resource('forums', require('./fixtures/forum'));


Resource.prototype.list_routes = function() {
	var rs = '';
	for (var method in this.routes) {
		rs += method + '>>\n';
		
		var routes = this.routes[method];
		for (var key in routes) {
			var r = routes[key];
			rs += r.method + ': ' + r.path + '\n';
		}
	}
	return rs;
};

console.log(ret.list_routes());


module.exports = {
	'dummy': function() {
		assert.equal(1, 1);
	}
}