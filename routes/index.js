var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});


/* GET Impressum page. */
router.get('/impressum', function(req, res, next) {
  res.render('impressum', {});
});

router.get('/Etappen/', function(req, res, next) {
  res.render('Etappen', {});
});
// for permalink
router.get('/Etappen/:id/', function(req, res, next) {
  res.render('Etappen', {loadEtappe: req.params.id});
});

//router.get('/marker/', function(req, res, next) {
//  res.render('marker', {});
//});
//permalink
router.get('/Etappen/:id/', function(req, res, next) {
  res.render('Etappen', {loadParkplatz: req.params.id});
});



module.exports = router;
