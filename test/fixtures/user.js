
exports.User = { get: function(id, fn){
  process.nextTick(function(){
    fn(null, { name: 'tj' });
  });
}};
