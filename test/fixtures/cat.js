
exports.index = function(req, res){
  res.send('list of cats');
};

exports.new = function(req, res){
  res.send('new cat');
};