//--------------------------------------------------------------------------------------------------------------------------------------------
//chartjs
AOS.init();

function dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b;
};

function loadData(){
    var data = JSON.parse(sessionStorage.getItem("data"));
    var labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Anual'];
    var backgroundColors = [];
    var borderColors = [];
    for(var i = 0; i < 14; i++){
        var aux = dynamicColors();
        backgroundColors.push(aux + ", 0.2)");
        borderColors.push(aux + ", 1)");
    };

    var ctx = [];
    var dataSet = [];
    var config = [];

    for(var i=0; i<1; i++){ // in case you want to show all the graphs, we only show the first one.
        if (i==2){
            dataSet.push("error");
            ctx.push("Error");
            config.push("Error");
            continue;
        }
        dataSet.push({
            label: data[i][0] + "(" +data[i][1] + ")",
            data: data[i].slice(2,15),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
        });
        config.push({
            type: 'bar',
            data: {
                labels: labels,
                datasets: [dataSet[i]]
            },
            options: {
                title: {
                    display: true,
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
            }
        });
        ctx.push(document.getElementById('chart'+i).getContext('2d'));
        new Chart(ctx[i],config[i]);
    };
};

loadData();

var area = sessionStorage.getItem("area");
var consume = sessionStorage.getItem("consume");
var location = sessionStorage.getItem("location");
console.log(sessionStorage.getItem("area"));
console.log(sessionStorage.getItem("consume"));
console.log(sessionStorage.getItem("location"));

document.getElementById("address").innerHTML = "All these data correspond to the following address: <b>" + location + "</b>";

var rconsume = (consume*70)/13; // It has been assumed that 70% of the bill is equivalent to consumption and that in Spain the kwh has an average price of 0.13 euros.
rconsume = rconsume.toFixed(2);

var halfrc = rconsume/2; //50% of energy production to be covered

var kwhpanel = JSON.parse(sessionStorage.getItem("data"))[0][14]*320*30/1000; // the monthly production of a 320ww solar panel is calculated.

var panels = halfrc/kwhpanel; //numbers of panels
panels = panels.toFixed();

var cost = panels*2*350; // average cost, 2m^2 per panel and 350e per m^2

var anualsave = (consume*35/100)*12; // annual save
anualsave = anualsave.toFixed(2);

var payback = cost/anualsave; // payback
payback = payback.toFixed();

var save = (25-payback) * anualsave; //total save in 25 years

var production = consume*70/100*12;
production = production.toFixed(); 

var pollution = 0.28*production/1000;
pollution = pollution.toFixed(2);

var trees = pollution*1000 / 10;
trees = trees.toFixed();

document.getElementById("facts").innerHTML = "Based on your monthly bill(<b>" + consume + " Euros</b>), it can approximate the monthly consumption to: <b>" + rconsume + " Kwh monthly</b>.";
document.getElementById("panels").innerHTML = "Based on your free space (<b>" + area + " m2</b>) and your monthly consume (<b>" + rconsume + " Kwh</b>), we have calculated that the optimal way to cover <b>50%</b> your electricity consumption would be: <b>"+ panels+ " panels of 320w</b>.";
document.getElementById("cost").innerHTML = "The average price of such an installation can cost: <b>" + cost + " Euros</b>."
document.getElementById("amortization").innerHTML = "The payback time would be <b>"+ payback+" years</b>, since it implies a savings of <b>"+ anualsave +" euros</b> per year."
document.getElementById("amortization2").innerHTML = "Solar panels have a life span of 25 years, but can continue to operate for longer. From the payback time onwards, everything would be saved, since the installation has already been amortized. <b>"+save+" euros</b> of savings over the 25-year period."
document.getElementById("pollution").innerHTML = "You will be able to generate approximately <b>" + production +" kw per year</b> which would be equivalent to a reduction of <b>"+ pollution + " tonnes of carbon dioxide </b> emitted into the atmosphere. That would be equivalent to planting <b>" + trees + " trees</b> annualy." 
document.getElementById("payback").innerHTML = "Save " + anualsave +"€/Year";
document.getElementById("years").innerHTML = "" + payback +" Years for payback";
document.getElementById("payback25").innerHTML = "Save in total " + save +"€";

//--------------------------------------------------------------------------------------------------------------------------------------------
//Threejs
import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';

import { MTLLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/MTLLoader.js';
import {OBJLoader} from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/OBJLoader.js';
import {OrbitControls} from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer;

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
        .load( 'model3d.obj.mtl', function ( materials ) {
            materials.preload();
            new OBJLoader( manager )
                .setMaterials( materials )
                .setPath( './static/resources/' )
                .load( 'model3d.obj', function ( object ) {
                    object.position.y = - 10;
                    scene.add( object );
                }, onProgress, onError );

        } );
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(600,400);
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

init();
animate();