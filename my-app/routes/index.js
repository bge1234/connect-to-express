var express = require('express');
var pg = require('pg');
var router = express.Router();
var connectionString = 'postgres://localhost/vehicles';

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/cars/new', function(req, res){
  runQuery('SELECT * from cars ORDER BY id ASC', function(results) {
      res.render('new', { data: results.rows });
   });
});

router.get('/cars/:id', function(req, res){
  runQuery('SELECT * FROM cars WHERE id= \'' + req.params.id + '\'', function(results) {
      res.render('show', { data: results.rows });
   });
});

router.get('/cars', function(req, res){
  runQuery('SELECT * from cars ORDER BY id ASC', function(results) {
      res.render('show', { data: results.rows });
   });
});

router.get('/cars/:id/update', function(req, res){
  console.log(req.params.id);
  runQuery('SELECT * from cars ORDER BY id ASC', function(results) {
      res.render('edit', { data: results.rows[req.params.id - 2] });
   });
});

router.get('/cars/:id/delete', function(req, res){
  runQuery('DELETE from cars WHERE id = \'' + req.params.id + '\'', function(results) {
      res.redirect('/cars');
   });
});

router.post("/cars", function(req, res, next) {
  if(req.body.id === undefined) {
    console.log('INSERT into cars values(default, \'' + req.body.make + '\', \'' + req.body.model + '\', \'' + req.body.year + '\', \'' + req.body.description + '\')');
    runQuery('INSERT into cars values(default, \'' + req.body.make + '\', \'' + req.body.model + '\', \'' + req.body.year + '\', \'' + req.body.description + '\')', function(results) {
        res.redirect("../cars")
     });
  }
  else {
    runQuery('UPDATE cars SET make = \'' + req.body.make + '\', model = \'' + req.body.model + '\', year = \'' + req.body.year + '\', description = \'' + req.body.description + '\' WHERE id= \'' + req.body.id + '\'', function(results) {
        res.redirect("../cars")
     });
   }
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
