
exports.index = function(req, res){
  res.send('list of cats');
};

exports.new = function(req, res){
  res.send('new cat');
};

exports.filter = function(req, res, next) {
  req.usertype = 'cat owner';
  next();
};

exports.edit = [
  exports.filter,
  function(req, res, next) {
    res.send('usertype: ' + req.usertype);
  }];