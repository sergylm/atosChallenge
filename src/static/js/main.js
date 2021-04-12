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
        init();
        animate();
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
    document.getElementById('card2').click();
    $.ajax({
        url: "nasa", 
        headers: {'X-CSRFToken': csrftoken},
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
// var progress = document.getElementById('animationProgress');
// progress.style.display = 'none';
// var aux = false;

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
    // console.log(data);
    // console.log(data.slice(1,14));

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
            // animation: {
            //     duration: 1000,
            //     onProgress: function(animation) {
            //         if (progress.value != 1){
            //         progress.value = animation.currentStep / animation.numSteps;}
            //     }
            // }
        }
    };

    var myChart = new Chart(ctx, config);
    // progress.style.display = 'block';
};
//--------------------------------------------------------------------------------------------------------------------------------------------
//Threejs
import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';

import { MTLLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/MTLLoader.js';
import {OBJLoader} from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/OBJLoader.js';
import {OrbitControls} from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
const container  = document.getElementById('obj');                              

function init() {

    camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 400;

    // controls
    const controls = new OrbitControls (camera, container);
    controls.enablePan = false;
    controls.enableDamping = true;

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfe3dd);

    //ambientLigth
    const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );

    //pointLight
    const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );

    // model

    const onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
        }
    };

    const onError = function () { };
    const manager = new THREE.LoadingManager();

    new MTLLoader( manager )
        .setPath( './static/resources/' )
        .load( 'prueba.obj.mtl', function ( materials ) {
            materials.preload();
            new OBJLoader( manager )
                .setMaterials( materials )
                .setPath( './static/resources/' )
                .load( 'prueba.obj', function ( object ) {
                    object.position.y = - 10;
                    scene.add( object );
                }, onProgress, onError );

        } );
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(400,400);
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize );

}

export function onWindowResize() {

    windowHalfX = container.clientWidth / 2;
    windowHalfY = container.clientHeight / 2;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( container.clientWidth, container.clientHeight );

}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}