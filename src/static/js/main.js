const map = L.map('map').setView([40.477778, -3.687778], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([40.477778, -3.687778]).addTo(map)
.bindPopup('Cuatro Torres')
.openPopup();

var GeoSearchControl = window.GeoSearch.GeoSearchControl;
var OpenStreetMapProvider = window.GeoSearch.OpenStreetMapProvider;

var provider = new OpenStreetMapProvider();

var searchControl = new GeoSearchControl({
    provider: provider,
    container: 'findbox',
    searchLabel: 'Introduce tu dirección',
    style: 'bar',
  });

map.addControl(searchControl);

map.on('geosearch/showlocation', function(e) {
    console.log('latitud: ',e.location.y, ' longitud: ', e.location.x, ' Nombre completo: ', e.location.label)
})

function geoCode(){
    console.log(document.getElementById("address").value);
}