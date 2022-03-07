// JS for Park Explorer app for viewing and contributing
// to the inventory of urban parks.

const apiKey = "AAPK8d282eac8b914f268b1f79b910456e29PaAKrF22B4sAzEOqQOIB-YLCf1G1YL__MRwkeGCd6fe3RAfcuJ7XXA1aMUwosmsH";

const parkY = 41.886026
const parkX = -87.617608

const map = L.map('map', {
  minZoom: 2,
  // measureControl: true,
  editable: true,
  fullscreenControl: {
      pseudoFullscreen: false
  }
}).setView([parkY, parkX], 18);

// basemaps--------------
const basemapLayers = {
  "Light Gray": L.esri.Vector.vectorBasemapLayer('ArcGIS:LightGray', {apiKey: apiKey}),
  "Topographic": L.esri.Vector.vectorBasemapLayer('ArcGIS:Topographic', {apiKey: apiKey}),
  "OSM:Streets": L.esri.Vector.vectorBasemapLayer('OSM:Streets', {apiKey: apiKey}),
  "Esri World Imagery": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
  "World Topo Map": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}').addTo(map)
}

//data layers
var valves = L.esri.featureLayer({
  url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/WORKMapper/FeatureServer/1',
  simplifyFactor: 1,
  minZoom: 17
}).addTo(map),
  fittings = L.esri.featureLayer({
  url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/WORKMapper/FeatureServer/2',
  simplifyFactor: 1,
  minZoom: 17
}).addTo(map),
  services = L.esri.featureLayer({
  url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/WORKMapper/FeatureServer/3',
  simplifyFactor: 1,
  minZoom: 17
}).addTo(map),
  main = L.esri.featureLayer({
  url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/WORKMapper/FeatureServer/4',
  simplifyFactor: 1,
  minZoom: 17
}).addTo(map),
  buildings = L.esri.featureLayer({
  url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/WORKMapper/FeatureServer/6',
  simplifyFactor: 1,
  minZoom: 17
}).addTo(map),
  streets = L.esri.featureLayer({
  url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/WORKMapper/FeatureServer/7',
  simplifyFactor: 1,
  minZoom: 17
}).addTo(map),
  row = L.esri.featureLayer({
  url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/WORKMapper/FeatureServer/8',
  simplifyFactor: 1,
  minZoom: 15
}).addTo(map),
  parcels = L.esri.featureLayer({
  url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/WORKMapper/FeatureServer/9',
  simplifyFactor: 1,
  minZoom: 15
}).addTo(map);

// popups
valves.bindPopup(function (layer) {
  return L.Util.template('Hello'/*, layer.feature.properties*/)
});
fittings.bindPopup(function (layer) {
  return L.Util.template('<b>Type: </b>{FeatureType}<br><b>Name: </b>{FeatureName}</br><p><a href="https://www.google.com/maps/dir/?api=1&destination=' + parkY + ',' + parkX + '" target="_blank">Get Directions</a>', layer.feature.properties)
});
services.bindPopup(function (layer) {
  return L.Util.template('<b>Type: </b>{PlantType}<br><b>Name: </b>{PlantName}</br><p><a href="https://www.google.com/maps/dir/?api=1&destination=' + parkY + ',' + parkX + '" target="_blank">Get Directions</a>', layer.feature.properties)
});
main.bindPopup(function (layer) {
  return L.Util.template('<b>Type: </b>{TransportType}<br><b>Name: </b>{TransportName}</br><p><a href="https://www.google.com/maps/dir/?api=1&destination=' + parkY + ',' + parkX + '" target="_blank">Get Directions</a>', layer.feature.properties)
});
buildings.bindPopup(function (layer) {
  return L.Util.template('<b>Type: </b>{SurfaceType}<br><b>Name: </b>{SurfaceName}</br><p><a href="https://www.google.com/maps/dir/?api=1&destination=' + parkY + ',' + parkX + '" target="_blank">Get Directions</a>', layer.feature.properties)
});
// streets.bindPopup(function (layer) {
//   return L.Util.template('<b>Type: </b>{ServiceType}<br><b>Name: </b>{ServiceName}</br><p><a href="https://www.google.com/maps/dir/?api=1&destination=' + parkY + ',' + parkX + '" target="_blank">Get Directions</a>', layer.feature.properties)
// });
// contributions.bindPopup(function (layer) {
//   return L.Util.template('<b>Type: </b>{ContributionType}<br><b>Name: </b>{ContributionName}</br><br><b>Status: </b>{ContributionStatus}<p><a href="https://www.google.com/maps/dir/?api=1&destination=' + parkY + ',' + parkX + '" target="_blank">Get Directions</a>', layer.feature.properties)
// });

// variable for layer control
var overlays = {
  "Valves": valves,
  "Fittings": fittings,
  "Services": services,
  "Main": main,
  "Buildings": buildings,
  "Streets": streets,
  "Rights of Way": row,
  "Parcels": parcels
}

// add controls to map
L.control.layers(basemapLayers, overlays).addTo(map); // layer control
L.control.locate().addTo(map); // device location control
L.control.measure({ //measure control
  position: 'topleft',
  primaryLengthUnit: 'feet', secondaryLengthUnit: 'miles',
  primaryAreaUnit: 'sqfeet', secondaryAreaUnit: undefined,
  activeColor: '#00ccff',
  completedColor: '#003399',
  popupOptions: { className: 'leaflet-measure-resultpopup', autoPanPadding: [10, 10] },
  captureZIndex: 10000,
  decPoint: '.', thousandsSep: ','
}).addTo(map)
var searchControl = L.esri.Geocoding.geosearch({ // search control
  providers: [
    L.esri.Geocoding.arcgisOnlineProvider({
      // API Key to be passed to the ArcGIS Online Geocoding Service
      apikey: apiKey
    })
  ]
}).addTo(map);
const legend = L.control.Legend({ // legend control
  position: "topleft",
  collapsed: true,
  symbolWidth: 18,
  opacity: 1,
  column: 2,
  legends: [{
      label: "Valve",
      type: "image",
      url: "img/Valve.PNG",
  }, 
  {
      label: "Bend",
      type: "image",
      url: "img/bend.PNG"
  }, {
      label: "Tee",
      type: "image",
      url: "img/tee.PNG"
  },{
      label: "End Cap",
      type: "image",
      url: "img/endcap.PNG"
  },{
      label: "Main",
      type: "image",
      url: "img/main.PNG"
  // }, {
  //     label: "Street Light",
  //     type: "image",
  //     url: "img/features-streetlight.PNG"
  // }, {
  //     label: "Flower",
  //     type: "image",
  //     url: "img/plants-flowers.PNG"
  // // }, {
  // //     label: "Grass",
  // //     type: "image",
  // //     url: "img/plants-grass.PNG"
  // // }, {
  // //     label: "Shrubbery",
  // //     type: "image",
  // //     url: "img/plants-shrubbery.PNG"
  // }, {
  //     label: "Services",
  //     type: "image",
  //     url: "img/services.PNG"
  // }, {
  //     label: "Tree",
  //     type: "image",
  //     url: "img/plants-tree.PNG"
  // }, {
  //     label: "Trash Can",
  //     type: "image",
  //     url: "img/features-trashcan.PNG"
  // }, {
  //     label: "Elevator",
  //     type: "image",
  //     url: "img/features-elevator.PNG"
  // }, {
  //     label: "Transportation",
  //     type: "image",
  //     url: "img/transport.PNG"
  // }, {
  //     label: "Commercial/Residential",
  //     type: "image",
  //     url: "img/commercial.PNG"
  // }, {
  //     label: "Dog Run-Garden-Playground",
  //     type: "image",
  //     url: "img/dogrun-gardenplot-playground.PNG"
  }]
}).addTo(map);

// //Query Control
// L.Control.QueryControl = L.Control.extend({ // query control
//   onAdd: function(map) {
//     // Array of query where clauses
//     const whereClauses = ["Filter by Service Type", "ServiceType = 'Coffee Shop'","ServiceType = 'Chiropractor'","ServiceType = 'Dentist'","ServiceType = 'Grocery Store'","ServiceType = 'Hair Stylist'","ServiceType = 'Hotel'","ServiceType = 'Nail Salon' ","ServiceType = 'Physical Therapist'","ServiceType = 'Restaurant'","ServiceType = 'School'"];
//     // Create select
//     const select = L.DomUtil.create("select","");
//     select.setAttribute("id", "whereClauseSelect");
//     select.setAttribute("style", "font-size: 12px;padding:2px 4px;");
//     whereClauses.forEach(function(whereClause){
//       let option = L.DomUtil.create("option");
//       option.innerHTML = whereClause;
//       select.appendChild(option);
//     });
//     return select;
//   },

//   onRemove: function(map) {
//     // Nothing to do here
//   }
// });
// L.control.queryControl = function(opts) {
//   return new L.Control.QueryControl(opts);
// }
// L.control.queryControl({
//   position: 'topright'
// }).addTo(map);

// // query 2
// L.Control.QueryControl = L.Control.extend({
//   onAdd: function(map) {
//     // Array of query where clauses
//     const whereClauses2 = ["Filter by Contribution Status", "ContributionStatus = 'Open'","ContributionStatus = 'Pending'","ContributionStatus = 'Closed'"];
//     // Create select
//     const select = L.DomUtil.create("select","");
//     select.setAttribute("id", "whereClauseSelect");
//     select.setAttribute("style", "font-size: 12px;padding:2px 4px;");
//     whereClauses2.forEach(function(whereClause){
//       let option = L.DomUtil.create("option");
//       option.innerHTML = whereClause;
//       select.appendChild(option);
//     });
//     return select;
//   },

//   onRemove: function(map) {
//     // Nothing to do here
//   }
// });

// L.control.queryControl = function(opts) {
//   return new L.Control.QueryControl(opts);
// }

// L.control.queryControl({
//   position: 'topright'
// }).addTo(map);

// // When the selected where clause changes, set the filter on the layer
// const select = document.getElementById('whereClauseSelect');
// select.addEventListener('change', () => {
//   if(select.value !== '') {
//     services.setWhere(select.value);
//   }
// });


/* !GEOCODING STUFF! */
// empty layer group for geocoding results
var results = L.layerGroup().addTo(map);
// listen for the results event and add every result to the map
searchControl.on("results", function (data) {
  results.clearLayers();
  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
  }
});


/* !EDITING STUFF! */
// adding features
// var contributionsEdit = L.esri.featureLayerService({
//   url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/ArcGIS/rest/services/LSE_WFL/FeatureServer/0'
// });

// var feature = {
//   type: 'Feature',
//   geometry: {
//     type: 'Point',
//     coordinates: [parkX, parkY]
//   },
//   properties: {
//     name: 'Hello World'
//   }
// };

// contributions.addFeature(feature, function (error, response) {
//   if (error) {
//     console.log('error creating feature' + error.message);
//   } else {
//     console.log('Successfully created feature with id ' + response.objectId);
//   }
// });

// var feature = {
//   type: 'Feature',
//   id: 2,
//   geometry: {
//     type: 'Point',
//     coordinates: [parkX, parkY]
//   },
//   properties: {
//     name: 'Hi I\'m Feature 2'
//   }
// };

// contributions.updateFeature(feature, function (error, response) {
//   if (error) {
//     console.log('error updating feature' + error.message);
//   } else {
//     console.log('Successfully updated feature ' + feature.id);
//   }
// });

// contributions.deleteFeature(2, function (error, response) {
//   if (error) {
//     console.log('error deleting feature' + error.message);
//   } else {
//     console.log('Successfully deleted feature ' + response.objectId);
//   }
// });


// HERE WAS THE WORKING EDITING SECTION
// /* !EDITING STUFF! */
// L.EditControl = L.Control.extend({
//   options: {
//       position: 'topleft',
//       callback: null,
//       kind: '',
//       html: ''
//   },

//   onAdd: function (map) {
//       var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
//           link = L.DomUtil.create('a', '', container);

//       link.href = '#';
//       link.title = 'Create a new ' + this.options.kind;
//       link.innerHTML = this.options.html;
//       L.DomEvent.on(link, 'click', L.DomEvent.stop)
//                 .on(link, 'click', function () {
//                 window.LAYER = this.options.callback.call(map.editTools);
//               }, this);
//   return container;
//   }
// });

// L.NewMarkerControl = L.EditControl.extend({

//   options: {
//       position: 'topleft',
//       callback: map.editTools.startMarker,
//       kind: 'marker',
//       html: '⬤'
//   }

// });

// map.addControl(new L.NewMarkerControl());

// // when users CMD/CTRL click an active editable feature,
// // remove it from the map and delete it from the service
// contributions.on('click', function (e) {
//   if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) && e.layer.editEnabled()) {
//   // delete expects an id, not the whole geojson object
//   contributions.deleteFeature(e.layer.feature.id);
//   }
// });

// // when users double click a graphic, toggle its editable status
// // but when deselecting via double click, pass the geometry update to the service
// contributions.on('dblclick', function (e) {
//   e.layer.toggleEdit();
//   if (!e.layer.editEnabled()) {
//   contributions.updateFeature(e.layer.toGeoJSON());
//   }
// });

// // when a new feature is drawn using one of the custom controls,
// // pass the edit to the featureLayer service
// map.on('editable:drawing:commit', function (e) {
//   contributions.addFeature(e.layer.toGeoJSON(), function (error, response) {
//   if (error || !response.success) {
//       console.log(error, response);      
//   }

//   // now that the L.esri.featureLayer instance will manage this new feature,
//   // remove any temporary features from the map that were created by the Editable plugin
//   map.editTools.featuresLayer.clearLayers();
//   });

//   // disable editing
//   e.layer.toggleEdit();
// });
// HERE ENDED THE WORKING EDITING SECTION


// require([
//   "esri/Map",
//   "esri/layers/FeatureLayer",
//   "esri/widgets/Editor",
//   "esri/views/MapView",
//   "esri/popup/content/AttachmentsContent",
//   "esri/popup/content/TextContent"
// ])