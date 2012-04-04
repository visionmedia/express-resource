

function middleware(req, res, next) {
  req.role = 'thread owner';
  next();
}

exports.index = function(req, res){
  res.send('thread index of forum ' + req.params.forum);
};

exports.new = function(req, res){
  res.send('new thread');
};

exports.create = function(req, res){
  res.send('create thread');
};

exports.show = [
  middleware,
  function(req, res){
    if (req.format === 'json') {
      res.send(JSON.stringify({
        thread: req.params.thread,
        forum: req.params.forum,
        user: req.user,           // Should not be populated because middleware should only run for the final route
        role: req.role
      }));
    }
    else {
      res.send('show thread ' + req.params.thread + ' of forum ' + req.params.forum + ' for ' + req.user + ', ' + req.role);
    }
  }
];

exports.edit = function(req, res){
  res.send('edit thread ' + req.params.thread + ' of forum ' + req.params.forum);
};

exports.update = function(req, res){
  res.send('update thread ' + req.params.thread + ' of forum ' + req.params.forum);
};

exports.destroy = function(req, res){
  res.send('destroy thread ' + req.params.thread + ' of forum ' + req.params.forum);
};

exports.load = function(id, fn){
  process.nextTick(function(){
    fn(null, { title: 'Tobi rules' });
  });
};
