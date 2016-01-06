var express = require('express');
var pg = require('pg');
var router = express.Router();
var connectionString = 'postgres://localhost/vehicles';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:tab/:id', function(req, res){
  runQuery('SELECT * FROM ' + req.params.tab + ' WHERE id= \'' + req.params.id + '\'', function(results) {
     res.render('show', { data: results.rows });
   });
});

router.get('/:tab', function(req, res){
  runQuery('SELECT * FROM ' + req.params.tab, function(results) {
     res.render('show', { data: results.rows });
   });
});

module.exports = router;

function runQuery (query, callback) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) { done() ; console.log(err); return; }
    client.query(query, function (err, results) {
      done();
      if (err) { console.log(err); return; }
      callback(results);
    });
   });
}
