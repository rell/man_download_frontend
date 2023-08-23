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
    this.setsAtAOD = 0
    this.totalSets = 0
    this.endDate = null;
    this.startDate = null;
    this.emptyList = false
    this.currentPolylineGroup = null;
    this.activeDepth = 'aod_500nm';
    this.siteList = []
    this.defaultRadius = 10;
    this.map = map;
    this.markerGroups = {}
    this.featureGroup = L.featureGroup().addTo(this.map)
    this.resetMap();
  }


  addMarker(data) {
    if (this.siteList === null || this.siteList.length === 0)
    {
      this.siteList = []
      this.emptyList = true
    }

    console.log("SITE LIST",this.siteList, typeof this.siteList)
    this.totalSets > 0 ? this.totalSets = 0 :
    this.setsAtAOD > 0 ? this.setsAtAOD = 0 :
    data.forEach(async (element) => {
      this.totalSets++;

      if (this.emptyList || this.siteList.includes(element.site.name)) {
        this.setsCaptured++;
        //
        if (this.emptyList)
        {
          // console.log("TEST")
          this.siteList.push(element.site.name)
        }

        const clusterName = element.site.name.toLowerCase();

        if (!this.markerGroups[clusterName]) {
          this.markerGroups[clusterName] = L.featureGroup();
        }
        if (!element[this.activeDepth].toString().includes('-999')) {

          this.setsAtAOD++;
          const marker = L.circleMarker([element.latlng.coordinates[1], element.latlng.coordinates[0]], {
            closePopupOnClick: false,
            color: '#000000',
            weight: 0,
            riseOnHover: true,
            fillColor: setColor(element[this.activeDepth]),
            fillOpacity: 1,
            radius: parseFloat(element[this.activeDepth]) + this.defaultRadius,
          });

          let currentPolylineGroup = null;

          const polylines = [];

          marker.on('click', (event) => {
            const clickedMarker = event.target;
            let latlngs = [];
            if (this.currentPolylineGroup) {
              this.map.removeLayer(this.currentPolylineGroup);
            }

            Object.values(this.markerGroups).forEach((group) => {
              group.eachLayer((layer) => {
                // Set opacity to 1.0 for markers in the clicked group
                if (group === this.markerGroups[clusterName]) {
                  const {lat, lng} = layer.getLatLng();
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
                .domain([0, numSegments / 2, numSegments])
                .range(['rgb(255, 0, 0)', 'rgb(124, 122, 312)', 'rgb(0, 255, 0)']);
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
                segment.setStyle({zIndex: 1});
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

          // Add the marker to the corresponding marker group
          this.markerGroups[clusterName].addLayer(marker);
        }
      }
    });

    this.siteList = [...new Set(this.siteList)];
    console.log(this.siteList.length, this.setsAtAOD, this.totalSets)

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
    const customControl = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      onAdd: (map) => {
        // Create a button element
        var button = L.DomUtil.create('button', 'reset-button');
        button.innerHTML = 'Reset View';
        // Add a click event listener to the button
        L.DomEvent.on(button, 'click', () => {
          // this.changeMarkerRadius(null)
          map.setView([0, 0], 1);
        });
        // Return the button element
        return button;
      }
    });
    this.map.addControl(new customControl());
  }
    setSiteList(siteList) {
        this.siteList = eval(siteList)
    }
}
