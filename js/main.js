//set global variables
var map;
var cities, rivers, huc8, huc10, geojson, streamRels, mainChannels, hucRels;

//initial popup window
window.addEventListener("load", function () {
    this.setTimeout(
        function open(event) {
            document.querySelector(".popup").style.display = "block";
        },
        0
    )
});

//popup window interactions
document.querySelector("#close").addEventListener("click", function () {
    document.querySelector(".popup").style.display = "none";
});

document.querySelector("#letsGo").addEventListener("click", function () {
    document.querySelector(".popup").style.display = "none";
});


//create map
function createMap() {
    var map = L.map('map').setView([44.75, -90], 8);
    //create basemap and set zoom limits
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

    //call functions to add elements
    getData(map);
    checkboxes(map);
    geoCoder(map);
    legend.addTo(map);

};

//================================================================================================================
//add geocoder search function

function geoCoder(map) {

    var geocoder = L.Control.geocoder({ iconlabel: 'New Search', showUniqueResult: true, collapsed: true, placeholder: ' Enter a Location' }).addTo(map);

    // Add CSS style to the geocoder control element
    var geocoderControl = geocoder.getContainer();
    geocoderControl.style.backgroundColor = '#003356';
    geocoderControl.querySelector('input').style.color = '#FFFFFF';

    // gets geocoder lat long
    geocoder.on('markgeocode', function (event) {
        var latlng = event.geocode.center;
        latLng = [latlng.lat, latlng.lng]
    })

}

//================================================================================================================
//fetch and process geojsons and set initial style parameters

function getData(map) {
    fetch("data/cities.json")
        .then(function (response) {
            return response.json();
        })
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
        .then(function (json) {
            huc8 = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        fillColor: "none",
                        color: "purple",
                        weight: 4,
                        opacity: 0.7,
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
        .then(function (json) {
            rivers = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        color: "#3F97DD",
                        weight: (feature.properties.STREAM_ORD - feature.properties.STREAM_ORD ** 0.35),
                        className: 'riversClass'
                    }
                }
            });
        })

    fetch("data/mainChannels.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            mainChannels = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        color: "#00709d",
                        weight: (feature.properties.MAX_STREAM - feature.properties.MAX_STREAM ** 0.35),
                    }
                }
            });
        })


    fetch("data/greatLakes.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            greatLakes = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        fillColor: "none",
                        color: "#01665e",
                        weight: 8,
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
        .then(function (json) {
            mississippi = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        fillColor: "none",
                        color: "#8c510a",
                        weight: 8,
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
        .then(function (json) {
            stateDivide = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        color: "red",
                        weight: 9,
                        className: 'stateDivideClass'
                    }
                }
            });
        })


    //process the streamRels data to be used later
    function processData(data) {
        var attributes = [];
        for (var item in data.features) {
            attributes.push(data.features[item].properties)
        }
        return attributes;
    };

    fetch("data/streamRels.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            streamRels = processData(json)
        })

    //create huc info popup and set update parameters for hover interaction
    const info = L.control({ position: 'bottomleft' });

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function (props) {
        const contents = props ? `<h6><span style="color:#3b3b3b">HUC10 Name:</span> ${props.HUC10_NAME}
                <br/><span style="color:#3b3b3b">HUC8 Name: </span>${props.HUC8_NAME}
                <br/><span style="color:#3b3b3b">River Basin: </span>${props.RiverBasin}
                <br/><span style="color:#3b3b3b">Flow Destination: </span>${props.FlowDest}`
            : 'Hover over a Watershed</h6>';
        this._div.innerHTML = `<h4>Watershed Information</h4>${contents}`;
    };

    info.addTo(map)

    //================================================================================================================
    //highlight, dehighlight, and zoom to feature

    //highlight function
    function highlightFeature(e) {
        const layer = e.target;

        layer.setStyle({
            weight: 6,
            color: '#eaa40e',
        });

        info.update(layer.feature.properties);
    }

    //function to reset highlight to initial parameters
    function resetHighlight(e) {
        huc10.setStyle({
            weight: 1,
            opacity: 0.7,
            color: '#f2ac00',
        })
        info.update();
    }

    //function to zoom to feature and display information when a huc10 is clicked
    function zoomToFeature(e) {
        //reset huc10 style initially to remove previous color change
        huc10.resetStyle();
        //fly to the center of the selected huc10
        huc10Center = e.target.getBounds().getCenter();
        map.flyTo(huc10Center, 10.5);

        //color selected huc10
        e.target.setStyle({
            fillColor: "blue",
        });

        //add additional layers to map on selection and set layer order if present
        huc8.addTo(map);
        mississippi.bringToFront();
        greatLakes.bringToFront();
        stateDivide.bringToFront();
        huc10.bringToFront();
        document.getElementById("huc8box").checked = true;

        //set variable for name of selected huc 10
        hucName = e.target.feature.properties.HUC10_NAME
        //create array to store huc relationships
        var hucRels = [hucName];
        //find huc relationships in streamRels
        for (var item in streamRels) {
            if (hucName == streamRels[item].src_HUC10_NAME) {
                hucRels.push(streamRels[item].UpDwn + ' of ' + streamRels[item].nbr_HUC10_NAME)
            }
        }
        //create array of huc relationships
        var relCon = '';

        for (var i = 1; i < hucRels.length; i++) {
            relCon = relCon + hucRels[i] + '<br>'
        }

        if (relCon == '') {
            relCon = ['Not related to any additional watersheds in Wisconsin']
        }

        //create, update, and add popup to display huc relationsships
        const rels = L.control({ position: 'bottomright' });

        rels.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'rels');
            this.update();
            return this._div;
        };

        rels.update = function (props) {
            const elements = document.getElementsByClassName('rels leaflet-control');
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
            const relContent = '<h2>The <span id="currentHuc">' + hucRels[0] + '</span> watershed is: <br>' + relCon + '</h2>';
            this._div.innerHTML = `${relContent}`;
        };

        rels.addTo(map)
    }

    //add update layers based on zoom level
    map.on('zoomend', function () {
        if (map.getZoom() > 9.5 && map.hasLayer(rivers) == false) {
            map.addLayer(rivers);
            map.addLayer(mainChannels);
            map.addLayer(huc8);
            mississippi.bringToFront();
            greatLakes.bringToFront();
            stateDivide.bringToFront();
            huc10.bringToFront();
            document.getElementById("riverbox").checked = true;
            document.getElementById("huc8box").checked = true;
        }
        if (map.getZoom() < 8) {
            map.addLayer(mississippi);
            map.addLayer(greatLakes);
            map.addLayer(stateDivide);
            huc10.bringToFront();
            document.getElementById("dividebox").checked = true;
        }
    });

    //set interaction functions based on events
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }
};


//================================================================================================================
//add and remove layers via checkbox
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
                    mississippi.bringToFront();
                    greatLakes.bringToFront();
                    stateDivide.bringToFront();
                    huc10.bringToFront();
                }
                if (box.value == "rivers") {
                    rivers.addTo(map);
                    huc10.bringToFront();
                    mainChannels.addTo(map);
                }
                if (box.value == "divides") {
                    mississippi.addTo(map);
                    greatLakes.addTo(map);
                    stateDivide.addTo(map);
                    mississippi.bringToFront();
                    greatLakes.bringToFront();
                    stateDivide.bringToFront();
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
                    map.removeLayer(mainChannels);
                }
                if (box.value == "divides") {
                    map.removeLayer(mississippi);
                    map.removeLayer(greatLakes);
                    map.removeLayer(stateDivide);
                }

            }
        })
    })

    //uncheck all checkboxes except huc10 on page load
    UncheckAll();

    //reposition zoom control to bottom right
    map.removeControl(map.zoomControl);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);
}

//function to uncheck all checkboxes except the huc 10 checkbox on initial page load or reset
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
        '#efefef',
        '#bdbdbd',
        '#969696',
        '#737373',
        '#303030',
        '#000000']
    return d > 7 ? colorArray[5] :
        d > 6 ? colorArray[4] :
            d > 5 ? colorArray[3] :
                d > 4 ? colorArray[2] :
                    d > 3 ? colorArray[1] :
                        d > 2 ? colorArray[0] :
                            '#ffffff';
}

//create legend based on huc10 colors
var legend = L.control({ position: 'bottomleft' });

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'legend'),
        grades = [1, 2, 3, 4, 5, 6, 7, 8],
        labels = [];

    div.innerHTML = '<h2><u>HUC 10 Legend - Stream Order #</u></h2></b><p>Larger Numbers imply higher flow (i.e. downstream/larger streams)</b></p>'

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ';
        div.innerHTML +=
            '<i>' + grades[i] + '</i> ';
    }
    return div;
};

//styel function for huc10s
function style(feature) {
    return {
        fillColor: getColor(feature.properties.STREAM_ORD),
        weight: 1,
        opacity: 0.7,
        color: '#f2ac00',
        fillOpacity: (feature.properties.STREAM_ORD - 1) / 10
    };
}

//======================================================================================

document.addEventListener('DOMContentLoaded', createMap)