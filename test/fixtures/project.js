
exports.index = function(req, res){
  res.send('user ' + req.params.user_id + ', project index');
};

exports.new = function(req, res){
  res.send('user ' + req.params.user_id + ', new project');
};

exports.create = function(req, res){
  res.send('user ' + req.params.user_id + ', create project');
};

exports.show = function(req, res){
  res.send('user ' + req.params.user_id + ', show project ' + req.params.id);
};

exports.edit = function(req, res){
  res.send('user ' + req.params.user_id + ', edit project ' + req.params.id);
};

exports.update = function(req, res){
  res.send('user ' + req.params.user_id + ', update project ' + req.params.id);
};

exports.destroy = function(req, res){
  res.send('user ' + req.params.user_id + ', destroy project ' + req.params.id);
};
