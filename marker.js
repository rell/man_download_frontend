// import { getAvg, getAvgUrl, getFullData, buildChartData, latestOfSet } from './data.js';
import { setColor } from './components.js';
import { drawGraph } from './chart.js';
// import { } // set all keys to data in a config file

function generateGradientColors(startColor, endColor, numSteps) {
  const colorScale = d3.scaleLinear()
      .domain([0, numSteps - 1])
      .range([startColor, endColor]);

  const colors = [];

  for (let i = 0; i < numSteps; i++) {
    const color = colorScale(i);
    colors.push(color);
  }

  return colors;
}
export class MarkerManager {
  constructor(map, args = undefined, fieldsClass = undefined) {
    this.maxRadius = 30;
    this.fieldsClass = fieldsClass;
    this.defaultRadius = 10;
    this.minRadius = this.defaultRadius;
    this.map = map;
    this.currentArg = args;
    // this.markersLayer = L.layerGroup().addTo(this.map);
    // this.markersInactiveLayer = L.layerGroup().addTo(this.map);
    this.featureGroup = L.featureGroup().addTo(this.map)
    this.markerGroups = {}
    this.active = [];
    this.totalActive = this.active.length;
    this.chart = null;
    this.endDate = null;
    this.startDate = null;
    this.dateString = null;
    this.chartTimeLength = 30; // days to capture chart avgs
    this.currentZoom = undefined;
    this.previousZoom = undefined;
    this.sitedata = undefined;
    this.originalRadius = {};
    this.activeDepth = undefined;
    this.currentPolylineGroup = null;
    this.resetMap();
    // this.pulloutMenu();
    // this.zoomedMarkers();
  }


  addMarker(data) {
    this.sitedata = data;
    this.activeDepth = 'aod_500nm';
    const site = 'site';
    const name = 'name';

    data.forEach(async (element) => {

      if (!element[this.activeDepth].toString().includes('-999')) {
        const clusterName = element.filename.toLowerCase();

        if (!this.markerGroups[clusterName]) {
          this.markerGroups[clusterName] = L.featureGroup();
        }


        const marker = L.circleMarker([element.latlng.coordinates[1], element.latlng.coordinates[0]], {
          closePopupOnClick: false,
          color: '#000000',
          weight: 0,
          riseOnHover: true,
          fillColor: setColor(element[this.activeDepth]),
          fillOpacity: 0.85,
          radius: parseFloat(element[this.activeDepth]) + this.defaultRadius,
        });

        let currentPolylineGroup = null;

        const polylines = [];

        marker.on('click', (event) => {
          console.log(event.target.getLatLng());
          console.log(clusterName);
          const clickedMarker = event.target;
          let latlngs = [];
          console.log(currentPolylineGroup)
          if (this.currentPolylineGroup) {
            this.map.removeLayer(this.currentPolylineGroup);
          }

          Object.values(this.markerGroups).forEach((group) => {
            group.eachLayer((layer) => {
              // Set opacity to 1.0 for markers in the clicked group
              if (group === this.markerGroups[clusterName]) {
                const { lat, lng } = layer.getLatLng();
                latlngs.push([lat, lng]);

                layer.setStyle({
                  fillOpacity: 1.0,
                });
              } else {
                // Set opacity to 0.1 for markers in different groups
                layer.setStyle({
                  fillOpacity: 0.1,
                });
              }
            });
          });


          // Create a new layer group for the polyline segments
          const polylineGroup = L.layerGroup();


          const numSegments = latlngs.length - 1;
          const colorScale = d3
              .scaleLinear()
              .domain([0, numSegments - 1])
              .range(['rgb(255, 0, 0)', 'rgb(0, 255, 0)']);
          let segments_arr = []
          latlngs.forEach((latlng, index) => {
            const nextLatLng = latlngs[index + 1];

            if (nextLatLng && index !== numSegments) {

              const fraction = index / (numSegments);
              const color = colorScale(index);

              const segment = L.polyline([latlng, nextLatLng], {
                weight: 2,
                color: color,
              });
              segment.setStyle({ zIndex: 1 });
              segments_arr.push(segment);
              polylineGroup.addLayer(segment);
            }
          });

          event.target.polylineGroup = polylineGroup;
          this.currentPolylineGroup = polylineGroup;

          polylineGroup.addTo(this.map)



          const popupContent = `${element.date}`;
          const popup = L.popup().setContent(popupContent);
          event.target.bindPopup(popup).openPopup();


        });


        // Update the currentPolyline variable


          // Add a click event listener to the map
          // this.map.on('click', () => {
          //   // Reset all marker styles to default
          //   Object.values(markerGroups).forEach((group) => {
          //     group.eachLayer((layer) => {
          //       layer.setStyle({
          //         fillOpacity: 0.85,
          //       });
          //     });
          //   });
          // });
        // });



        // Add the marker to the corresponding marker group
        this.markerGroups[clusterName].addLayer(marker);
      }
    });

    // Create an empty feature group to store the marker groups
    const featureGroup = L.featureGroup();

    // Add each marker group to the feature group
    Object.values(this.markerGroups).forEach((markerGroup) => {
      featureGroup.addLayer(markerGroup);
    });

    // Add the feature group to the map
    featureGroup.addTo(this.map);

  }

  resetMap() {
    var customControl = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      onAdd: (map) => {
        // Create a button element
        var button = L.DomUtil.create('button', 'reset-button');
        button.innerHTML = 'Reset View';
        // Add a click event listener to the button
        L.DomEvent.on(button, 'click', () => {
          this.changeMarkerRadius(null)
          map.setView([0, 0], 1);
        });
        // Return the button element
        return button;
      }
    });
    this.map.addControl(new customControl());
  }

  addMarker2(data) {
    this.sitedata = data;
    this.activeDepth = 'aod_500nm';

    const site = 'site';
    const name = 'name';
    const site_lat = 'Site_Latitude(Degrees)';
    const site_long = 'Site_Longitude(Degrees)';
    const site_date = 'Date(dd:mm:yyyy)';
    const site_time = 'Time(hh:mm:ss)';
    console.log('data here', data)

    data.forEach(async element => {
      if (!element[this.activeDepth].toString().includes('-999')) {
        // Add the site name of the current element to the active array (used to create inactive sites)
        this.active.push(element[site][name].toLowerCase());
        // Create a new circle marker for the current element
        // console.log(element.latlng.coordinates[1],element.latlng.coordinates[0] )
        const marker = L.circleMarker([element.latlng.coordinates[1], element.latlng.coordinates[0]],
            {
              closePopupOnClick: false,
              color: '#000000',
              weight: 0,
              riseOnHover: true,
              fillColor: setColor(element[this.activeDepth]), // Set the fill color of the marker using a setColor function
              fillOpacity: .85,
              radius: parseFloat(element[this.activeDepth]) + this.defaultRadius, // Set the radius of the marker using the active depth value of the current element
            });

        // Add the marker to the markers layer
        this.markersLayer.addLayer(marker);
      }
    });
    console.log(this.markersLayer)
    this.map.addLayer(this.markersLayer);
  }
}
