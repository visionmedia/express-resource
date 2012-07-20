
var assert = require('assert')
  , express = require('express')
  , request = require('supertest')
  , batch = require('./support/batch')
  , Resource = require('..');

describe('app.resource()', function(){
  it('should support content-negotiation via extension', function(done){
    var app = express();
    var next = batch(done);

    app.set('json spaces', 0);
    app.resource('pets', require('./fixtures/pets'));

    request(app)
    .get('/pets.html')
    .expect(406, next());

    request(app)
    .get('/pets.json')
    .expect('["tobi","jane","loki"]', next());

    request(app)
    .get('/pets.xml')
    .expect('<pets><pet>tobi</pet><pet>jane</pet><pet>loki</pet></pets>', next());

    request(app)
    .get('/pets/1.json')
    .expect('"jane"', next());

    request(app)
    .get('/pets/0.xml')
    .expect('<pet>tobi</pet>', next());

    request(app)
    .del('/pets/0.xml')
    .expect('<message>pet removed</message>', next());

    request(app)
    .del('/pets/0.json')
    .expect('{"message":"pet removed"}', next());
  })

  it('should support content-negotiation via method', function(done){
    var app = express();
    var next = batch(done);
    app.set('json spaces', 0);
    app.resource('pets', require('./fixtures/pets.format-methods'));
  
    // request(app)
    // .get('/pets.xml')
    // .expect('<pets><pet>tobi</pet><pet>jane</pet><pet>loki</pet></pets>', next());
  
    request(app)
    .get('/pets.json')
    .expect('["tobi","jane","loki"]', next());
      
    request(app)
    .get('/pets')
    .expect('["tobi","jane","loki"]', next());
  })
})

module.exports = {
  // 'test content-negotiation via extension': function(){
  // },
  // 
  // 'test content-negotiation via format method': function(){

  // },
  // 
  // 'test content-negotiation via format method without default': function(){
  //   var app = express.createServer();
  // 
  //   app.resource('pets', require('./fixtures/pets.format-methods-without-default'));
  // 
  //   assert.response(app,
  //     { url: '/pets.xml' },
  //     { body: '<pets><pet>tobi</pet><pet>jane</pet><pet>loki</pet></pets>'
  //     , headers: { 'Content-Type': 'application/xml' }});
  // 
  //   assert.response(app,
  //     { url: '/pets.json' },
  //     { body: '["tobi","jane","loki"]'
  //     , headers: { 'Content-Type': 'application/json; charset=utf-8' }});
  // 
  //   assert.response(app,
  //     { url: '/pets' },
  //     { body: 'Not Acceptable', status: 406 });
  // },
  // 
  // 'test content-negotiation via map()': function(){
  //   var app = express.createServer();
  // 
  //   app.use(express.bodyParser());
  // 
  //   var pets = app.resource('pets')
  //     , toys = app.resource('toys')
  //     , toysDB = ["balls", "platforms", "tunnels"];
  // 
  //   toys.get('/types', function(req, res){
  //     res.send(toysDB);
  //   });  
  // 
  //   toys.get('/', {
  //     json: function(req, res){
  //       res.send(toysDB);
  //     }
  //   });
  //   
  //   toys.get({
  //     json: function(req, res){
  //       res.send('"' + toysDB[req.params.toy] + '"');
  //     }
  //   });
  // 
  //   pets.add(toys);
  // 
  //   pets.get('/', {
  //     json: function(req, res){
  //       res.send({ name: 'tobi' });
  //     }
  //   });
  // 
  //   assert.response(app,
  //     { url: '/pets/0/toys/types' },
  //     { body: '["balls","platforms","tunnels"]' });
  // 
  //   assert.response(app,
  //     { url: '/pets/0/toys/2.json' },
  //     { body: '"tunnels"' });
  // 
  //   assert.response(app,
  //     { url: '/pets/0/toys.json' },
  //     { body: '["balls","platforms","tunnels"]' });
  //     
  //   assert.response(app,
  //     { url: '/pets.json' },
  //     { body: '{"name":"tobi"}' });
  //     
  //   assert.response(app,
  //     { url: '/pets' },
  //     { status: 406 });
  // },
  // 
  // 'test nested content-negotiation': function(){
  //   var app = express.createServer()
  //     , pets = ['tobi', 'jane', 'loki'];
  // 
  //   var users = app.resource('users');
  //   var pets = app.resource('pets', require('./fixtures/pets'));
  //   users.add(pets);
  // 
  //   assert.response(app,
  //     { url: '/users/1/pets.json' },
  //     { body: '["tobi","jane","loki"]' });
  // }
};