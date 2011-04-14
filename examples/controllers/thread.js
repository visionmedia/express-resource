
exports.index = function(req, res){
  res.send('forum ' + req.forum.title + ' threads');
};

exports.new = function(req, res){
  res.send('new forum ' + req.forum.title + ' thread');
};

exports.create = function(req, res){
  res.send('forum ' + req.forum.title + ' thread created');
};

exports.show = function(req, res){
  res.send('forum ' + req.forum.title + ' thread ' + req.thread.title);
};

exports.edit = function(req, res){
  res.send('editing forum ' + req.forum.title + ' thread ' + req.thread.title);
};

exports.load = function(id, fn){
  process.nextTick(function(){
    fn(null, { title: 'How do you take care of ferrets?' });
  });
};
