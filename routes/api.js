var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/aufgabe7');

/* POST Geojson to be saved to database. */
router.post('/save/name/', function(req, res, next) {

    // Set collection
    var jsoncollection = db.get('jsoncollection');

    // Submit to the DB
    jsoncollection.insert({
        "name" : req.body.name,
        "Kapazität" : req.body.Kapazität,
        "Preis" : req.body.Preis
    }, function (err, doc) {
        if (err) {
          res.status(500).end("Failed to write Parkplatz to Database");
        }
        else {
          res.status(200).end("Successfully written Parkplatz to Database.");
        }
    });
});

/* GET stored Geometry */
router.get('/load/name/:name/', function(req, res, next) {

  // Set Collection
  var collection = db.get('jsoncollection');

  // Retrieve Entries with matching Name from Database. Compelete Entry is returned on match.
  collection.find({name: { $eq: req.params.name }},{},function(e,geometry){
    // Check for connection/syntax errors
    if(e){
      res.status(500).end("Failed to retrieve results from Database.");
    }else{
      // Check if there is an Entry - else fail
      if(name.length != 0){
        // Entry is returned
        res.send(name);
      } else {
        // No entry was found
        res.status(404).end("No such Object in the Database.");
      }
    };
  });
});

/* POST Geojson to be saved to database. */
router.post('/save/route/', function(req, res, next) {

    // Set collection
    var jsoncollection = db.get('jsoncollection');

    // Submit to the DB
    jsoncollection.insert({
        "routename" : req.body.nameroute,
        "route" : req.body.route
    }, function (err, doc) {
        if (err) {
          res.status(500).end("Failed to write Route to Database");
        }
        else {
          res.status(200).end("Successfully written Route to Database.");
        }
    });
});

/* GET stored Route */
router.get('/load/route/:name/', function(req, res, next) {

  // Set Collection
  var collection = db.get('jsoncollection');

    // Retrieve Entries with matching Name from Database. Compelete Entry is returned on match.
    collection.find({routename: { $eq: req.params.name }},{},function(e,route){
    // Check for connection/syntax errors
    if(e){
      res.status(500).end("Failed to retrieve results from Database.");
    }else{
      // Check if there is an Entry - else fail
      if(route.length != 0){
        // Entry is returned
        res.send(route);
      } else {
        // No entry was found
        res.status(404).end("No such Object in the Database.");
      }
    };
  });
});
router.post('/save/etappe/', function(req, res, next) {

    // Set collection
    var jsoncollection = db.get('jsoncollection');

    // Submit to the DB
    jsoncollection.insert({
        "Etappenname" : req.body.nameroute,
        "start" : req.body.start,
        "ziel" : req.body.ziel,
        "Termine": {
          "Anfangsdatum" : req.body.Anfangsdatum,
          "Enddatum" : req.body.Enddatum
        }
    }, function (err, doc) {
        if (err) {
          res.status(500).end("Failed to write Etappa to Database");
        }
        else {
          res.status(200).end("Successfully written Etappe to Database.");
        }
    });
});

/* GET stored Route */
router.get('/load/etappe/:name/', function(req, res, next) {

  // Set Collection
  var collection = db.get('jsoncollection');

    // Retrieve Entries with matching Name from Database. Compelete Entry is returned on match.
    collection.find({routename: { $eq: req.params.name }},{},function(e,route){
    // Check for connection/syntax errors
    if(e){
      res.status(500).end("Failed to retrieve results from Database.");
    }else{
      // Check if there is an Entry - else fail
      if(etappe.length != 0){
        // Entry is returned
        res.send(route);
      } else {
        // No entry was found
        res.status(404).end("No such Object in the Database.");
      }
    };
  });
});




module.exports = router;
