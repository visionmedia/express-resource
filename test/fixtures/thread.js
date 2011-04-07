
exports.index = function(req, res){
  res.send('thread index');
};

exports.new = function(req, res){
  res.send('new thread');
};

exports.create = function(req, res){
  res.send('create thread');
};

exports.show = function(req, res){
  res.send('show thread ' + req.params.id);
};

exports.edit = function(req, res){
  res.send('edit thread ' + req.params.id);
};

exports.update = function(req, res){
  res.send('update thread ' + req.params.id);
};

exports.destroy = function(req, res){
  res.send('destroy thread ' + req.params.id);
};
