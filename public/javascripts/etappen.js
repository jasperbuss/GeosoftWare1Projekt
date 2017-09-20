/**
 * Geosoftware I, SoSe 2017, Aufgabe
 * @author
 */

'use strict';

// global variables for Leaflet stuff, very handy
var map, routes, marker,waypoints,zwischenspeicher, layercontrol, editableLayers,routeLayer, visualizationLayers, drawControl, routeControl, routeSwitch, currentRoute;

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



// add controls to map


// Setup Routing Plugin
routeControl = L.Routing.control({
  waypoints: [
      null
  ],
  routeWhileDragging: true,
  show:true,
  position: 'topleft',
  geocoder: L.Control.Geocoder.nominatim()
});
routeControl.addTo(map);




  // Code taken from http://www.liedman.net/leaflet-routing-machine/tutorials/interaction/
  /* map.on('click', function(e) {
    if (routeSwitch){
      var container = L.DomUtil.create('div'),
          startBtn = createButton('Etappenstart', container),
          destBtn = createButton('Etappenende', container);

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
  visualizationLayers = new L.FeatureGroup();
  //map.addLayer(visualizationLayers);

  // add controls to map
  drawControl = new L.Control.Draw(options);

  map.addControl(drawControl);

  map.on('click', function(e) {
       if (routeSwitch){
           var container = L.DomUtil.create('div'),
               startBtn = createButton('Start from this location', container),
               destBtn = createButton('Go to this location', container);
           console.log(e.latlng);
           L.popup()
               .setContent(container)
               .setLatLng(e.latlng)
               .openOn(map);
           L.DomEvent.on(startBtn, 'click', function() {
               routeControl.spliceWaypoints(0, 1, e.latlng);
               zwischenspeicher = e.latlng;
               map.closePopup();

           });
           L.DomEvent.on(destBtn, 'click', function() {

               var popupStartcontent = '<form  id="saveEtappe" action="/api/save/etappe/" method="POST">'+
                   '<div class="form-group">'+
                   '<label class="control-label col-sm-5"><strong>Etappenname: </strong></label>'+
                   '<input type="text" placeholder="Required" id="name" name="name" class="form-control"/>'+
                   '</div>'+
                   '<div class="form-group">'+
                   '<label id="starttermin" class="control-label col-sm-2"><strong>Starttermin: </strong></label>'+
                   '<input type="date"  class="form-control" id="start" name="start">'+'<label id="startort" class="control-label col-sm-2"><strong>Startort: </strong></label>'+
                   '<input type="text"  class="form-control" id="startort" name="startort">'+
                   '</div>'+
                   '<div class="form-group">'+
                   '<label id="endtermin" class="control-label col-sm-5"><strong>Ende </strong></label>'+
                   '<input type="date"  class="form-control" id="end" name="end">'+'<label id="zielort" class="control-label col-sm-2"><strong>Zielort: </strong></label>'+
                   '<input type="text"  class="form-control" id="zielort" name="zielort">'+
                   '</div>'+
                   //...
                   '<div class="form-group">'+
                   '<label class="control-label col-sm-5"><strong>Website </strong></label>'+
                   '<input type="text" placeholder="https://www......" id="website" name="website" class="form-control"/>'+
                   '</div>'+
                   '<div class="form-group">'+
                   '<label class="control-label col-sm-7"><strong>Bild zu Start: </strong></label>'+
                   '<input type="text" placeholder="https://www......" id="picstart" name="picstart" class="form-control"/>'+
                   '</div>'+                    '<div class="form-group">'+
                   '<label class="control-label col-sm-7"><strong>Bild zu Ende: </strong></label>'+
                   '<input type="text" placeholder="https://www......" id="picende" name="picende" class="form-control"/>'+
                   '</div>'+
                   '<div class="form-group">'+
                   '<div style="text-align:center;" class="col-xs-4"><button type="submit" value="speichern" class="btn btn-primary trigger-submit">Etappe speichern</button></div>'+              '</div>'+
                   '</form>';

               routeControl.spliceWaypoints(routeControl.getWaypoints().length - 1, 1, e.latlng);
               var waypoints =  routeControl.getWaypoints();
               map.closePopup();
               var koordinatenStart = new L.LatLng(waypoints[0].latLng.lat,waypoints[0].latLng.lng);
               var popupStart = L.marker(koordinatenStart).addTo(visualizationLayers);
               popupStart.bindPopup(popupStartcontent).openPopup();

               $('#saveEtappe').submit(function(e) {
                   e.preventDefault();
                   if (currentRoute){
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
                               console.log("Error while saving Route to Database");
                           },
                           success: function(res) {
                               console.log("Route with the name '" + that.elements.name.value + "' saved to Database.");
                           }
                       });
                       inputRoute.remove();
                       map.closePopup();

                       return false;
                   }

               });
               $('#loadEtappe').submit(function(e) {
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
           });

       }


   });


  /** When an object ( e.g. marker ) is moved onto the map this event will trigger
   *  Popup with our own content will show up and the user can fill in the information
   *  that wants to be stored
   */
  map.on(L.Draw.Event.CREATED, function (e) {

      var popupContent = '<form class="meineForm" id="Parkplatz" action="/api/save/marker/" method="POST">'+
          '<div class="form-group">'+
          '<label class="control-label col-sm-5"><strong>Name: </strong></label>'+
          '<input type="text" placeholder="Required" id="name" name="name" class="form-control"/>'+
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


      var type = e.layerType,
          layer = e.layer;
      //add the marker to a layer
      editableLayers.addLayer(layer);
      L.marker(layer.getLatLng()).addTo(map);
      var popup = L.popup({Width:1000
          })
          .setContent(popupContent)
          .setLatLng(layer.getLatLng())
          .openOn(map);

          $('#saveMarker').submit(function(e) {
                     e.preventDefault();

                         // Append hidden field with actual GeoJSON structure
                         var inputGeo = $('<input type="hidden" name="geometry" value=' + JSON.stringify(editableLayers.toGeoJSON())+ '>');
                         $(this).append(inputGeo);
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
                                 console.log("Route with the name '" + that.elements.name.value+"' saved to Database.");
                             }
                         });
                         inputGeo.remove();
                         map.closePopup();

                     return false;

                 });


             });
      //Override the default handler for the saveMarker form previously defined


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

  if ((document.getElementById('loadingname')).value != ""){
    document.getElementById('butId').click();
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
