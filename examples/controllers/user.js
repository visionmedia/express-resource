
var users = [];

users.push({ name: 'tobi' });
users.push({ name: 'loki' });
users.push({ name: 'jane' });

/**
 * GET index.
 */

exports.index = {
  html: function(req, res){
    res.send('<h1>Users</h1>'
      + users.map(function(user, id){
        return '<a href="/users/' + id + '">' + user.name + '</a>';
      }).join('\n'));
  },

  json: function(req, res){
    res.send(users);
  },

  xml: function(req, res){
    res.send(users.map(function(user){
      return '<user>' + user.name + '</user>'
    }).join(''));
  }
};

/**
 * POST create.
 */

exports.create = function(req, res){
  res.send('created');
};

/**
 * GET show.
 */

exports.show = {
  html: function(req, res){
    res.send('<h1>' + req.user.name + '</h1>');
  },

  json: function(req, res){
    res.send(req.user);
  },

  xml: function(req, res){
    res.send('<user>' + req.user.name + '</user>');
  }
};

/**
 * Auto-load user re-source for actions.
 */

exports.load = function(id, fn){
  var user = users[id];
  if (!user) return fn(new Error('not found'));
  process.nextTick(function(){
    fn(null, user);
  });
}