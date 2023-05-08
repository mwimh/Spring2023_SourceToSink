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

//Link Geocoder to search form
// Initialize the geocoder control and add it to the map
var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false,
  })//.addTo(map);
  console.log(geocoder);
  
  // Handle search button click event
  document.getElementById('search-btn').addEventListener('click', function() {
    // Get the search input value
    var searchValue = document.getElementById('search-input').value;
  
    // Use the geocoder to search for the location
    geocoder.geocode(searchValue, function(results) {
      if (results.length > 0) {
        // Center the map on the first result
        map.setView(results[0].center, 13);
      } else {
        alert('Location not found');
      }
    });
  });
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
    var map = L.map('map').setView([44.75, -90], 8);

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

    var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        maxZoom: 12,
        minZoom: 7,
        zoomControl: false,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(curMap);


    //call getData function*/
    getData(curMap);
    checkboxes(curMap);
    UncheckAll();

    var geocoder = L.Control.geocoder().addTo(curMap);

    geocoder.on('markgeocode', function(event) {
        var latlng = event.geocode.center;
        console.log(latlng.lat, latlng.lng);

        return(latlng.lat, latlng.lng);
    })
    

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
                        color: "grey",
                        weight: 1,
                        className: 'citiesClass'
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
                        fillColor: "white",
                        color: "orange",
                        fillOpacity: 0.4,
                        weight: 1,
                        className: 'huc10Class'
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
                        fillColor: "none",
                        color: "purple",
                        weight: 3,
                        className: 'huc8Class'
                    }
                }
            });
        })
        .then(self.name = "huc8class")

    fetch("data/streamsAll.json")
        .then(function (response) {
            return response.json();
        })
        // Call functions to create the map data
        .then(function (json) {
            rivers = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        color: "#3F97DD",
                        weight: (feature.properties.STREAM_ORD - feature.properties.STREAM_ORD ** 0.65),
                        className: 'riversClass'
                    }
                }
            });
        })


    fetch("data/greatLakes.json")
        .then(function (response) {
            return response.json();
        })
        // Call functions to create the map data
        .then(function (json) {
            greatLakes = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        fillColor: "green",
                        color: "black",
                        weight: 5,
                        fillOpacity: 0.1,
                        className: 'greatLakesClass'
                    }
                }
            });
        })

    fetch("data/mississippi.json")
        .then(function (response) {
            return response.json();
        })
        // Call functions to create the map data
        .then(function (json) {
            mississippi = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        fillColor: "purple",
                        color: "black",
                        weight: 5,
                        fillOpacity: 0.1,
                        className: 'mississippiClass'
                    }
                }
            });
        })

    fetch("data/stateDivide.json")
        .then(function (response) {
            return response.json();
        })
        // Call functions to create the map data
        .then(function (json) {
            stateDivide = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        color: "red",
                        weight: 8,
                        className: 'stateDivideClass'
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
                if (box.value == "divides") {
                    mississippi.addTo(map);
                    greatLakes.addTo(map);
                    stateDivide.addTo(map);
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
                if (box.value == "divides") {
                    map.removeLayer(mississippi);
                    map.removeLayer(greatLakes);
                    map.removeLayer(stateDivide);
                }

            }
        })
    })

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

}

function UncheckAll() {
    var w = document.getElementsByTagName('input');
    for (var i = 0; i < w.length; i++) {
        if (w[i].type == 'checkbox') {
            w[i].checked = false;
        }
    }
}

/*function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.HUC10_NAME) {
        layer.bindPopup(feature.properties.HUC10_NAME);
    }
}*/

/*function popupContent(feature, layer) {
    var popupContent = "<p><b>HUC Name:</b>" + feature.properties.HUC10_NAME "</p>",
    layer.bindPopup(popupContent, {
        //offset: new L.Feature(0, )
    })
}*/

/*
On selection of point on map or input of address:
1. Zoom to containing HUC 8 (map extents set to include entirity of HUC 8)
2. Highlight the selected HUC 10
3. Popup window below 'Options' displays info about HUC 10 (name, HUC 8 name, River System, where it flows,...)
4. Find upstream HUC 10s in relationship CSV file (one layer upstream only to avoid confusion of contributing flow from further upstream)
5. Highlight main river channel in river basin dark blue (by river system name)
6. Highlight channels in upstream HUCs in light blue
*/

document.addEventListener('DOMContentLoaded', createMap)