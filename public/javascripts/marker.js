/**
 * Geosoftware I, SoSe 2017, Aufgabe
 * @author
 */

'use strict';

// global variables for Leaflet stuff, very handy
var map, marker,  layercontrol, editableLayers, visualizationLayers, drawControl, routeControl, routeSwitch, currentRoute;

/**
 * initialises map (add basemaps, show Münster, setup draw plugin, show GEO1 marker)
 */
function initMap() {
  routeSwitch = true;
  map = L.map('map', {
      center: [43.836944, 4.36], // Nimes
      zoom: 14,
      zoomControl: false
  });
  L.control.zoom({
    position: 'bottomleft'
  }).addTo(map);

  // add layer control to map
  layercontrol = L.control.layers().addTo(map).expand();

  // add standard OSM tiles as basemap
  layercontrol.addBaseLayer(L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map), 'OpenStreetMap (Tiles)');  // set as default

  // add an alternative basemap, fetched via WMS


  // Setup Routing Plugin
/*  routeControl = L.Routing.control({
    waypoints: [
        null
    ],
    routeWhileDragging: true,
    show:false,
    position: 'topleft',
    geocoder: L.Control.Geocoder.nominatim()
  });
  routeControl.addTo(map);


*/


/*L.easyButton('fa-level-up',
    function() {

        var routing = L.Routing.control({
            plan: L.Routing.plan([
                L.latLng(50.07132, 35.14103),
                L.latLng(50.05459, 35.18239)
            ], {
                waypointIcon: function(i) {
                    return new L.Icon.Label.Default({
                        labelText: String.fromCharCode(65 + i)
                    });
                },
                geocoder: L.Control.Geocoder.nominatim()
            }),
            routeWhileDragging: true,
            routeDragTimeout: 250
        });

var rlayer = L.layerGroup([routing]);
map.hasLayer(rlayer) ? map.removeLayer(rlayer) : map.addLayer(rlayer);

},
    'Display Route').addTo(map);
*/


  map.on('click', function(e){
    var markerOnMap = e.latlng;
    var text = '<form class="meineForm" id="saveMarker" action="/api/save/marker/" method="POST">'+
            '<div class="form-group">'+
            '<label class="control-label col-sm-5"><strong>Name: </strong></label>'+
            '<input type="text" placeholder="Name vom Parkplatz" id="name" name="name" class="form-control"/>'+
            '</div>'+
            '<div class="form-group">'+
            '<label class="control-label col-sm-5"><strong>Art: </strong></label>'+
            '<select class="form-control" id="art" name="art">'+
            '<option value="Parkplatz">Parkplatz</option>'+
            '<option value="Zuschauer">Zuschauerplatz</option>'+
            '</select>'+
            '</div>'+
            '<div class="form-group">'+
            '<label class="control-label col-sm-5"><strong>Kapazität: </strong></label>'+
            '<input type="number" min="0" class="form-control" id="cap" name="cap">'+
            '</div>'+
            //...
            '<div class="form-group">'+
            '<label class="control-label col-sm-5"><strong>Description: </strong></label>'+
            '<textarea class="form-control" rows="6" id="info" name="info">...</textarea>'+
            '</div>'+
            '<div class="form-group">'+
            '<div style="text-align:center;" class="col-xs-4"><button type="submit" value="speichern" class="btn btn-primary trigger-submit">Marker speichern</button></div>'+              '</div>'+
            '</form>';
    var parkIcon = L.icon({iconUrl: 'https://d30y9cdsu7xlg0.cloudfront.net/png/80726-200.png',
                      iconSize: [30, 21]

                  });
    marker = new L.marker(markerOnMap, {icon: parkIcon}).addTo(map).bindPopup(text).openPopup();
    marker.on('popupclose', function (e) {
                marker.remove();
            });
    // overwrite submit handler for form used to save to Database

    $('#saveMarker').submit(function(e) {
      e.preventDefault();
      marker.closePopup();
      marker.addTo(map);
      if (currentRoute){
        // Append hidden field with actual GeoJSON structure
        var inputRoute = $("<input type='hidden' name='route' value='" + JSON.stringify(text) + "'>");
        $(this).append(inputRoute);
        var that = this;

        // submit via ajax
        $.ajax({
          data: $(that).serialize(),
          type: $(that).attr('method'),
          url:  $(that).attr('action'),
          error: function(xhr, status, err) {
            console.log("Error while saving Route to Database");
          },
          success: function(res) {
            console.log("Route with the name '" + that.elements.name.value + "' saved to Database.");
          }
        });
        inputRoute.remove();
        return false;
      }
    });
  });



  // Code taken from http://www.liedman.net/leaflet-routing-machine/tutorials/interaction/
/*  map.on('click', function(e) {
    if (routeSwitch){
      var container = L.DomUtil.create('div'),
          startBtn = createButton('Parkplatz hinzufügen', container),
          destBtn = createButton('Zuschauerplätze', container);

      L.popup()
          .setContent(container)
          .setLatLng(e.latlng)
          .openOn(map);
      L.DomEvent.on(startBtn, 'click', function() {
      routeControl.spliceWaypoints(0, 1, e.latlng);
      map.closePopup();
      });
      L.DomEvent.on(destBtn, 'click', function() {
        routeControl.spliceWaypoints(routeControl.getWaypoints().length - 1, 1, e.latlng);
        map.closePopup();
      });
    }
  });
*/




routeControl.on('routeselected', function(e) {
        currentRoute = {};
        currentRoute.waypoints = routeControl.getWaypoints();
        currentRoute.route = e.route;

    });
  // setup Leaflet.draw plugin
  // layer to draw on
  editableLayers = new L.FeatureGroup();
  map.addLayer(editableLayers);
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
  visualizationLayers = new L.FeatureGroup();
  map.addLayer(visualizationLayers);

  // add controls to map

  // make icon with photo of GEO1 as the marker image
//  var geo1icon = L.icon({iconUrl: 'https://www.uni-muenster.de/imperia/md/images/geowissenschaften/geo1.jpg', iconSize: [50, 41]});
  // compose popup with a bit of text and another photo
  var geo1text = 'Das wundervolle GEO1-Gebäude an der Heisenbergstraße 2 in Münster <img src="http://www.eternit.de/referenzen/media/catalog/product/cache/2/image/890x520/9df78eab33525d08d6e5fb8d27136e95/g/e/geo1_institut_muenster_02.jpg" width="300">';
  // add marker to map and bind popup

}

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
$(document).ready(function() {



  // submit handler for forms used to load from Database
  $('#loadParklot').submit(function(e) {
    // Prevent default html form handling
    e.preventDefault();
    var that = this;

    // submit via ajax
    $.ajax({
      // catch custom response code.
      statusCode: {
        404: function() {
        alert("Route with the name '" + that.elements.loadname.value + "' is not present in the Database.");
        }
      },
      data: '',
      type: $(that).attr('method'),
      // Dynamically create Request URL by appending requested name to /api prefix
      url:  $(that).attr('action') + that.elements.loadname.value,
      error: function(xhr, status, err) {
      },
      success: function(res) {
        var route = JSON.parse(res[0].route);
        routeControl.setWaypoints(route.waypoints).addTo(map);
        console.log("Route '" + that.elements.loadname.value + "' successfully loaded.");
      }
    });
    return false;
  });

  // submit handler for forms used to load from Database
  $('#loadFormRoutesVisualization').submit(function(e) {
    // Prevent default html form handling
    e.preventDefault();
    var that = this;

    // submit via ajax
    $.ajax({
      // catch custom response code.
      statusCode: {
        404: function() {
        alert("Route with the name '" + that.elements.loadname.value + "' is not present in the Database.");
        }
      },
      data: '',
      type: $(that).attr('method'),
      // Dynamically create Request URL by appending requested name to /api prefix
      url:  $(that).attr('action') + that.elements.loadname.value,
      error: function(xhr, status, err) {
      },
      success: function(res) {
        var route = JSON.parse(res[0].route);
        console.log(res[0].route);
        L.geoJSON(RouteToGeoJSON(route.route)).addTo(visualizationLayers);
        console.log("Route '" + that.elements.loadname.value + "' successfully visualized.");
      }
    });
    return false;
  });

  if ((document.getElementById('loadname')).value != ""){
    document.getElementById('btnid').click();
  }
});


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


// Code taken from http://www.liedman.net/leaflet-routing-machine/tutorials/interaction/
function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}
function clearVisualizationLayer() {
  visualizationLayers.clearLayers();
}

document.addEventListener("DOMContentLoaded", function(event) {
  initMap();
  initUI();
});
