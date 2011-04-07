
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
  res.send('show forum ' + req.params.forum_id);
};

exports.edit = function(req, res){
  res.send('edit forum ' + req.params.forum_id);
};

exports.update = function(req, res){
  res.send('update forum ' + req.params.forum_id);
};

exports.destroy = function(req, res){
  res.send('destroy forum ' + req.params.forum_id);
};
