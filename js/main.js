//insert code here!
//declare map variable globally so all functions have access

//var minValue;
//var dataStats = {};

window.addEventListener("load", function () {
    this.setTimeout(
        function open(event) {
            document.querySelector(".popup").style.display = "block";
        },
        0
    )
});

document.querySelector("#close").addEventListener("click", function () {
    document.querySelector(".popup").style.display = "none";
});

document.querySelector("#letsGo").addEventListener("click", function () {
    document.querySelector(".popup").style.display = "none";
});

// you want to get it of the window global
/*const provider = new GeoSearch.OpenStreetMapProvider();
console.log(provider)*/
//declares access token for Mapbox Studio Basemap


//
var cities, rivers, huc8, huc10;

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
    var map = L.map('map').setView([45, -90], 8);

    //map boundaries
    var northW = L.latLng(49, -96);
        southE = L.latLng(40, -84);
    var bounds = L.latLngBounds(northW, southE);

    map.setMaxBounds(bounds);
    map.on('drag', function () {
        map.panInsideBounds(bounds, {
            animate: false
        });
    });

    var curMap = map

    var OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 6.5,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(curMap);

    var provider = new window.GeoSearch.OpenStreetMapProvider();
    var searchControl = new window.GeoSearch.GeoSearchControl({
        provider: provider,
        style: 'button'
    });
   
    
    const search = new GeoSearch.GeoSearchControl({
        provider: new GeoSearch.OpenStreetMapProvider(),
      });
    console.log(search)

    L.addControl(search);
    console.log(addControl)
    //call getData function*/
    getData(curMap);
    checkboxes(curMap);
    curMap.addControl(searchControl);
    console.log(searchControl);
};

// Load and convert geojson data to be used
function getData(map) {
    fetch("data/cities.json")
        .then(function (response) {
            return response.json();
        })
        // Call functions to create the map data
        .then(function (json) {
            cities = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        fillColor: "red",
                        color: "white"
                    }
                }
            });
        })


    fetch("data/huc10.json")
        .then(function (response) {
            return response.json();
        })
        // Call functions to create the map data
        .then(function (json) {
            huc10 = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        fillColor: "none",
                        color: "grey"
                    }
                }
            });
        })

    fetch("data/huc8.json")
        .then(function (response) {
            return response.json();
        })
        // Call functions to create the map data
        .then(function (json) {
            huc8 = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        fillColor: "grey",
                        color: "white",
                        weight: 5
                    }
                }
            });
        })

    fetch("data/rivers.json")
        .then(function (response) {
            return response.json();
        })
        // Call functions to create the map data
        .then(function (json) {
            rivers = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        color: "blue",
                        //weight: 3
                        weight: (feature.properties.STREAM_ORD-3)

                    }
                }
            });
        })

};

function checkboxes(map) {
    document.querySelectorAll(".checkbox").forEach(function (box) {
        box.addEventListener("change", function () {
            if (box.checked) {
                if (box.value == "cities") {
                    cities.addTo(map);
                }
                if (box.value == "huc10") {
                    huc10.addTo(map);
                }
                if (box.value == "huc8") {
                    huc8.addTo(map);
                }
                if (box.value == "rivers") {
                    rivers.addTo(map);
                }

            }
            else {
                if (box.value == "cities") {
                    map.removeLayer(cities);
                }
                if (box.value == "huc10") {
                    map.removeLayer(huc10);
                }
                if (box.value == "huc8") {
                    map.removeLayer(huc8);
                }
                if (box.value == "rivers") {
                    map.removeLayer(rivers);
                }

            }
        })
    })
}

document.addEventListener('DOMContentLoaded', createMap)