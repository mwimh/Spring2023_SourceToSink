//insert code here!
//declare map variable globally so all functions have access
var map;
//var minValue;
//var dataStats = {};

//step 1 create map
function createMap() {

    //create the map
    map = L.map('map', {
        center: [45, -90],
        zoom: 7.5
    });

    //add OSM base tilelayer
    L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'    
    }).addTo(map);

    //call getData function
    //getData(map);
};

document.addEventListener('DOMContentLoaded', createMap)