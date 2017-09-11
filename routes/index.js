var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

/* GET Karte page. */
router.get('/karte/', function(req, res, next) {
  res.render('karte', {});
});

/* GET Karte page. */
router.get('/karte/:id/', function(req, res, next) {
  res.render('karte', {loadRouteName: req.params.id});
});

/* GET Impressum page. */
router.get('/impressum', function(req, res, next) {
  res.render('impressum', {});
});

router.get('/Parkplaetze/', function(req, res, next) {
  res.render('Parkplaetze', {});
});

router.get('/Parkplaetze/:id/', function(req, res, next) {
  res.render('Parkplaetze', {loadRouteName: req.params.id});
});


module.exports = router;
