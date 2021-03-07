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
    

function geoCode(){
    console.log(document.getElementById("address").value);
}