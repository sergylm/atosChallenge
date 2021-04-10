//CRSF
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken')

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

function getParcela(){
    $.ajax({
        url: "polygon", 
        method: "POST",
        data : JSON.stringify({Data: window.geoJson}),
        success: function (returned_data) { 
            data = JSON.parse(returned_data);
            //pintar rectangulo circunscrito
            L.geoJSON(data, {
                style: {color: '#FF0000'},
            }).addTo(map);
        },
        error: function () {
          alert('An error occured');
        }
    });

}

map.on('pm:create', function(e){
    //último polígono dibujado
    window.geoJson = e.layer.toGeoJSON();
});

//--------------------------------------------------------------------------------------------------------------------------------------------
//Search-box

var GeoSearchControl = window.GeoSearch.GeoSearchControl;
var OpenStreetMapProvider = window.GeoSearch.OpenStreetMapProvider;
var ErsiProvider = window.GeoSearch.EsriProvider;

var provider = new OpenStreetMapProvider();
var providerErsi = new ErsiProvider();

var searchControl = new GeoSearchControl({
    provider: providerErsi,
    searchLabel: 'Introduce tu dirección',
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
        url: "nasa", 
        method: "POST",
        data : JSON.stringify({Data: data}),
        success: function (returned_data) { 
            data = JSON.parse(returned_data);
            loadData(data[0]); 
        },
        error: function () {
          alert('An error occured');
        }
    });
});

//--------------------------------------------------------------------------------------------------------------------------------------------
//chartjs

window.Chart;
var ctx = document.getElementById('chart').getContext('2d');
var progress = document.getElementById('animationProgress');
progress.style.display = 'none';
var aux = false;

var dynamicColors = function() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b;
};

function loadData(data){
    var labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Anual'];
    var backgroundColors = [];
    var borderColors = [];
    console.log(data);
    console.log(data.slice(1,14));

    for(var i = 0; i < 14; i++){
        var aux = dynamicColors();
        backgroundColors.push(aux + ", 0.2)");
        borderColors.push(aux + ", 1)");
    };

    var dataSet = {
        label: data[0],
        data: data.slice(1,14),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
    };

    var config = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [dataSet]
        },
        options: {
            title: {
                display: true,
                text: 'NASA Solar Data'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            animation: {
                duration: 1000,
                onProgress: function(animation) {
                    if (progress.value != 1){
                    progress.value = animation.currentStep / animation.numSteps;}
                }
            }
        }
    };

    var myChart = new Chart(ctx, config);
    progress.style.display = 'block';
};
