
# Express Resource

  express-resource provides resourceful routing to express.

## Installation

npm:

    $ npm install express-resource

## Usage

 To get started simply `require('express-resource')`, and this module will monkey-patch the `express.Server`, enabling resourceful routing. A "resource" is simply an object, which defines one of more of the supported "actions" listed below:

    exports.index = function(req, res){
      res.send('forum index');
    };

    exports.new = function(req, res){
      res.send('new forum');
    };

    exports.create = function(req, res){
      res.send('create forum');
    };

    exports.show = function(req, res){
      res.send('show forum ' + req.params.id);
    };

    exports.edit = function(req, res){
      res.send('edit forum ' + req.params.id);
    };

    exports.update = function(req, res){
      res.send('update forum ' + req.params.id);
    };

    exports.destroy = function(req, res){
      res.send('destroy forum ' + req.params.id);
    };

The _id_ option can be specified to prevent collisions:

     exports.id = 'uid';

     exports.destroy = function(req, res) {
       res.send('destroy user ' + req.params.uid);
     };

The `app.resource()` method will create and return a new `Resource`:

    var express = require('express')
      , Resource = require('express-resource')
      , app = express.createServer();

    app.resource('forums', require('./forum'));

Actions are then mapped as follows (by default):

    GET     /forums           ->  index
    GET     /forums/new       ->  new
    POST    /forums           ->  create
    GET     /forums/:id       ->  show
    GET     /forums/:id/edit  ->  edit
    PUT     /forums/:id       ->  update
    DELETE  /forums/:id       ->  destroy

Specify a top-level resource by omitting the resource name:

    var express = require('express')
      , Resource = require('express-resource')
      , app = express.createServer();

    app.resource(require('./forum'));

Top-level actions are then mapped as follows (by default):

    GET     /                 ->  index
    GET     /new              ->  new
    POST    /                 ->  create
    GET     /:id              ->  show
    GET     /:id/edit         ->  edit
    PUT     /:id              ->  update
    DELETE  /:id              ->  destroy


The `app.singular_resource()` method will create and return a new `Resource` that can be accessed without using an `id` (such as the profile for the current user):

    var express = require('express')
      , Resource = require('express-resource')
      , app = express.createServer();

    app.singular_resource('profile', require('./profile'));

Actions are then mapped as follows (by default):

    GET     /profile/new       ->  new
    POST    /profile           ->  create
    GET     /profile           ->  show
    GET     /profile/edit      ->  edit
    PUT     /profile           ->  update
    DELETE  /profile           ->  destroy

Note that there is no `index` action for a singular resource.

The top-level resource may be singular.

The `Resource.prototype.member()` and `Resource.prototype.collection()` methods can be used to add extra routes to a `Resource`. A member route identifies the resource by its `id`, a collection route doesn't. Calls to these members can be chained. For instance,

    var ret = app.resource('forums', require('./forums'));

    ret.member('search', 'post').member('display', 'get');

would map the following actions:

    GET     /forums/:id/display  ->  display
    POST    /forums/:id/search   ->  search

If you prefer, the method `Resource.prototype.members()` can be passed an object, whose keys are the action names and whose values are the HTTP verbs. The above example could have been achieved like this:

    ret.members({search:'post', display: 'get' });

Similarly,

    ret.collection('map', 'post').collection('sequence', 'get');

or

    ret.collections({map:'post', sequence: 'get' });

would provide

    GET     /forums/sequence  ->  sequence
    POST    /forums/map       ->  map

__NOTE:__ The extra routes are added after the standard ones, which may lead to clashes when collection routes use the `GET` verb. For instance, after adding the collections above, the request `GET /forums/sequence` would still resolve to the `show` action, with `sequence` being treated as the `id`. To avoid such clashes, you can use the _id_ option with a regex to apply restrictions to the form of `id`. Regex metacharacters must be escaped. For instance,

    exports.id = 'id\(\\d\+\)';

will ensure that `id`s consist entirely of digits, so `/forums/sequence` will invoke the `sequence` action, while `/forums/5` calls `display`, as usual.

If you find you are adding many extra routes to a resource, you should suspect that something is wrong with your analysis of resources.

__NOTE:__ this functionality will surely grow with time, and as data store clients evolve we can provide close integration.

## Running Tests

First make sure you have the submodules:

    $ git submodule update --init

Then run the tests:

    $ make test

## License

    The MIT License

    Copyright (c) 2010-2011 TJ Holowaychuk <tj@vision-media.ca>
    Copyright (c) 2011 Daniel Gasienica <daniel@gasienica.ch>

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    'Software'), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
