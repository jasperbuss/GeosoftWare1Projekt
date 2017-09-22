/**
 * Geosoftware I, SoSe 2017, Aufgabe
 * @author
 */

'use strict';

// global variables for Leaflet stuff, very handy
var map, marker,regPopup,  layercontrol, editableLayers, visualizationLayers, drawControl,popupMarker, routeControl, routeSwitch, currentRoute;

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
var router = L.routing.osrmv1();
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





  });

  map.on(L.Draw.Event.CREATED, function (e) {

      var popupContent = '<form class="saveParkplatz" id="saveParkplatz" action="/api/save/parklot/" method="POST">'+
          '<div class="form-group">'+
          '<label class="control-label col-sm-5"><strong>Name: </strong></label>'+
          '<input type="text" placeholder="Required" id="name" name="name" class="form-control"/>'+
          '</div>'+
          '<div class="form-group">'+
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
                            iconSize: [30, 21]});
      var type = e.layerType,
          layer = e.layer;
                var popup = L.popup({Width:1000
                    })
                    .setContent(popupContent)
                    .setLatLng(layer.getLatLng())
      //add the marker to a layer
      editableLayers.addLayer(layer);
      marker = new L.marker(layer.getLatLng(), {icon: parkIcon}).addTo(map).bindPopup(popup).openPopup();
      marker.on('popupclose', function (e) {
                  marker.remove();
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




/*routeControl.on('routeselected', function(e) {
        currentRoute = {};
        currentRoute.waypoints = routeControl.getWaypoints();
        currentRoute.route = e.route;

    });
    */
  // setup Leaflet.draw plugin
  // layer to draw on

  // Leaflet.draw options
  var options = {
      position: 'bottomright',
      edit: {
          featureGroup: editableLayers, //REQUIRED!!
          remove: false
      }
  };






function clearPopup(){
  popupMarker.clearLayers(popupMarker);
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

document.addEventListener("DOMContentLoaded", function(event) {
  initMap();
  initUI();
});
