
exports.index = function(req, res){
  res.send('thread index of forum ' + req.params.forum);
};

exports.new = function(req, res){
  res.send('new thread');
};

exports.create = function(req, res){
  res.send('create thread');
};

exports.show = function(req, res){
  res.send('show thread ' + req.params.thread + ' of forum ' + req.params.forum);
};

exports.edit = function(req, res){
  res.send('edit thread ' + req.params.thread + ' of forum ' + req.params.forum);
};

exports.update = function(req, res){
  res.send('update thread ' + req.params.thread + ' of forum ' + req.params.forum);
};

exports.destroy = function(req, res){
  res.send('destroy thread ' + req.params.thread + ' of forum ' + req.params.forum);
};

exports.Thread = { get: function(id, fn){
  process.nextTick(function(){
    fn(null, { title: 'Tobi rules' });
  });
}};
