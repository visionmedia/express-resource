
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

  it('should support format methods', function(done){
    var app = express();
    var next = batch(done);
    app.set('json spaces', 0);
    app.resource('pets', require('./fixtures/pets.format-methods'));
  
    request(app)
    .get('/pets.xml')
    .expect('<pets><pet>tobi</pet><pet>jane</pet><pet>loki</pet></pets>', next());
  
    request(app)
    .get('/pets.json')
    .expect('["tobi","jane","loki"]', next());
      
    request(app)
    .get('/pets')
    .expect('["tobi","jane","loki"]', next());
  })
})

describe('app.VERB()', function(){
  it('should map additional routes', function(done){
    var app = express();

    app.set('json spaces', 0);
    app.use(express.bodyParser());

    var pets = app.resource('pets');
    var toys = app.resource('toys');
    var values = ['balls', 'platforms', 'tunnels'];

    toys.get('/types', function(req, res){
      res.send(values);
    });

    request(app)
    .get('/toys/types')
    .expect('["balls","platforms","tunnels"]', done);
  })

  it('should map format objects', function(done){
    var app = express();
    var next = batch(done);

    app.set('json spaces', 0);
    app.use(express.bodyParser());

    var toys = app.resource('toys');
    var values = ['balls', 'platforms', 'tunnels'];

    toys.get('/types', {
      json: function(req, res){
        res.send(values);
      },

      'text/plain': function(req, res){
        res.send(values.join('\n'));
      },

      xml: function(req, res){
        res.send('<toys></toys>');
      }
    });

    request(app)
    .get('/toys/types')
    .expect('["balls","platforms","tunnels"]', next());

    request(app)
    .get('/toys/types')
    .set('Accept', 'text/*')
    .expect('balls\nplatforms\ntunnels', next());

    request(app)
    .get('/toys/types.xml')
    .expect('<toys></toys>', next());
  })
})

describe('Resource#add(resource)', function(){
  it('should support nested resources', function(done){
    var app = express();
    app.set('json spaces', 0);

    var users = app.resource('users');
    var pets = app.resource('pets', require('./fixtures/pets'));
    users.add(pets);

    request(app)
    .get('/users/1/pets.json')
    .expect('["tobi","jane","loki"]', done);
  })
})