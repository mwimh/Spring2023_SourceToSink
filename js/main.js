//insert code here!
//declare map variable globally so all functions have access
var map;
var minValue;
var dataStats = {};

//step 1 create map
function createMap() {

    //create the map
    map = L.map('map', {
        center: [44.7575, -89.9441],
        zoom: 5
    });

    //add OSM base tilelayer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    //call getData function
    //getData(map);
};

document.addEventListener('DOMContentLoaded', createMap)
//ADDED TO REUPLOAD TO GITHUB