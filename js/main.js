var map;
var cities, rivers, huc8, huc10, geojson;


//initial popup window
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


//create map
function createMap() {
    var map = L.map('map').setView([44.75, -90], 8);

    var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        maxZoom: 12,
        minZoom: 7,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    //set map boundaries
    var northW = L.latLng(49, -96);
    southE = L.latLng(40, -84);
    var bounds = L.latLngBounds(northW, southE);
    map.setMaxBounds(bounds);
    map.on('drag', function () {
        map.panInsideBounds(bounds, {
            animate: false
        });
    });

    //call functions
    getData(map);
    checkboxes(map);
    geoCoder(map);

};

//================================================================================================================
//add geocoder search function

function geoCoder(map) {

    var geocoder = L.Control.geocoder({ iconlabel: 'New Search', showUniqueResult: true, collapsed: false, placeholder: ' Enter a Location' }).addTo(map);

    // Add CSS style to the geocoder control element
    var geocoderControl = geocoder.getContainer();
    geocoderControl.style.backgroundColor = '#74a9cf';
    geocoderControl.querySelector('input').style.color = 'white';


    geocoder.on('markgeocode', function (event) {
        var latlng = event.geocode.center;
        console.log(latlng.lat, latlng.lng);

        return (latlng.lat, latlng.lng);
    })

}

//================================================================================================================
//add hover function

/*// control that shows state info on hover
const info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    const contents = props ? `<b>${props.name}</b><br />${props.density} people / mi<sup>2</sup>` : 'Hover over a state';
    this._div.innerHTML = `<h4>US Population Density</h4>${contents}`;
};

info.addTo(map)*/

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


//================================================================================================================
//Process geojsons

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

    const info = L.control({position: 'bottomleft'});

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function (props) {
        const contents = props ? `<b>HUC10 Name:</b> ${props.HUC10_NAME}
                <br/><b>HUC8 Name: </b>${props.HUC8_NAME}
                <br/><b>River Basin: </b>${props.RiverBasin}
                <br/><b>Flow Destination: </b>${props.FlowDest}`
            : 'Hover over a Watershed';
        this._div.innerHTML = `<h4>Watershed Information</h4>${contents}`;
    };

    info.addTo(map)

    //================================================================================================================
    //highlight, dehighlight, and zoom to feature

    function highlightFeature(e) {
        const layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#eaa40e',
        });

        info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
        huc10.resetStyle(e.target);
        info.update();
    }

    function zoomToFeature(e) {
        huc10Center = e.target.getBounds().getCenter();
        map.flyTo(huc10Center, 10.5);
    }

    map.on('zoomend', function () {
        if (map.getZoom() > 9.5 && map.hasLayer(rivers) == false) {
            map.addLayer(rivers);
            document.getElementById("riverbox").checked = true;
        }
        if (map.getZoom() < 10.5 && map.hasLayer(rivers)) {
            map.removeLayer(rivers);
            document.getElementById("riverbox").checked = false;
        }
    });

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

};

//================================================================================================================
//add layers via checkbox

function checkboxes(map) {
    document.querySelectorAll(".checkbox").forEach(function (box) {
        box.addEventListener("change", function () {
            if (box.checked) {
                if (box.value == "cities") {
                    cities.addTo(map);
                    huc10.bringToFront();
                }
                if (box.value == "huc10") {
                    huc10.addTo(map);
                    huc10.bringToFront();
                }
                if (box.value == "huc8") {
                    huc8.addTo(map);
                    huc10.bringToFront();
                }
                if (box.value == "rivers") {
                    rivers.addTo(map);
                    huc10.bringToFront();
                }
                if (box.value == "divides") {
                    mississippi.addTo(map);
                    greatLakes.addTo(map);
                    stateDivide.addTo(map);
                    huc10.bringToFront();
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



/*
On selection of point on map or input of address:
1. Zoom to containing HUC 8 (map extents set to include entirity of HUC 8)
2. Highlight the selected HUC 10
3. Popup window below 'Options' displays info about HUC 10 (name, HUC 8 name, River System, where it flows,...)
4. Find upstream HUC 10s in relationship CSV file (one layer upstream only to avoid confusion of contributing flow from further upstream)
5. Highlight main river channel in river basin dark blue (by river system name)
6. Highlight channels in upstream HUCs in light blue
*/

//map.attributionControl.addAttribution('Shapefile data &copy; <a href="https://data-wi-dnr.opendata.arcgis.com/">WI DNR GIS Portal</a>');

document.addEventListener('DOMContentLoaded', createMap)