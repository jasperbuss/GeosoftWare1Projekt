/**
 * Abschlussaufgabe, Geosoftware 1
 * @author Jasper Buß, 430423
 */

'use strict';

// global variables for Leaflet stuff, very handy
var map, contObj, inputRoute, oblat, oblon,  city, routes, popupMarker, marker, waypoints, cacheSave, layercontrol, editableLayers,routeLayer, vLayers, drawControl, routeControl, routeSwitch, currentRoute;

/**
 * initialises map (add basemaps, show Münster, setup draw plugin, show GEO1 marker)
 */
function initMap(){

var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
osmAttrib = '&copy; ' + osmLink + ' Contributors';
var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>',
thunLink = '<a href="http://thunderforest.com/">Thunderforest</a>';
routeSwitch = true;
var osmMap = L.tileLayer(osmUrl, {attribution: osmAttrib});
routeLayer = new L.featureGroup();
map = L.map('map', {
         layers: [osmMap], // only add one!
         zoomControl: false
       })
       .setView([43.836944, 4.36], 14);

L.control.zoom({
         position: 'bottomleft'
       }).addTo(map);

var baselayers = {
"OSM Mapnik": osmMap
};
// add standard OSM tiles as basemap
/*layercontrol.addBaseLayer(L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map), 'OpenStreetMap (Tiles)');  // set as default
*/

  /* var router = L.routing.osrmv1();
    var wps = [];
//Adds routes as layers
map.on('click', function(e) {
      wps.push(new L.Routing.Waypoint(e.latlng));
      if (wps.length % 2 === 0) {
        router.route(wps.slice(wps.length - 2, wps.length), function(err, routes) {
          if (err) {
            return console.error(err);
          }
          currentRoute = L.routing.line(routes[0]).addTo(routeLayer).addTo(map);
        });
      }
    });
  var overlays = {
    "Etappen": routeLayer
  }
L.control.layers(baselayers, overlays).addTo(map);
*/


// add controls to map


// Setup Routing Plugin
routeControl = L.Routing.control({
  serviceUrl: "http://10.67.60.199:500/route/v1",
  waypoints: [
      null
  ],
  routeWhileDragging: true,
  show:false,
  createMarker: function() { return null; },
    position: 'topleft',
    lineOptions: {
      styles:[{color: 'blue', opacity: 0.15, weight: 9},
      {color: 'white', opacity: 0.8, weight: 6},
      {color: 'blue', opacity: 1, weight: 2}]

   },
  geocoder: L.Control.Geocoder.nominatim()
});
routeControl.addTo(map);



popupMarker = new L.FeatureGroup();
map.addLayer(popupMarker);

  // layer to draw on
vLayers = new L.FeatureGroup();
map.addLayer(vLayers);

  // add controls to map
  routeControl.on('routeselected', function(e) {
      currentRoute = {};
      currentRoute.waypoints = routeControl.getWaypoints();
      currentRoute.route = e.route;

  });

  // setup Leaflet.draw plugin
  // layer to draw on
  editableLayers = new L.FeatureGroup();
 // map.addLayer(editableLayers);
  // Leaflet.draw options
  var options = {
      position: 'bottomright',
      edit: {
          featureGroup: editableLayers, //REQUIRED!!
          remove: false
      }
  };
  // setup Leaflet.draw plugin
  // layer to draw on
  vLayers = new L.FeatureGroup();
  map.addLayer(vLayers);

  // add controls to map
  drawControl = new L.Control.Draw(options);

  map.addControl(drawControl);

  map.on('click', function(e) {
       if (routeSwitch){
           var container = L.DomUtil.create('div'),
               startBtn = createButton('From here..', container),
               destBtn = createButton('..to here', container);
           console.log(e.latlng);
           L.popup()
               .setContent(container)
               .setLatLng(e.latlng)
               .openOn(map);
           L.DomEvent.on(startBtn, 'click', function() {
               routeControl.spliceWaypoints(0, 1, e.latlng);
               cacheSave = e.latlng;
               map.closePopup();

           });
           L.DomEvent.on(destBtn, 'click', function() {

               var EtaContent = '<form  id="saveEtappe" action="/api/save/etappe/" method="POST">'+
                   '<div class="form-group">'+
                   '<label class="control-label col-sm-5"><strong>Etappenname: </strong></label>'+
                   '<input type="text" placeholder="Required" id="etappenname" name="etappenname" class="form-control"/>'+
                   '</div>'+
                   '<div class="form-group">'+
                   '<label id="starttermin" class="control-label col-sm-2"><strong>Startdate: </strong></label>'+
                   '<input type="date"  class="form-control" id="start" name="start">'+'<label id="starting place" class="control-label col-sm-2"><strong>Starting place: </strong></label>'+
                   '<input type="text"  class="form-control" id="startort" name="startort">'+
                   '</div>'+
                   '<div class="form-group">'+
                   '<label id="endtermin" class="control-label col-sm-5"><strong>Ende </strong></label>'+
                   '<input type="date"  class="form-control" id="end" name="end">'+'<label id="zielort" class="control-label col-sm-2"><strong>Zielort: </strong></label>'+
                   '<input type="text"  class="form-control" id="zielort" name="zielort">'+
                   '</div>'+
                   '<div style="text-align:center;" class="col-xs-4"><button type="submit" value="speichern" class="btn btn-primary trigger-submit">Etappe speichern</button></div>'+              '</div>'+
                   '</form>';


             var parkIcon = L.icon({iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVo-nL02NW3L5cKDNOwROaiaKiB3_tPmkHZMQumlqDF6f2xbbE',
                                     iconSize: [30, 21]

                                    });




               routeControl.spliceWaypoints(routeControl.getWaypoints().length - 1, 1, e.latlng);
               var waypoints =  routeControl.getWaypoints();
               map.closePopup();

               var kooSta = new L.LatLng(waypoints[0].latLng.lat,waypoints[0].latLng.lng);
               var kooEnd = new L.LatLng(waypoints[1].latLng.lat,waypoints[1].latLng.lng);
               var popsta = L.marker(kooSta, {icon: parkIcon}).addTo(vLayers);
               var popend = L.marker(kooEnd, {icon: parkIcon}).addTo(vLayers);
               popsta.bindPopup(EtaContent).openPopup().addTo(map);

               $('#saveEtappe').submit(function(e) {
                 e.preventDefault();
                 if (true){
                   // Append hidden field with actual GeoJSON structure
                   var inputRoute = $("<input type='hidden' name='route' value='" + JSON.stringify(currentRoute) + "'>");
                   $(this).append(inputRoute);
                   var that = this;

                   // submit via ajax
                   $.ajax({
                     data: $(that).serialize(),
                     type: $(that).attr('method'),
                     url:  $(that).attr('action'),
                     error: function(xhr, status, err) {
                       console.log("Error while saving Etappe to Database");
                     },
                     success: function(res) {
                       console.log("Etappe with the name '" + that.elements.etappenname.value + "' saved to Database.");
                     }
                   });
                   inputRoute.remove();
                   map.closePopup();

                   var etContent='<div class="form-group">' +'<label class="control-label col-sm-12 "><strong>Etappenname: </strong></label>' +
                            '<label>'+ that.elements.name.value + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong>Start: </strong></label>'
                            + '<label>'+ that.elements.start.value +'</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Ende: </strong></label>'
                            + '<label>'+ that.elements.end.value + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Website: </strong></label>'
                            + '<label>'+ that.elements.website.value +'</label>' + '</div>'+'</div>'+ '<div style="text-align:center;" class="col-xs-4"><button id="nextlot" type="submit" value="nextlot" onclick="nextlot()" class="btn btn-success trigger-submit">Nächster Parkplatz </button></div>';
                            popsta.bindPopup(etContent);
                            popend.bindPopup(etContent)

                            return false;

                        }

                    });

                });

            }


        });

  /** When an object ( e.g. marker ) is moved onto the map this event will trigger
   *  Popup with our own content will show up and the user can fill in the information
   *  that wants to be stored
   */
  map.on(L.Draw.Event.CREATED, function (e) {

    var popupContent = '<form class="saveObject" id="saveObject" action="/api/save/object/" method="POST">'+
          '<div class="form-group">'+
          '<label class="control-label col-sm-5"><strong>Name: </strong></label>'+
          '<input type="text" placeholder="Required" id="name" name="name" class="form-control"/>'+
          '</div>'+
          '<div class="form-group">'+
          '<label class="control-label col-sm-5"><strong>Art: </strong></label>'+
          '<select class="form-control" id="art" name="type">'+
          '<option value="Parklot">Parking Lot</option>'+
          '<option value="Visitors">Visitors Place</option>'+
          '</select>'+
          '</div>'+
          '<div class="form-group">'+
          '<label class="control-label col-sm-5"><strong>Capacity: </strong></label>'+
          '<input  min="0" class="form-control" id="cap" name="cap">'+
          '</div>'+
          //...
          '<div class="form-group">'+
          '<label class="control-label col-sm-5"><strong>Description: </strong></label>'+
          '<textarea class="form-control" rows="6" id="info" name="info">...</textarea>'+
          '</div>'+
          '<div class="form-group">'+
          '<div style="text-align:center;" class="col-xs-4"><button type="submit" value="speichern" class="btn btn-success trigger-submit">Marker speichern</button></div>'+              '</div>'+
          '</form>';

      var parkIcon = L.icon({iconUrl: 'https://d30y9cdsu7xlg0.cloudfront.net/png/80726-200.png',
                            iconSize: [30, 21]});
      var type = e.layerType,
          layer = e.layer;
      var popup = L.popup({Width:1000
                    })
                    .setContent(popupContent)
                    .setLatLng(layer.getLatLng());

      //add the marker to a layer
      editableLayers.addLayer(layer);
      marker = new L.marker(layer.getLatLng(), {icon: parkIcon}).addTo(map).bindPopup(popup).openPopup();
      marker.on('popupclose', function (e) {
                  marker.remove();
              });

              $('#saveObject').submit(function(e) {

                e.preventDefault();

                if (true){
                  // Append hidden field with actual GeoJSON structure
                  var inputGeo = $("<input type='hidden' name='route' value='" + JSON.stringify(currentRoute) + "'>");
                  $(this).append(inputGeo);
                  var that = this;

                  // submit via ajax
                  $.ajax({
                    data: $(that).serialize(),
                    type: $(that).attr('method'),
                    url:  $(that).attr('action'),
                    error: function(xhr, status, err) {
                      console.log("Error while saving Etappe to Database");
                    },
                    success: function(res) {
                      console.log("Object with the name '" + that.elements.parkname.value + " saved to Database.");
                    }
                  });
                  inputGeo.remove();
                  map.closePopup();

                  oblat = oblat.getLatLng().lat;
                  oblon = oblon.getLatLng().lng;


                  if(that.element.type.value == "Parklot")  {
                    contObj = '<div class="form-group">' + '<label class="control-label col-sm-12 "><strong>Name: </strong></label>' +
                    '<label>' + marker.getLatLng() + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Art:</strong></label>'
                    + '<label>' + that.elements.type.value + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Kapazität:</strong></label>'
                    + '<label>' + that.elements.cap.value + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Weitere Informationen:</strong></label>'
                    + '<label>' + that.elements.info.value + '</label>' + '</div>'

                     lots.push(new L.LatLng(oblat,oblng));
                    }
                    else{
                      contObj = '<div class="form-group">' + '<label class="control-label col-sm-12 "><strong>Name: </strong></label>' +
                    '<label>' + marker.getLatLng() + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Art:</strong></label>'
                    + '<label>' + that.elements.type.value + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Kapazität:</strong></label>'
                    + '<label>' + that.elements.cap.value + '</label>' + '</div>' + '<div class="form-group">' + '<label class="control-label col-sm-12"><strong> Weitere Informationen:</strong></label>'
                    + '<label>' + that.elements.info.value + '</label>' + '</div>' + '<div style="text-align:center;" class="col-xs-4"><button id="nextlot" type="submit" value="nextlot" onclick="nextlot()" class="btn btn-success trigger-submit">Find nearest Parking Lot </button></div>'


                    }

                    var upPop = marker.bindPopup(contObj);

                  return false;
                }
              });
           });

}

// Overwrite HTML Form handlers once document is created.
$(document).ready(function() {

  $('#loadEtappe').submit(function(e) {
    // Prevent default html form handling
    e.preventDefault();
    var that = this;

    // submit via ajax
    $.ajax({
      // catch custom response code.
      statusCode: {
        404: function() {
        alert("Etappe with the name '" + that.elements.etappenname.value + "' is not present in the Database.");
        }
      },
      data: '',
      type: $(that).attr('method'),
      // Dynamically create Request URL by appending requested name to /api prefix
      url:  $(that).attr('action') + that.elements.etappenname.value,
      error: function(xhr, status, err) {
      },
      success: function(res) {

        var route = JSON.parse(res[0].route);
        city = res[0].name;
        getwiki();

        routeControl.setWaypoints(route.waypoints).addTo(map);
        console.log("Route '" + that.elements.etappenname.value + "' successfully loaded.");
      }
    });

    return false;
  });
  if ((document.getElementById('etname')).value != ""){
    document.getElementById('butnid').click();
  }



$('#loadParkplatz').submit(function(e) {
  // Prevent default html form handling
  e.preventDefault();
  var that = this;

  // submit via ajax
  $.ajax({
    // catch custom response code.
    statusCode: {
      404: function() {
      alert("Etappe with the name '" + that.elements.parkname.value + "' is not present in the Database.");
      }
    },
    data: '',
    type: $(that).attr('method'),
    // Dynamically create Request URL by appending requested name to /api prefix
    url:  $(that).attr('action') + that.elements.parkname.value,
    error: function(xhr, status, err) {
    },
    success: function(res) {
      var route = JSON.parse(res[0].route);
      routeControl.setWaypoints(route.waypoints).addTo(map);
      console.log("Parkplatz " + that.elements.parkname.value + "' successfully loaded.");
    }
  });
  return false;
});
if ((document.getElementById('loadname')).value != ""){
  document.getElementById('btnid').click();
}

});

function getwiki(){
  $.ajax({
    type: "GET",
    url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page= "+city+"&callback=?",
    contentType: "application/json; charset=utf-8",
    async: false,
    dataType: "json",
    success: function (data, textStatus, jqXHR) {

        var markup = data.parse.text["*"];
        var blurb = $('<div></div>').html(markup);

        // remove links as they will not work
        blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });

        // remove any references
        blurb.find('sup').remove();

        // remove cite error
        blurb.find('.mw-ext-cite-error').remove();
        $('#article').html($(blurb).find('p'));

    },
    error: function (errorMessage) {
    }
});

}


L.DrawToolbar.include({
    getModeHandlers: function(map) {
        return [
            {
                enabled: true,
                handler: new L.Draw.Marker(map),
                title: 'Objekt erstellen'
            }

        ];
    }
});




/**
 * get user's location via geolocation web api and display it on the map
 */
function showLocation() {

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      // marker of current position
      L.marker([position.coords.latitude, position.coords.longitude], {title: 'Ihre Position'}).bindPopup('Ihre Position').addTo(map);
      // accuracy radius (95% confidence)
      L.circle([position.coords.latitude, position.coords.longitude], position.coords.accuracy, {fill: 'lightblue', color: 'blue'}).addTo(map);
    });
  } else {
      alert("Ihr Gerät oder Browser unterstützt die Standortbestimmung leider nicht :(");
  }
}

/**
 * load external GeoJSON file via Ajax (Caution! Server to load from has to allow cross origin requests!)
 */
function showExternalFile() {
  $.get(document.getElementById('externalfile').value, function(response) {
    L.geoJSON(JSON.parse(response)).addTo(map);
  });
}


/*$(document).ready(function() {

}*/
/**
 * provide the objects drawn using the Leaflet.draw plugin as a GeoJSON to download
 */
/*function exportDrawing() {
  // fake a link
  var anchor = document.createElement('a');
  // encode geojson as the link's contents
  anchor.href = 'data:application/vnd.geo+json,' + encodeURIComponent(JSON.stringify(editableLayers.toGeoJSON()));
  anchor.target = '_blank';
  // give it a nice file name
  anchor.download = "your-drawing.geojson";
  // add to document (Firefox needs that)
  document.body.appendChild(anchor);
  // fake a click on the link -> file will be offered for download
  anchor.click();
  // remove that element again as if nothing happened
  document.body.removeChild(anchor);
}
*/
/**
 * add resizing capability (curtesy of several StackExchange users)
 */
function initUI() {
  var resize= $("#content");
  var containerWidth = $("body").width();

  $(resize).resizable({
    handles: 'e',
    /*maxWidth: 450,
    minWidth: 120,*/
   classes: { "ui-resizable-handle": "hidden-xs hidden-sm" },
    resize: function(event, ui){
      var currentWidth = ui.size.width;

      // this accounts for padding in the panels +
      // borders, you could calculate this using jQuery
      var padding = 12;

      // this accounts for some lag in the ui.size value, if you take this away
      // you'll get some instable behaviour
      $(this).width(containerWidth - currentWidth - padding);

      // set the content panel width
      $("#content").width(currentWidth);
    }
  });
}

// Overwrite HTML Form handlers once document is created.
/*$(document).ready(function() {



  if ((document.getElementById('etappenname')).value != ""){
    document.getElementById('butId').click();

  }

});
*/

// Credit to https://github.com/perliedman/leaflet-routing-machine/blob/344ff09c8bb94d4e42fa583286d95396d8227c65/src/L.Routing.js
function RouteToGeoJSON(route){
		var wpNames = [],
			wpCoordinates = [],
			i,
			wp,
			latLng;

		for (i = 0; i < route.waypoints.length; i++) {
			wp = route.waypoints[i];
			latLng = L.latLng(wp.latLng);
			wpNames.push(wp.name);
			wpCoordinates.push([latLng.lng, latLng.lat]);
		}
		return {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: {
						id: 'waypoints',
						names: wpNames
					},
					geometry: {
						type: 'MultiPoint',
						coordinates: wpCoordinates
					}
				},
				{
					type: 'Feature',
					properties: {
						id: 'line',
					},
					geometry: routeToLineString(route)
				}
			]
		};
}

// Credits to https://github.com/perliedman/leaflet-routing-machine/blob/344ff09c8bb94d4e42fa583286d95396d8227c65/src/L.Routing.js
function routeToLineString(route) {
  var lineCoordinates = [],
			i,
			latLng;

		for (i = 0; i < route.coordinates.length; i++) {
			latLng = L.latLng(route.coordinates[i]);
			lineCoordinates.push([latLng.lng, latLng.lat]);
		}

		return {
			type: 'LineString',
			coordinates: lineCoordinates
		};
}

//remove popups
function clearPopup(){
  popupMarker.clearLayers(popupMarker);
  }

  function readGeoJSONFromTA() {
      return JSON.parse($('textarea#geojson-area')[0].value);
  }

  /**
   *@desc add and load the read GeoJSON on the map
   */
  function loadGeoJSON() {
      var feat = readGeoJSONFromTA();
      console.dir(feat);
      var gLayer = L.geoJson(feat);
      console.dir(gLayer);
      gLayer.addTo(vLayers);

  }


/**
 * @desc main function;
 *      reads txt input into a string (filecontent) and extracts the coordinates
 * @see Learnweb
 * @param event OpenFile event
 */
var ReadFile = function(event) {

    var input = event.target;
    var reader = new FileReader();
    const output = [];
    var array;

// Empty List after new fileupload to avoid very long lists without refresh
    reader.onload = function () {
        var fileContent = reader.result;
        //Call Geojson build function
        var gLayer = L.geoJson(JSON.parse(fileContent));
        console.dir(gLayer);
        gLayer.addTo(vLayers);
        //logs whether the whole script runs
    };


    reader.readAsText(input.files[0]);
};
// Code taken from http://www.liedman.net/leaflet-routing-machine/tutorials/interaction/
function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}


document.addEventListener("DOMContentLoaded", function(event) {
  initMap();
  initUI();
});
