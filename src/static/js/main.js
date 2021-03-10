const map = L.map('map').setView([40.477778, -3.687778], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker = L.marker([40.477778, -3.687778], {draggable:true, autoPan:true, interactive:true}).addTo(map) // Ahora el ping es arrastrable. Además si se meuve a los bordes el mapa se meuve con el.
.bindPopup('<p>Cuatro Torres</p>') //Se puede usar en los popup codigo HTML que se renderiza.
.openPopup();

var latlngs = [marker.getLatLng()];

var polygon = L.polygon(latlngs, {color: 'blue'}).addTo(map);  

marker.on('dragend', function(){
    polygon.addLatLng(marker.getLatLng());  
});



var GeoSearchControl = window.GeoSearch.GeoSearchControl;
var OpenStreetMapProvider = window.GeoSearch.OpenStreetMapProvider;
var ErsiProvider = window.GeoSearch.EsriProvider;

var provider = new OpenStreetMapProvider();
var providerErsi = new ErsiProvider();

var searchControl = new GeoSearchControl({
    provider: providerErsi,
    container: 'findbox',
    searchLabel: 'Introduce tu dirección',
    style: 'bar',
  });

map.addControl(searchControl);

//sacar search-box
document.getElementById('findbox').appendChild(
    document.querySelector('.leaflet-control-container > .leaflet-geosearch-bar')
    //document.querySelector('.geosearch')
);


//collapsible
var coll = document.getElementsByClassName('collapsible');
var i;

for(i = 0;i< coll.length; i++){
    coll[i].addEventListener('click', function(){
        this.classList.toggle('activate');
        var content = this.nextElementSibling;
        if(content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight+100 + 'px';
        }
    });
}

//csrf token
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (settings.type == 'POST' || settings.type == 'PUT' || settings.type == 'DELETE') {
            function getCookie(name) {
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        }
    }
});

map.on('geosearch/showlocation', function(e) {
    var data = [{'latitude': e.location.y},{'longitude': e.location.x},{'name': e.location.label}];

    $.ajax({
        url: "prueba", // Path of the python script to do the processing
        method: "POST", // Method to submit the HTTP request as, usually either POST or GET
        /*data: { // These are the POST parameters passed to the backend script
         latitude: e.location.y,
         longitude: e.location.x,
         name: e.location.label,
        },*/
        data : JSON.stringify({Data: data}),
        success: function (returned_data) { // Function to run if successful, with the function parameter being the output of the url script
          //alert('Here is the output: ' + returned_data);
        },
        error: function () { // Function to run if unsuccessful
          alert('An error occured');
        }
    });
    console.log('latitud: ',e.location.y, ' longitud: ', e.location.x, ' Nombre completo: ', e.location.label);
});


function geoCode() {
    console.log(document.getElementById("address").value);
}

