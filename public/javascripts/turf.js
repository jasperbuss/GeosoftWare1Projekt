

//global variables
var lots = [];


function calcDistance(targetPoint, points){

  var distance  = turf.distance(p1, p2, 'km');

  return distance;

}


//
function calcNearest(){

  vsz = new L.LatLng(markerlat, marlkerlng); //visitor, start, ziel

  var tiniestDist = NUMBER.MAX_SAFE_INTEGER;

  for (var i = 0; i<lots.length; i++){
  if
  (calcDistance([vzs.lat,vzs.lng], [lots[i].lat, lots[i].lng]) < tiniestDist){


    tiniestDist = calcDistance([vzs.lat,vzs.lng],[lots[i].lat,lots[i].lng]);

    nearestLot = lots[i];

    console.log("Nearest lot at " + [nearestLot.lat, nearestLot.lon]);
      }

    }

}
