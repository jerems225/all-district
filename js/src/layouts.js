// Crée un contrôle Leaflet pour le cadre personnalisé
var bottomLeftControl = L.control({ position: "bottomleft" });
bottomLeftControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "bottom-left-control");
  div.innerHTML = `<div class="card" style="width: 25rem;">
                        <div class="card-body">
                            <h5 class="card-title">Attribut de la couche</h5>
                            <div class="table-responsive"> <!-- Ajout de la classe table-responsive pour une table scrollable -->
                                <table id="myTable" class="display ">
                                    <thead>
                                        <tr id="table-header">
                                        
                                        </tr>
                                    </thead>
                                    <tbody id="table-body">
                                    
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>`;
  return div;
}

var topLeftControl = L.control({ position: "topleft" });
topLeftControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "top-left-control");
  div.innerHTML = `<div class="card" style="width: 20rem;">
            <div class="card-body">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Couche <span id="nom_carte">Yamoussoukro</span>  
                    <span  style="color: black; margin-left: 70px;">Nombres :</span><span id="nombreCouche"></span>
                </h1>
                <select id="couches" class="form-control">
                    <option value="">Veuillez sélectionner une couche</option>
                </select>
            </div>
        </div>`; // Add icon
  return div;
};
