
var pets = ['tobi', 'jane', 'loki'];

exports.index = function(req, res){
  switch (req.format) {
    case 'json':
      res.send(pets);
      break;
    case 'xml':
      res.send('<pets>' + pets.map(function(pet){
        return '<pet>' + pet + '</pet>';
      }).join('') + '</pets>');
      break;
    default:
      res.send(415);
  }
}