// JS for WORKMapper app for viewing and creating
// Maximo work orders from a web map.
// By Todd Burciaga for GEOG 778

const apiKey = "AAPK8d282eac8b914f268b1f79b910456e29PaAKrF22B4sAzEOqQOIB-YLCf1G1YL__MRwkeGCd6fe3RAfcuJ7XXA1aMUwosmsH";

const startY = 41.886525
const startX = -87.617777

const map = L.map('map', {
  minZoom: 1,
  fullscreenControl: {
    pseudoFullscreen: false
  }
}).setView([startY, startX], 18);

// ADD BASEMAP LAYERS-----------------------------------------------
var basemapLayers = {
  "Light Gray": L.esri.Vector.vectorBasemapLayer('ArcGIS:LightGray', { apiKey: apiKey }),
  "Topographic": L.esri.Vector.vectorBasemapLayer('ArcGIS:Topographic', { apiKey: apiKey }),
  "OSM:Streets": L.esri.Vector.vectorBasemapLayer('OSM:Streets', { apiKey: apiKey }),
  "Esri World Imagery": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
  "World Topo Map": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}').addTo(map)
}

// FEATURE SERVICE URLS
const valvesUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/WORKMapper/FeatureServer/1";
const fittingsUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/WORKMapper/FeatureServer/2";
const mainUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/WORKMapper/FeatureServer/4";
const servicesUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/WORKMapper/FeatureServer/3";
const valvesStatusUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Valve_Status/FeatureServer/0";
const fittingsStatusUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Fittings_Status/FeatureServer/0";
const mainStatusUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Main_Status/FeatureServer/0";
const servicesStatusUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Service_Status/FeatureServer/0";
const buildingsUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/WORKMapper/FeatureServer/6";
const rowUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/WORKMapper/FeatureServer/8";
const parcelsUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/WORKMapper/FeatureServer/9";


// ADD DATA LAYERS--------------------------------------------------

// CREATE MAP PANES FOR LAYER ORDER HANDLING 
// PANES ARE ADDED TO THE MAP IN ORDER
map.createPane("buildings");

  // BASEMAP LAYERS--------------------
var buildings = L.esri.featureLayer({
  url: buildingsUrl,
  simplifyFactor: 1,
  minZoom: 1,
  pane: "buildings"
});

map.createPane("row");

var row = L.esri.featureLayer({
  url: rowUrl,
  simplifyFactor: 1,
  minZoom: 1,
  pane: "row"
});

map.createPane("parcels");

var parcels = L.esri.featureLayer({
  url: parcelsUrl,
  simplifyFactor: 1,
  minZoom: 1,
  pane: "parcels"
});


// CREATE WORK PANES FOR LAYER ORDER HANDLING
map.createPane("valvestatus");

// WORK ORDER STATUS LAYERS --------------------
var valvesstatus = L.esri.featureLayer({
  url: valvesStatusUrl,
  where: "Status = 'In Progress'",
  simplifyFactor: 1,
  minZoom: 1,
  pane: "valvestatus"
}).addTo(map);

map.createPane("fittingstatus");

var fittingstatus = L.esri.featureLayer({
    url: fittingsStatusUrl,
    where: "Status = 'In Progress'",
    simplifyFactor: 1,
    minZoom: 1,
    pane: "fittingstatus"
}).addTo(map);

map.createPane("mainstatus");

var mainstatus = L.esri.featureLayer({
    url: mainStatusUrl,
    where: "Status = 'In Progress'",
    simplifyFactor: 1,
    minZoom: 1,
    pane: "mainstatus"
}).addTo(map);

map.createPane("servicestatus");

var servicestatus = L.esri.featureLayer({
    url: servicesStatusUrl,
    where: "Status = 'In Progress'",
    simplifyFactor: 1,
    minZoom: 1,
    pane: "servicestatus"
}).addTo(map);

// ASSETS LAYERS---------------------

// MAIN
map.createPane("main"); // CREATE ASSETS PANES FOR LAYER ORDER HANDLING

var main = L.esri.featureLayer({
  url: mainUrl,
  simplifyFactor: 0.35,
  minZoom: 1,
  pane: "main"
}).addTo(map).on('click', function (evt, group="MAIN") {
  updateSidebar(evt, group);
});

// SERVICES
map.createPane("services");

var services = L.esri.featureLayer({
  url: servicesUrl,
  simplifyFactor: 0.35,
  minZoom: 1,
  pane: "services"
}).addTo(map).on('click', function (evt, group="SERVICE") {
  updateSidebar(evt, group);
});

// VALVES
map.createPane("valves");

var valves = L.esri.featureLayer({
  url: valvesUrl,
  simplifyFactor: 0.35,
  minZoom: 1,
  pane: "valves"
}).addTo(map).on('click', function (evt, group="VALVE") {
  updateSidebar(evt, group);
});

// FITTINGS
map.createPane("fittings");

var fittings = L.esri.featureLayer({
  url: fittingsUrl,
  simplifyFactor: 0.35,
  minZoom: 1,
  pane: "fittings"
}).addTo(map).on('click', function (evt, group="FITTING") {
  updateSidebar(evt, group);
});


// VARIABLE FOR ALL FEATURE LAYERS
var overlays = {
  "Valves": valves,
  "Fittings": fittings,
  "Services": services,
  "Main": main,
  "Buildings": buildings,
  "Rights of Way": row,
  "Parcels": parcels,
  "Valve Status": valvesstatus,
  "Fitting Status": fittingstatus,
  "Service Status": servicestatus,
  "Main Status": mainstatus
}


// CONTROLS AND TOOLS----------------------------------------------------------

// LAYER CONTROLS
L.control.layers(basemapLayers, overlays, { position: 'topright' }).addTo(map);

// DEVICE LOCATION BUTTON
L.control.locate().addTo(map); // device location control

// MEASURE TOOL
L.control.measure({
  position: 'topleft',
  primaryLengthUnit: 'feet', secondaryLengthUnit: 'miles',
  primaryAreaUnit: 'sqfeet', secondaryAreaUnit: undefined,
  activeColor: '#00ccff',
  completedColor: '#003399',
  popupOptions: { className: 'leaflet-measure-resultpopup', autoPanPadding: [10, 10] },
  captureZIndex: 10000,
  decPoint: '.', thousandsSep: ','
}).addTo(map);

// SEARCH TOOL
var searchControl = L.esri.Geocoding.geosearch({ // search control
  providers: [
    L.esri.Geocoding.arcgisOnlineProvider({
      // API Key to be passed to the ArcGIS Online Geocoding Service
      apikey: apiKey
    })
  ]
}).addTo(map);

// LEGEND TOOL
const legend = L.control.Legend({ // legend control
  position: "topleft",
  collapsed: true,
  symbolWidth: 18,
  opacity: 1,
  column: 2,
  legends: [{
    label: "Bend",
    type: "image",
    url: "img/legend-bend.PNG",
  }, {
    label: "End Cap",
    type: "image",
    url: "img/legend-endcap.PNG"
  }, {
    label: "Tee",
    type: "image",
    url: "img/legend-tee.PNG"
  }, {
    label: "Valve",
    type: "image",
    url: "img/legend-valve.PNG"
  }, {
    label: "Main",
    type: "image",
    url: "img/legend-main.PNG"
  }, {
    label: "Service",
    type: "image",
    url: "img/legend-service.PNG"
  }, {
    label: "Building",
    type: "image",
    url: "img/legend-building.PNG"
  }, {
    label: "Parcel",
    type: "image",
    url: "img/legend-parcel.PNG"
  }, {
    label: "Right of Way",
    type: "image",
    url: "img/legend-row.PNG"
  }]
}).addTo(map);

// GEOCODING TOOL
// empty layer group for geocoding results
var searchResults = L.layerGroup().addTo(map);
// listen for the searchResults event and add every result to the map
searchControl.on("searchResults", function (data) {
  searchResults.clearLayers();
  for (var i = data.searchResults.length - 1; i >= 0; i--) {
    searchResults.addLayer(L.marker(data.searchResults[i].latlng));
  }
});


// LABELS ------------------------------------------------------------
var valveLabels = {};

valves.on('createfeature', function (e) {
  var id = e.feature.id;
  var feature = valves.getFeature(id);
  var center = feature.getLatLng();
  var label = L.marker(center, {
    icon: L.divIcon({
      iconSize: null,
      className: 'label',
      html: '<div>' + e.feature.properties.ASSET_ID + '</div>'
    })
  }).addTo(map);
  valveLabels[id] = label;
});

valves.on('addfeature', function (e) {
  var label = valveLabels[e.feature.id];
  if (label) {
    label.addTo(map);
  }
});

valves.on('removefeature', function (e) {
  var label = valveLabels[e.feature.id];
  if (label) {
    map.removeLayer(label);
  }
});


// MAIN FUNCTION FOR UPDATING SIDEBAR WITH INFO FROM ASSET AND WO TABLE -------------------------
// DETERMINES FITTING TYPE, QUERIES RELATED WOS, BUILDS SIDEBAR CONTENT,
// THEN OPENS SIDEBAR. CALLED FROM ONCLICK EVENT.
function updateSidebar(evt, group) {
  // ASSET INFORMATION
  if (group == "FITTING") {
    var assetId = evt.layer.feature.properties.OBJECTID;
    var assetType = fittingTranslator(evt.layer.feature.properties.TYPE);
  } else {
    var assetId = evt.layer.feature.properties.ASSET_ID;
    var assetType = group;
  }
  var assetGUID = evt.layer.feature.properties.GlobalID;
  var assetComments = assetCommentTranslator(evt.layer.feature.properties.COMMENTS);


  // WORK ORDER INFORMATION
  queryRelated(evt, group);  // RUN CORRESPONDING RELATED TABLE QUERY

  // BUILD SIDEBAR ASSET AND WORK INFO COMPONENTS
  var headerContent = '<h2><center><b>' + toTitleCase(group) + ' Information</b></center></h2><hr class="rounded2">';
  var assetContent = '<h3><img src="img/legend-valve.PNG" width="19" height="19"/>  <b>Asset Details</b></h3>' +
    '<b>Asset ID: </b> ' + assetId + '<br><b>Asset Type: </b>' + assetType + '<br><b>Asset Group: </b>' + group +
    '<br><b>Asset Comments: </b> ' + assetComments + '<br><b>Asset GUID: </b>' + assetGUID;
  var dividerContent = '<hr class="rounded1">';
  var workHeader = '<h3><img src="img/favicon-32x32.png" width="19" height="19"/>  <b> Work Order Details</b></h3><small>Only "In Progress" (scheduled) work orders shown.</small>';
  var workTableDiv = '<div id="work-order-table" class="leaflet-bar table-sm"></div>';
  var workContent = workHeader + workTableDiv;
  var woButton = '<br><center><button onclick="woEntry(\'' + group + '\',\'' + assetGUID + '\')" type="submit" class="btn btn-primary" style="text-align:left">Create Work Order</button>    <button onclick="sidebar.hide()" type="button" class="btn btn-secondary" style="text-align:left">Close</button></center>';

  // ASSEMBLE SIDEBAR
  var sidebarContent = headerContent + assetContent + dividerContent + workContent + woButton;
  sidebar.setContent(sidebarContent);
  sidebar.show();


  function fittingTranslator(fittingType) {
    if (fittingType == 1) {
      return "BEND"
    } else if (fittingType == 2) {
      return "TEE"
    } else return "END CAP"
  }

  function assetCommentTranslator(assetComments) {
    if (assetComments != null) {
      return assetComments
    } else return "NO COMMENTS"
  }

  function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  // QUERY AND POPULATE WORK ORDER TABLE IN SIDEBAR
  function queryRelated(evt, group) {
    if (group == "FITTING") {
      var fl = fittings;
      var relId = "1";
    } else if (group == "VALVE") {
      var fl = valves;
      var relId = "0";
    } else if (group == "SERVICE") {
      var fl = services;
      var relId = "2";
    } else {
      var fl = main;
      var relId = "3";
    }

    // RELATED TABLE (WO TABLE) QUERY
    L.esri.Related.query(fl).objectIds([evt.layer.feature.id]).relationshipId(relId).run(function (error, response, raw) {
      //pull the attributes out of the geoJson response
      if (response.features.length > 0) {
        var results = [];
        for (i = 0; i < response.features.length; i++) {
          results.push(response.features[i].properties);
        }
        // UPDATE DATE FORMATTING IN OBJECT ARRAY
        results.forEach(item => item.created_date = epochToTextDateFormatter(item.created_date));
        results.forEach(item => item.StatusDate = epochToTextDateFormatter(item.StatusDate)); 

        // FUNCTION FOR FORMATTING DATES FOR TABLE DISPLAY
        function epochToTextDateFormatter(epochDate) {  
          var epochDate = new Date(epochDate);         
          var dd = String(epochDate.getDate()).padStart(2, '0');
          var mm = String(epochDate.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = epochDate.getFullYear();
          epochDate = mm + '/' + dd + '/' + yyyy;
          return epochDate
        }

        $('#work-order-table').removeClass('hidden');
        // //you can only call refresh() when loading from a url
        // $('#work-order-table').bootstrapTable('refresh');
        $('#work-order-table').bootstrapTable('destroy');
        $('#work-order-table').bootstrapTable({
          data: results,
          cache: false,
          striped: true,
          clickToSelect: true,
          columns: [{
            field: 'WorkOrderID',
            title: 'Work Order ID',
            sortable: true,
          }, {
            field: 'Status',
            title: 'Status',
            sortable: true
          }, {
            field: 'created_date',
            title: 'Open Dt',
            sortable: true
          }, {
            field: 'StatusDate',
            title: 'Due Dt',
            sortable: true
          }]
        });
      } else {
        document.getElementById('work-order-table').innerHTML = "<p><h5><center>No Work Orders Found! Time for a nap!<center></h5></p>";
      }
    });
  }

}

// WORK ORDER FORM ASSEMBLY ----------------------------------------
function woEntry (group, assetGUID) {
  var randomNumber = Math.floor(Math.random() * 9000) + 1000;
  var mxWO = 'MX123' + randomNumber.toString() //CREATE MAXIMO WO NUMBER
  var maximoWorkOrderOne = mxWO
  var relAssetIdField = determineRelAssetId(group); //SET TARGET KEY FIELD BASED ON LAYER

  // SET VARIABLES WITH DATA FOR WO FORM
  var openDate = todaysDate();
  var dueDate = dueDate();
  var assetKey = assetGUID;


  // BUILD THE FORM WITH BUTTONS WHERE ONCLICK CALLS BUTTONDATAGRAB()
  var formContentOne = '<div id="mxform"><div id="formTitle"><h2><center>Create a Work Order</center></h2></div><form><div class="form-group"><label for="maximoWorkOrderOne">Maximo Work Order</label><input type="text" class="form-control" id="maximoWorkOrderOne" aria-describedby="maximoWODesc" placeholder="MX1234819" value="' + maximoWorkOrderOne + '" readonly="readonly"><small id="maximoWODesc" class="form-text text-muted">Maximo work order (autogenerated).</small></div><div class="form-group"><label class="control-label" for="openDate">Open Date</label><input class="form-control" id="openDate" name="openDate" placeholder="MM/DD/YYYY"  value="' + openDate + '" type="text"><small id="openDateDesc" class="form-text text-muted">Date work order was opened.</small></div><div class="form-group"><label for="workType">Work Type</label><select class="form-control" id="workType"><option><option>Inspection</option><option>Maintenance</option><option>Repair</option><option>Replacement</option></select><small id="workTypeDesc" class="form-text text-muted">Choose the type of work to be performed.</small></div><div class="form-group"><label for="workStatus">Work Order Status</label><select class="form-control" id="workStatus"><option><option>Pending</option><option>In Progress</option><option>Closed</option></select><small id="workStatusDesc" class="form-text text-muted">Select current work order status.</small></div><div class="form-group"><label class="control-label" for="dueDate">Due Date</label><input class="form-control" id="dueDate" name="dueDate" placeholder="MM/DD/YYYY" value="' + dueDate + '" type="text"><small id="dueDateDesc" class="form-text text-muted">Date work order is due. Default is 1 week past Open Date.</small></div><div class="form-group"><label for="assetKey">Asset Key ID (GUID)</label><input type="text" class="form-control" id="assetKey" aria-describedby="assetKeyDesc" placeholder="608bd1b2-a48d-44c8-b5de-216b68199ab3" value="' + assetKey + '" readonly="readonly"><small id="assetKeyDesc" class="form-text text-muted">GUID of selected asset.</small></div>'
  var formContentTwo = '<button onclick="buttonDataGrab(\'' + maximoWorkOrderOne + '\',\'' + relAssetIdField + '\',\'' + assetGUID + '\')" type="submit" class="btn btn-primary" style="text-align:left">Submit</button>   '
  var formContentThree = '<button type="button" class="btn btn-secondary" onclick="sidebar.hide()">Cancel</button></form></div>'
  var formContent = formContentOne + formContentTwo + formContentThree


  // SET WHICH FIELD THE ORIGIN ASSET ID KEY WILL BE SENT TO
  function determineRelAssetId(group) {
    if (group == "FITTING") {
      keyFieldName = "REL_GlobalID_Fitting"
    } else if (group == "VALVE") {
      keyFieldName = "REL_GlobalID_Valve"
    } else if (group == "SERVICE") {
      keyFieldName = "REL_GlobalID_Service"
    } else keyFieldName = "REL_GlobalID_Main"

    return keyFieldName
  }

  // CALCULATE TODAY'S (OPEN) DATE
  function todaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    return today
  }

  // CALCULATE DUE DATE
  function dueDate() {
    var date = new Date();
    date.setDate(date.getDate() + 7);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    date = mm + '/' + dd + '/' + yyyy;
    return date
  }


  // UPDATE SIDEBAR CONTENT WITH FORM CONTENT
  sidebar.setContent(formContent);

}

// ASSEMBLE ATTRIBUTES FROM FORM ENTRY ITEMS AND SUBMIT TO CREATEWORKORDER()
function buttonDataGrab(maximoWorkOrderOne, relAssetIdField, assetGUID) {
  var statusForm = document.getElementById("workStatus").value;// Form submission
  var dueDateForm = Date.parse(document.getElementById("dueDate").value);// Translate Form date submission to epoch time
  var openDateForm = Date.parse(document.getElementById("openDate").value);// Translate Form date submission to epoch time
  var typeForm = document.getElementById("workType").value;// Form submission

  createWorkOrder(maximoWorkOrderOne, statusForm, dueDateForm, openDateForm, typeForm, relAssetIdField, assetGUID)

}

// FUNCTION THAT SENDS TO WORK ORDER INFORMATION TO THE WORK ORDER TABLE ---------------------------------------
function createWorkOrder(maximoWorkOrderOne, statusForm, dueDateForm, openDateForm, typeForm, relAssetIdField, assetGUID) {
  addFeaturesUrl = 'https://services.arcgis.com/HRPe58bUyBqyyiCt/ArcGIS/rest/services/WORKMapper/FeatureServer/13/addFeatures?features='

  var features = [{ "attributes": { "WorkOrderID": maximoWorkOrderOne, "Status": statusForm, "StatusDate": dueDateForm, "CreatedTimeStamp": openDateForm, "Type": typeForm, [relAssetIdField]: assetGUID } }]
  var addAttributesUrl1 = JSON.stringify(features)

  var obj1 = encodeURIComponent(addAttributesUrl1);

  var theUrl1 = addFeaturesUrl + obj1;

  var xmlHttp = null;

  xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", theUrl1, false);
  xmlHttp.send(null);

  var confirmation = '<div id=mxform><div id=formTitle><h2><center>Thank you! Your work order has been submitted!</center><br></h2></div><br><br><center><form><button class="btn btn-secondary"onclick=sidebar.hide() type=button>Close</button></form></center></div>'

  sidebar.setContent(confirmation)

} 


// SIDEBAR CONFIG ---------------------------------------------------
var sidebar = L.control.sidebar('sidebar', {
  position: 'right'
});

map.addControl(sidebar);