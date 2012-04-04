
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
  function(req, res) {
    res.send('usertype: ' + req.usertype);
  }
];

exports.show = [
  exports.filter,
  function(req, res) {
    if ('json' === req.format) {
      res.send(JSON.stringify({usertype: req.usertype}));
    }
    else {
      res.send('usertype: ' + req.usertype);
    }
  }
];