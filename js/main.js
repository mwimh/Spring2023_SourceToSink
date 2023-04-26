//insert code here!
//declare map variable globally so all functions have access
var map;
//var minValue;
//var dataStats = {};

//Creating The Basemap
function createMap() {
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

// Load and convert geojson data to be used
function getData() {
    // Load the data from the data folder
    fetch("data/IndustEmp.geojson")
        .then(function (response) {
            return response.json();
        })
        // Call functions to create the map data
        .then(function (json) {
            var attributes = processData(json);
        })
};

document.addEventListener('DOMContentLoaded', createMap)