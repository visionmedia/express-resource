
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
      res.send(406);
  }
};

exports.show = function(req, res){
  switch (req.format) {
    case 'json':
      res.end(JSON.stringify(req.pet));
      break;
    case 'xml':
      res.end('<pet>' + req.pet + '</pet>');
      break;
    default:
      res.send(406);
  }
};

exports.destroy = function(req, res){
  switch (req.format) {
    case 'json':
      res.send({ message: 'pet removed' });
      break;
    case 'xml':
      res.send('<message>pet removed</message>');
      break;
    default:
      res.send(406);
  }
};

exports.load = function(id, fn){
  fn(null, pets[id]);
};