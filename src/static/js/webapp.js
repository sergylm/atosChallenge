//--------------------------------------------------------------------------------------------------------------------------------------------
//map
const map = L.map('map').setView([40, -3], 7);
map.zoomControl.setPosition('topright');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//--------------------------------------------------------------------------------------------------------------------------------------------
//geoman
map.pm.addControls({  
    position: 'topright',  
    drawMarker: false,
    drawPolyline: false,
    drawCircle: false,
    drawRectangle: false,
    drawCircleMarker: false,
}); 
$('#parcela').on("click", function(){
    if (window.geoJson != null){
        document.getElementById('card3').click();
        $.ajax({
            url: "polygon", 
            method: "POST",
            data : JSON.stringify({Data: window.geoJson}), 
            success: function (returned_data) { 
                // data = JSON.parse(returned_data);
                // pintar rectangulo circunscrito
                // L.geoJSON(data, {
                //     style: {color: '#FF0000'},
                // }).addTo(map);
            },
            error: function () {
            alert('An error occured');
            }
        }); 
    }
});

var aux = 0; 
$('#card4').on('click', function(){
    if(aux == 0){
        // init();
        // animate();
        aux = 1;
    }
})

map.on('pm:create', function(e){
    //último polígono dibujado
    window.geoJson = e.layer.toGeoJSON();
});

//--------------------------------------------------------------------------------------------------------------------------------------------
//Search-box

var GeoSearchControl = window.GeoSearch.GeoSearchControl;
var OpenStreetMapProvider = window.GeoSearch.OpenStreetMapProvider;
var ErsiProvider = window.GeoSearch.EsriProvider;

var providerErsi = new ErsiProvider();

var searchControl = new GeoSearchControl({
    provider: providerErsi,
    searchLabel: 'Address...',
    style: 'bar',
  });

map.addControl(searchControl);

//sacar search-box
document.getElementById('findbox').appendChild(
    //style: bar
    document.querySelector('.leaflet-control-container > .leaflet-geosearch-bar')
    //style: button | default
    //document.querySelector('.geosearch')
);

//csrf token
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

map.on('geosearch/showlocation', function(e) {
    var data = [{'latitude': e.location.y},{'longitude': e.location.x},{'name': e.location.label}];
    sessionStorage.setItem("location",data[2]['name']);
    document.getElementById('card2').click();
    $.ajax({
        url: "nasa", 
        method: "POST",
        data : JSON.stringify({Data: data}),
        success: function (rdata) { 
            data = JSON.parse(rdata);
            sessionStorage.setItem("data",JSON.stringify(data));
            // loadData(data[0]); 
        },
        error: function () {
          alert('An error occured');
        }
    });
});

$('#analysis').on('click', function(){
    sessionStorage.setItem("area",document.getElementById("area").value);
    sessionStorage.setItem("consume",document.getElementById("consume").value);
    window.location.href = "analysis";
})