// Initialize map.
let myMap = L.map("map", {
  center: [37.64, -96.26],
  zoom: 3
});

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Access JSON data from url.
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

d3.json(url).then(response => {
  features = response.features

  // Create a circle marker for each earthquake in the features array.
  for (let i = 0; i < features.length; i++) {
      let feature = features[i];
      let location = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
      L.circle(location, {
          fillOpacity: feature.geometry.coordinates[2]/200,
          color: getColor(feature.properties.mag),
          radius: markerSize(feature.properties.mag)
      }).bindPopup(`<h2>${feature.properties.title}</h2>`).addTo(myMap);
  }
});

// Function which determines the size of the circle marker.
function markerSize(magnitude) {
  return Math.sqrt(magnitude) * 40000;
}

// Function which assigns a color based on the input magnitude.  
function getColor(d) {
  return d > 9 ? '#FF0D0D' :
         d > 7.5  ? '#FF4E11' :
         d > 6  ? '#FF8E15' :
         d > 4.5  ? '#FAB733' :
         d > 4   ? '#ABC334' :
                    '#69B34C';
}
// Create map legend.
let info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend".
info.onAdd = function() {
  let div = L.DomUtil.create("div", "legend");
  return div;
};

// Add the legend template to the map.
info.addTo(myMap);

// Generates the legend for the map.
document.querySelector(".legend").innerHTML = [
  "<section style=" + ">",
  "<h2>Legend</h2>",
  '<div style="display: flex; align-items: center;">' +
  '<p style="margin-right: 10px;">&gt;9</p>' +
  '<div style="width: 20px; height: 20px; background-color: #FF0D0D;"></div>' +
  '</div>',
  '<div style="display: flex; align-items: center;">' +
  '<p style="margin-right: 10px;">7.5-9</p>' +
  '<div style="width: 20px; height: 20px; background-color: #FF4E11;"></div>' +
  '</div>',
  '<div style="display: flex; align-items: center;">' +
  '<p style="margin-right: 10px;">6-7.5</p>' +
  '<div style="width: 20px; height: 20px; background-color: #FF8E15;"></div>' +
  '</div>',
  '<div style="display: flex; align-items: center;">' +
  '<p style="margin-right: 10px;">4.5-6</p>' +
  '<div style="width: 20px; height: 20px; background-color: #FAB733;"></div>' +
  '</div>',
  '<div style="display: flex; align-items: center;">' +
  '<p style="margin-right: 10px;">4-4.5</p>' +
  '<div style="width: 20px; height: 20px; background-color: #ABC334;"></div>' +
  '</div>',
  '<div style="display: flex; align-items: center;">' +
  '<p style="margin-right: 10px;">&lt;4</p>' +
  '<div style="width: 20px; height: 20px; background-color: #69B34C;"></div>' +
  '</div>',
  "</section>"
].join("");
