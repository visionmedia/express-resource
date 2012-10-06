
module.exports = function(done) {
  var pending = 0;
  var finished = false;
  return function(){
    ++pending;
    return function(err){
      if (finished) return;
      if (err) return finished = true, done(err);
      --pending || done();
    }
  }
};