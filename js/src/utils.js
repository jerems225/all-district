const createMapInstance = (mapUrl) => {
    return new L.supermap.TiledMapLayer(mapUrl, { noWrap: true });
}

const findMap = (mapName) => {
    let searchResult = {};
    Object.values(maps).map((map) => {
        map.name == mapName ? searchResult = map : null;
    });

    return searchResult;
}

const getMapsInstance = () => {
    let mapsInstance = [];
    Object.values(maps).forEach((map) => {
        mapsInstance.push({[map.name] : map.mapInstance});
    });

    return Object.assign({}, ...mapsInstance);
}

const getMapLegends = (mapUrl) => {
    new L.supermap.LayerInfoService(mapUrl).getLayersInfo(async function (serviceResult) {
        const Layers = serviceResult.result.subLayers.layers;
        const projectName = serviceResult.result.name;
        let LayersNames = ''
        Layers.map((layer) => {
            LayersNames += layer.name + `@@${projectName},`
        });

        const getLayersLegendInfoParams = new L.supermap.GetLayersLegendInfoParameters({
            layers: "show:" + LayersNames,
            width: 18,
            height: 18
        });
        const LayersInfo = new L.supermap.LayerInfoService(mapUrl).getLayersLegendInfo(getLayersLegendInfoParams, function (resultService) {
            return resultService.result;
        });
        const response = await LayersInfo;
        const MapLegends = response.result;

        showMapLegends(MapLegends);
        map.setView(currentMap.center, currentMap.zoom);
    });


}

const showMapLegends = (MapLegends) => {
    const legendData = MapLegends.layerLegends;
    const legendContainer = document.getElementById('legend');
    legendData.forEach(layer => {
        const layerName = layer.layerName;
        const legends = layer.legends;

        legends.forEach(legend => {
            const legendLabel = legend.label;
            const legendImageData = legend.imageData;

            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';

            const legendImageElem = document.createElement('img');
            legendImageElem.className = 'legend-image';
            legendImageElem.src = 'data:image/png;base64,' + legendImageData;

            const legendLabelElem = document.createElement('span');
            legendLabelElem.className = 'legend-label';
            legendLabelElem.textContent = legendLabel;

            legendItem.appendChild(legendImageElem);
            legendItem.appendChild(legendLabelElem);

            legendContainer.appendChild(legendItem);
        });
    });
}

const getLayers = (mapUrl) => {
    new L.supermap.LayerInfoService(mapUrl).getLayersInfo(async function (serviceResult) {
        const Layers = serviceResult.result.subLayers.layers;
        console.log(Layers)
        let LayerNames = [];
        Layers.map((layer) => {
            LayerNames.push(layer.datasetInfo.name)
        });

        showLayers([...new Set(LayerNames)]);

    });
}

const showLayers = (LayerNames) => {
    var select = document.getElementById('couches');
    var nombreCouche = document.getElementById('nombreCouche');
    var numCouches = LayerNames.length;
    nombreCouche.textContent = numCouches;
    
    // Clear previous options
    select.innerHTML = '<option value="">Veuillez sélectionner une couche</option>';

    // Fill the select with the names of layers
    LayerNames.forEach(function(name) {
        var option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });

    // Add event listener to detect selection changes
    select.addEventListener('change', function() {
        var coucheSelectionnee = select.value;
        datasets = coucheSelectionnee; // Store the selected value in datasets variable
        // url de la table attributaire
        getLayerDatasets(currentMap.datasetsUrl,datasets);
    });

}

const getLayerDatasets = (datasetsUrl, layer) => {
    var remplace_fin_url = `datasets/${layer}/features.geojson`;
    var geojsonUrl = datasetsUrl.replace('datasets.json', remplace_fin_url);

    fetch(geojsonUrl)
        .then(response => response.json())
    .then(data => {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear previous data

    // Dynamically create table headers based on GeoJSON properties
    const tableHeader = document.getElementById('table-header');
    tableHeader.innerHTML = ''; // Clear previous headers
    const properties = data.features.length > 0 ? Object.keys(data.features[0].properties) : [];
    properties.forEach(prop => {
        const th = document.createElement('th');
        th.textContent = prop;
        tableHeader.appendChild(th);
    });

    data.features.forEach(feature => {
        const tr = document.createElement('tr');

        // Parcourir les propriétés de l'entité
        for (const prop in feature.properties) {
        const td = document.createElement('td');
        td.textContent = feature.properties[prop]; // Afficher la valeur de la propriété
        tr.appendChild(td);
        }

        tableBody.appendChild(tr);
    });

    
    })
    .catch(error => console.error('Erreur lors du chargement des données GeoJSON :', error));
}