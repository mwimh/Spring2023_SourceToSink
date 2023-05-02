//insert code here!
//declare map variable globally so all functions have access

//var minValue;
//var dataStats = {};

window.addEventListener("load", function(){
    this.setTimeout(
        function open(event){
            document.querySelector(".popup").getElementsByClassName.display = "block";
        },
        1000
    )
});

document.querySelector("#close").addEventListener("click", function(){
    document.querySelector(".popup").display = "none";
});

// you want to get it of the window global
const provider = new GeoSearch.OpenStreetMapProvider();
console.log(provider)
//declares access token for Mapbox Studio Basemap


//
L.TopoJSON = L.GeoJSON.extend({
    addData: function (jsonData) {
        if (jsonData.type === 'Topology') {
            for (key in jsonData.objects) {
                geojson = topojson.feature(jsonData, jsonData.objects[key]);
                L.GeoJSON.prototype.addData.call(this, geojson);
            }
        }
        else {
            L.GeoJSON.prototype.addData.call(this, jsonData);
        }
    }
});

function createMap() {
    var map = L.map('map').setView([38.97416, -95.23252], 15);

    // Add tiles from the Mapbox Static Tiles API
    // (https://docs.mapbox.com/api/maps/#static-tiles)
    // Tiles are 512x512 pixels and are offset by 1 zoom level
    L.tileLayer(
        'https://api.mapbox.com/styles/v1/mjohnson58/clgy3afk400ok01pb5aqc3wqb/wmts?access_token=pk.eyJ1IjoibWpvaG5zb241OCIsImEiOiJjbGE4ZGw0c2kwMm9hM29wZXptaDBicGN6In0.AR9-PLqnMTKB16mUsF1YcA', {
            tileSize: 512,
            zoomOffset: -1,
            attribution: '© <a href="https://www.mapbox.com/contribute/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

    const search = new GeoSearch.GeoSearchControl({
        provider: new GeoSearch.OpenStreetMapProvider(),
      });
    console.log(search)

    L.addControl(search);
      console.log(addControl)
    //call getData function
    getData(map);
};

//Creating The Basemap
// function createMap() {
//     map = L.map('map', {
//         center: [45, -90],
//         zoom: 7.5
//     });
//     //add tilelayer
//     L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
//         maxZoom: 20,
//         attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
//     }).addTo(map);

//     /*const search = new GeoSearch.GeoSearchControl({
//         provider: new GeoSearch.OpenStreetMapProvider(),
//       });
      
//       map.addControl(search);*/

//     //call getData function
//     getData(map);
// };

// Load and convert geojson data to be used
function getData(map) {
    // Load the data from the data folder
    fetch("data/Hydrologic_Units_-_8_digit_(Subbasins).topojson")
        .then(function (response) {
            return response.json();
        })
        // Call functions to create the map data
        .then(function (json) {
            console.log(json)
            var test = new L.TopoJSON(json);
            test.addTo(map)
        })
    fetch("data/Hydrologic_Units_-_10_digit_(Watersheds).topojson")
        .then(function (response) {
            return response.json();
        })
        // Call functions to create the map data
        .then(function (json) {
            console.log(json)
            var test = new L.TopoJSON(json);
            test.addTo(map)
        })

    fetch("data/WI_StreamsAndRivers_3+.topojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            var jsonName = 'WI_StreamsAndRivers_3+';
            var streamStroke = json.objects;
            console.log(streamStroke);
            console.log(json);
            var rivers = new L.TopoJSON(json, {
                style: {
                    "color": "#ff7800",
                    "weight": 5,
                    "opacity": 0.65
                }
            });
            rivers.addTo(map);
        })
};

document.addEventListener('DOMContentLoaded', createMap)