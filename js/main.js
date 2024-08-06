var host = window.isLocal ? window.server : "http://junootraffic.net:8090";
Object.values(maps).forEach((map) => {
    map["mapInstance"] = createMapInstance(host + map.url);
});

var datasets = "";
// Initialize map information with Yamoussoukro as the default layer
let currentMap = findMap("Yamoussoukro");
var map = L.map("map", {
    crs: currentMap.crs,
    center: currentMap.center,
    maxZoom: currentMap.maxZoom,
    zoom: currentMap.zoom,
    zoomControl: currentMap.zoomControl,
    layers: currentMap.mapInstance,
});

// Define base layers
var baseMaps = getMapsInstance();

// Add layer control to the map
L.control.layers(baseMaps).addTo(map);
topLeftControl.addTo(map);
bottomLeftControl.addTo(map);

//Legende
getMapLegends(host + currentMap.url);
//Layer ou couche
getLayers(host + currentMap.url);
// affichage table attributaire

// Set the view to the appropriate coordinates when the map layer is changed
map.on("baselayerchange", function (event) {
    document.getElementById("legend").innerHTML =
        '<div class="legend-title">Légende</div>';
    document.getElementById("couches").innerHTML =
        '<option value="">Veuillez sélectionner une couche</option>';
    document.getElementById("nom_carte").innerHTML = event.name;

    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Clear previous data

    // Dynamically create table headers based on GeoJSON properties
    const tableHeader = document.getElementById("table-header");
    tableHeader.innerHTML = ""; // Clear previous headers

    currentMap = findMap(event.name);
    getMapLegends(host + currentMap.url);
    getLayers(host + currentMap.url);
});
