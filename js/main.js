//insert code here!
//declare map variable globally so all functions have access

//var minValue;
//var dataStats = {};
var map;

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

//
var cities, rivers, huc8, huc10, geojson;

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

    var map = map

    var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        maxZoom: 12,
        minZoom: 7,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);


    //call getData function*/
    getData(map);
    checkboxes(map);



    var geocoder = L.Control.geocoder({iconlabel:'New Search', showUniqueResult:true, collapsed:false, placeholder:'Enter a Location'}).addTo(map);

    geocoder.on('markgeocode', function (event) {
        var latlng = event.geocode.center;
        console.log(latlng.lat, latlng.lng);

        return (latlng.lat, latlng.lng);
    })
    
};

function selectFeatureFromGEOJSON(latlng, huc10) {
    var latlng = (latlng.lat, latlng.lng);
    var selectedFeature = null;
    console.log(latlng);


}


function processData(data) {
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    /*//push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Visitors") > -1){
            attributes.push(attribute);
        };
    };*/

    //check result
    console.log(attributes);

    return attributes;
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

   /* function styleHuc(feature) {
        return {
            fillColor: 'blue',
            weight: 2,
            opacity: 1,
            color: 'orange',
            fillOpacity: 0.7
        };
    }*/

	function highlightFeature(e) {
		const layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		layer.bringToFront();

		info.update(layer.feature.properties);
	}

    function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

    fetch("data/huc10.json")
        .then(function (response) {
            return response.json();
        })
        // Call functions to create the map data
        .then(function (json) {
            huc10 = new L.geoJson(json, {
                style: style,
                onEachFeature
            })
            huc10.addTo(map);
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

    UncheckAll();

    map.removeControl(map.zoomControl);

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
    document.getElementById("huc10box").checked = true;
}


//============================================================================================
//functions to set and update fill colors of HUC10s

function getColor(d) {
    var colorArray = [
        '#f7f7f7',
        '#cccccc',
        '#969696',
        '#636363',
        '#252525']
    return d > 5 ? colorArray[4] :
        d > 4 ? colorArray[3] :
            d > 3 ? colorArray[2] :
                d > 2 ? colorArray[1] :
                    d > 1 ? colorArray[0] :
                        '#ffffff';
}

function updateColor(d) {
    var colorArray = [
        '#f1eef6',
        '#bdc9e1',
        '#74a9cf',
        '#2b8cbe',
        '#045a8d']
    return d > 5 ? colorArray[4] :
        d > 4 ? colorArray[3] :
            d > 3 ? colorArray[2] :
                d > 2 ? colorArray[1] :
                    d > 1 ? colorArray[0] :
                        '#ffffff';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.STREAM_ORD),
        weight: 1,
        opacity: 1,
        color: 'orange',
        fillOpacity: 0.2
    };
}

function updateStyle(feature) {
    return {
        fillColor: getColor(feature.properties.STREAM_ORD),
        weight: 1,
        opacity: 1,
        color: 'orange',
        fillOpacity: 0.2
    };
}
//======================================================================================

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#777',
        fillOpacity: 0.7
    });

    layer.bringToFront();
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}



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