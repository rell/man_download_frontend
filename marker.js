// import { getAvg, getAvgUrl, getFullData, buildChartData, latestOfSet } from './data.js';
import { setColor } from './components.js';
import { drawGraph } from './chart.js';
import { FieldInit } from "./fields.js";
import {getData} from "./data.js";

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
  FieldInit = new FieldInit;

  constructor(map, baseLayer, args = undefined) {
    this.FieldInit.setMarkerClass(self)
    this.setsAtAOD = 0
    this.totalSets = 0
    this.endDate = this.FieldInit.end_date;
    this.startDate = this.FieldInit.start_date;
    this.emptyList = false
    this.currentPolylineGroup = null;
    this.activeDepth = 'aod_500nm';
    this.siteList = []
    this.defaultRadius = 10;
    this.map = map;
    this.baseLayer = baseLayer
    this.markerGroups = {}
    this.featureGroup = L.featureGroup().addTo(this.map)
    this.api_call = null;
    this.outsideModified = false
    this.siteDates = {}
    // this.FieldInit.siteList = this.siteList
    // this.FieldInit.siteList = this.siteList;
    this.resetMap();
    this.InitDrawControl();

  }

  addMarker(data) {
    this.siteDates = {}
    // console.log(this.siteList)
    // if (this.siteList === null || this.siteList.length === 0) {
    //   this.siteList = [];
    //   this.emptyList = true;
    // }
    // console.log(this.siteList)

    // Clear existing marker groups and feature group
    Object.values(this.markerGroups).forEach((markerGroup) => {
      markerGroup.clearLayers();
    });
    this.featureGroup.clearLayers();

    this.totalSets > 0 ? (this.totalSets = 0) : this.setsAtAOD > 0 ? (this.setsAtAOD = 0) : null;
    // if (data.results)
    // {
    //   data = data.results
    // }
    data.forEach(async (element) => {

      this.totalSets++;
      console.log(this.emptyList)
      console.log(this.siteList)
      console.log(this.siteList.includes(element.site.name))

      if (this.emptyList || this.siteList.includes(element.site.name)) {
        this.setsCaptured++;

        if (this.emptyList) {
          this.siteList.push(element.site.name);

        }

        if (!(element.site.name in this.siteDates)) {
          // If the site name does not exist, create a new array with the current date
          this.siteDates[element.site.name] = [element.date];
        } else {
          // If the site name already exists, append the current date to the existing array
          this.siteDates[element.site.name].push(element.date);
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
    this.FieldInit.siteList = this.siteList;
    this.FieldInit.siteDates = this.siteDates

    // Clear the map
    this.map.eachLayer((layer) => {
      if (layer !== this.baseLayer) {
        this.map.removeLayer(layer);
      }
    });

    // Add each marker group to the map
    Object.values(this.markerGroups).forEach((markerGroup) => {
      markerGroup.addTo(this.map);
    });



  }
  resetMap() {
    const resetMap = L.Control.extend({
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
    this.map.addControl(new resetMap());
  }

  InitDrawControl()
  {
    this.drawnItems = new L.FeatureGroup().addTo(this.map);

    this.drawControl = new L.Control.Draw({
      draw: {
        rectangle: true,
        polyline: false,
        circle: false,
        circlemarker: false,
        polygon: false,
        marker: false
      },
      edit: {
        featureGroup: this.drawnItems
      }
    }).addTo(this.map);

    this.map.on(L.Draw.Event.CREATED, this.onRectangleCreated.bind(this));

  }

  async drawRecAuto() {
    if (
        this.FieldInit.minLat !== null &&
        this.FieldInit.minLng !== null &&
        this.FieldInit.maxLat !== null &&
        this.FieldInit.maxLng !== null
    ) {
      this.minLat = this.FieldInit.minLat;
      this.minLng = this.FieldInit.minLng;
      this.maxLat = this.FieldInit.maxLat;
      this.maxLng = this.FieldInit.maxLng;

      const southWest = L.latLng(this.minLat, this.minLng);
      const northEast = L.latLng(this.maxLat, this.maxLng);
      const bounds = L.latLngBounds(southWest, northEast);
      const rectangle = L.rectangle(bounds);

      await this.onRectangleCreated({ layer: rectangle });
    }
    else
    {
      this.minLat = this.FieldInit.minLat;
      this.minLng = this.FieldInit.minLng;
      this.maxLat = this.FieldInit.maxLat;
      this.maxLng = this.FieldInit.maxLng;

      this.createAPICall();
      this.data = await getData(this.api_call);
      this.addMarker(this.data)


    }
  }


  async onRectangleCreated(event) {
    const layer = event.layer;
    this.drawnItems.addLayer(layer);

    const bounds = layer.getBounds();
    const minLatLng = bounds.getSouthWest();
    const maxLatLng = bounds.getNorthEast();

    this.minLat = minLatLng.lat;
    this.minLng = minLatLng.lng;
    this.maxLat = maxLatLng.lat;
    this.maxLng = maxLatLng.lng;

    // Call the FieldInit method or perform any other desired actions with the captured bounds
    await this.FieldInit.handleBounds(this.minLat, this.minLng, this.maxLat, this.maxLng);
    this.FieldInit.minlatInput.value = this.minLat
    this.FieldInit.minlngInput.value = this.minLng
    this.FieldInit.maxlatInput.value = this.maxLat
    this.FieldInit.maxlngInput.value = this.maxLng
    this.FieldInit.updateSiteList()
    this.createAPICall();
    this.data = await getData(this.api_call);
    this.addMarker(this.data)


    // const bounds = L.latLngBounds(
    //     L.latLng(this.minLat, this.minLng),
    //     L.latLng(this.maxLat, this.maxLng)
    // );
    const transparentStyle = {
      color: 'red',
      weight: 2,
      fill: false,
      opacity: 100,
      interactive: false
    };

// Create a transparent rectangle layer
    const rectangle = L.rectangle(bounds, transparentStyle).addTo(this.map);

  }


  createAPICall(){
     this.api_call = 'http://127.0.0.1:4956/maritimeapp/measurements/?format=json&level=15&reading=aod&type=daily';
    if (this.startDate && this.startDate !== 'null') {

      this.api_call += `&start_date=${this.startDate}`;
    }
    if (this.endDate && this.endDate !== 'null') {

      this.api_call += `&end_date=${this.endDate}`;
    }
    if (this.minLat && this.minLat !== 'null') {

      this.api_call += `&min_lat=${this.minLat}`;
    }
    if (this.minLng && this.minLng !== 'null') {

      this.api_call += `&min_lng=${this.minLng}`;
    }
    if (this.maxLat && this.maxLat !== 'null') {

      this.api_call += `&max_lat=${this.maxLat}`;
    }
    if (this.maxLng && this.maxLng !== 'null') {

      this.api_call += `&max_lng=${this.maxLng}`;
    }

  }

  // evenListener() {
  //   this.minLng.addEventListener('change', async () => {
  //     if (this.minLng != null) {
  //       this.createAPICall()
  //       this.data = await getData(this.api_call)
  //       this.addMarker(this.data)
  //
  //     }
  //     console.log()
  //   })
  // }


  async updateMarkersFromFields() {
    this.minLat = this.FieldInit.minLat
    this.maxLat = this.FieldInit.maxLat
    this.maxLng = this.FieldInit.maxLng
    this.minLng = this.FieldInit.minLng
    this.startDate = this.FieldInit.start_date
    this.endDate = this.FieldInit.end_date

    this.createAPICall()
    this.data = await getData(this.api_call)
    // this.updateMarkers()
  }


  async updateMarkers() {
    this.minLat = this.FieldInit.minLat
    this.maxLat = this.FieldInit.maxLat
    this.maxLng = this.FieldInit.maxLng
    this.minLng = this.FieldInit.minLng
    this.startDate = this.FieldInit.start_date;
    this.endDate = this.FieldInit.end_date;

    if (
        this.FieldInit.minLat !== null &&
        this.FieldInit.minLng !== null &&
        this.FieldInit.maxLat !== null &&
        this.FieldInit.maxLng !== null
    )
    {
      await this.drawRecAuto()
    }
    else
    {
      this.createAPICall()
      console.log(this.api_call)

      this.data = await getData(this.api_call)
      // this.outsideModified = true
      this.addMarker(this.data)
    }
//     this.createAPICall()
//     this.data = await getData(this.api_call)
//     this.outsideModified = true
//     this.addMarker(this.data)
// //     console.log(this.siteList)
  }

  setSiteList(siteList) {

        this.siteList = eval(siteList)

        console.log(this.siteList)
  }
  shareMarkerClass(markerLayer){
    this.FieldInit.setMarkerClass(markerLayer)
  }
}
