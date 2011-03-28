
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

__NOTE:__ this functionality will surely grow with time, and as data store clients evolve we can provide close integration.

## Running Tests

First make sure you have the submodules:

    $ git submodule update --init

Then run the tests:

    $ make test

## License 

(The MIT License)

Copyright (c) 2010 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

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
