/*var express = require('express')
  , app = module.exports.app = exports.app = express();

app.get('/', function(req, res){
  res.send('service is up!');
});

app.listen(process.env.port);
*/
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tareas Coltoys' });
});

module.exports = router;
