
var pets = ['tobi', 'jane', 'loki'];

exports.index = {
  json: function(){
    res.send(pets);
  },

  xml: function(){
    res.send('<pets>' + pets.map(function(pet){
      return '<pet>' + pet + '</pet>';
    }).join('') + '</pets>');
  },

  default: function(){
    res.send(415);
  }
};

exports.load = function(id, fn){
  fn(null, pets[id]);
};