
var pets = ['tobi', 'jane', 'loki'];

exports.index = {
  json: function(req, res){
    res.send(pets);
  },

  xml: function(req, res){
    res.send('<pets>' + pets.map(function(pet){
      return '<pet>' + pet + '</pet>';
    }).join('') + '</pets>');
  }
};

exports.load = function(id, fn){
  fn(null, pets[id]);
};