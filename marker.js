// import { getAvg, getAvgUrl, getFullData, buildChartData, latestOfSet } from './data.js';
import { setColor } from './components.js';
import { drawGraph } from './chart.js';
// import { } // set all keys to data in a config file

export class MarkerManager {
  constructor(map, args=undefined, fieldsClass=undefined) {
    this.maxRadius = 30;
    this.fieldsClass = fieldsClass;
    this.defaultRadius = 4;
    this.minRadius = this.defaultRadius;
    this.map = map;
    this.currentArg = args;
    this.markersLayer = L.layerGroup().addTo(this.map);
    this.markersInactiveLayer = L.layerGroup().addTo(this.map);
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
    this.resetMap();
    // this.pulloutMenu();
    // this.zoomedMarkers();
  }


  addMarker(data) {
    this.sitedata = data;
    this.activeDepth = 'aod_500nm';

    const site = 'site';
    const name = 'name';
    const site_lat = 'Site_Latitude(Degrees)';
    const site_long = 'Site_Longitude(Degrees)';
    const site_date = 'Date(dd:mm:yyyy)';
    const site_time = 'Time(hh:mm:ss)';

    // Create an object to store the cluster layers
    const clusters = {};

    data.forEach(async (element) => {
      if (!element[this.activeDepth].toString().includes('-999')) {
        this.active.push(element[site][name].toLowerCase());

        const marker = L.circleMarker([element.latlng.coordinates[1], element.latlng.coordinates[0]], {
          closePopupOnClick: false,
          color: '#000000',
          weight: 0,
          riseOnHover: true,
          fillColor: setColor(element[this.activeDepth]),
          fillOpacity: 0.85,
          radius: parseFloat(element[this.activeDepth]) + this.defaultRadius,
        });

        const clusterName = element[site][name].toLowerCase();

        if (!clusters[clusterName]) {
          clusters[clusterName] = L.markerClusterGroup({
            spiderfyOnMaxZoom: false, // Disable spiderfying on max zoom
            zoomToBoundsOnClick: false, // Enable zooming to cluster bounds on click
            disableClusteringAtZoom: 12,
          });
        }

        // Add the marker to the corresponding cluster layer
        clusters[clusterName].addLayer(marker);
      }
    });

    const featureGroup = L.featureGroup();

    let markerCoordinates = [];

    const removePolyline = () => {
      featureGroup.eachLayer((layer) => {
        if (layer instanceof L.Polyline) {
          featureGroup.removeLayer(layer);
        }
      });
    };

    // this.map.on('zoomend', removePolyline);
    Object.values(clusters).forEach((clusterLayer) => {
      clusterLayer.on('zoomend', (event) => {

      })
    });
    // Iterate over each cluster layer
    Object.values(clusters).forEach((clusterLayer) => {
      // Add a click event to the cluster layer
      clusterLayer.on('clusterclick', (event) => {
        // Check if the cluster is already expanded
        if (event.layer._icon && event.layer._icon.classList.contains('marker-cluster-large')) {
          // Keep the cluster expanded without declustering
          event.layer.spiderfy();
        } else {
          // Clear the marker coordinates array
          markerCoordinates = [];

          // Iterate over the child layers of the cluster layer
          event.layer.getAllChildMarkers().forEach((layer) => {
            if (layer instanceof L.CircleMarker) {
              const latlng = layer.getLatLng();
              markerCoordinates.push([latlng.lat, latlng.lng]);
            }
          });

          // Remove the existing polyline
          removePolyline();

          // Create a new polyline using the marker coordinates
          const polyline = L.polyline(markerCoordinates, {
            color: 'red', // Customize the polyline color as desired
            weight: 2 // Customize the polyline weight as desired
          });

          // Add the polyline to the feature group
          featureGroup.addLayer(polyline);
        }
      });

      // Add the cluster layer to the feature group
      featureGroup.addLayer(clusterLayer);
    });

    // Add the feature group to the map
    featureGroup.addTo(this.map);
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
    console.log('data here',data)

    data.forEach( async element => {
      if (!element[this.activeDepth].toString().includes('-999'))
      {
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
              radius: parseFloat(element[this.activeDepth])+this.defaultRadius, // Set the radius of the marker using the active depth value of the current element
            });

        // Add the marker to the markers layer
        this.markersLayer.addLayer(marker);
      }
    });
    console.log(this.markersLayer)
    this.map.addLayer(this.markersLayer);
  }
  // // Create a new extended popup for the marker
  // const extendedPopup = L.popup({
  //   // autoPan: false,
  //   keepInView: true,
  //   closeButton: true,
  //   autoClose: true,
  //   offset: [0,-2]
  // }).setLatLng([element[site_lat],element[site_long]]);
  // // Bind the extended popup to the marker
  // marker.bindPopup(extendedPopup);
  //
  // // Create a new data popup for the marker
  // const dataPopup = L.popup({
  //   // autoPan: false,
  //   keepInView: true,
  //   closeButton: false,
  //   autoClose: true,
  //   offset: [0,-2]
  // }).setLatLng([element[site_lat],element[site_long]]);
  // // marker.bindPopup(dataPopup);
  //
  //
  // const hourAvg = getAvg(data, element[site_name], activeDepth)
  // const elementTime = element[site_time]
  // const elementDate = element[site_date]
  // const site = element[site_name]
  // const activeReading = parseFloat(element[activeDepth]).toPrecision(4)
  //
  // // Add an event listener to the marker for when it is clicked
  // marker.on('click', async () =>
  // {
  //   // Get the URL for the average data for the current site and time period
  //   if (parseInt(this.endDate[1])-1 !== this.startDate)
  //   {
  //     this.startDate[1] = parseInt(this.endDate[1])-1
  //   }
  //   const avgUrl = await getAvgUrl(site, this.endDate, this.startDate);
  //   // Get the full data for the current site and time period
  //   const timedSiteData = await getFullData(avgUrl)
  //   // Build a chart from the full data
  //   const chartData = buildChartData(timedSiteData, activeDepth, this.endDate, this.startDate);
  //   // Create a chart control from the chart data
  //   const chartControl = this.createMarkerChart(chartData)
  //   // Add the chart control to the markers layer
  //   chartControl.addTo(this.map);
  //   // Split the date string of the current element to get the last date
  //   const lastDate = elementDate.split(':')
  //
  //   // Update the date string of the object calling the addMarker function
  //   this.updateDateString(lastDate)
  //
  //   // const elementStateCountry = await getStateCountry(element[site_lat],element[site_long])
  //   // console.log(elementStateCountry)
  //   // const state = elementStateCountry[0]
  //   // const country = elementStateCountry[1]
  //   // Bind to tool tip click like purple map
  //   // fetch full data ( past hr avg  using data given in full data set)
  //   // refer to https://stackoverflow.com/questions/42604005/hover-of-marker-in-leaflet
  //
  //   // Update the content of the extended popup with information about the site and the most recent reading
  //   // extendedPopup.setContent(`<p><span style='font-weight:bold'>Site is online</span> </p>
  //   // <p>Most recent reading: <span style='font-weight:bold'>${activeReading}<span> </p>
  //   // <div id='testtype'><p> As of ${this.dateString} ${elementTime} UTC</p>
  //   // <p> Site: <a href='https://aeronet.gsfc.nasa.gov/new_web/photo_db_v3/${site}.html'>${site}</a> (${element[site_lat]},${element[site_long]})</p>
  //   // <p> <a href='https://aeronet.gsfc.nasa.gov/cgi-bin/print_web_data_v3${this.currentArg}&site=${element[site_name]}'>View Raw</a></p>
  //   // </div>`);
  //
  //   // Open the extended popup on the map
  //   // extendedPopup.openOn(this.map);
  //
  //   // Add an event listener to the marker for when the extended popup is closed
  //   marker.on('popupclose', event => {
  //     // Remove the chart control from the markers layer
  //     this.chartClear(chartControl)
  //   })
  // });
  //
  // // Add an event listener to the marker for when the mouse pointer hovers over it
  // marker.on('mouseover', async () =>
  // {
  //   // If wanting to output state, country of desired coordinates
  //   // const elementStateCountry = await getStateCountry(element[site_lat],element[site_long])
  //   // console.log(elementStateCountry)
  //   // const state = elementStateCountry[0]
  //   // const country = elementStateCountry[1]
  //
  //   // Split the date string of the current element to get the last date
  //   // dd/mm/yyyy
  //   const lastDate = elementDate.split(':')
  //   // Update the date string of the object calling the addMarker function
  //   this.updateDateString(lastDate);
  //
  //   // Update the content of the data popup with information about the site and the most recent reading
  //   dataPopup.setContent(`<div style='text-align:center'><p>Updated: <span style='font-weight:bold'>${this.dateString} ${elementTime} UTC<span></p>
  //   <p> Site: <a href='https://aeronet.gsfc.nasa.gov/new_web/photo_db_v3/${site}.html'>${site}</a>  (${element[site_long]}, ${element[site_lat]}) </p>
  //   <p>Latest: <span style='font-weight:bold'>${activeReading}</span></p></div>`)
  //
  //   // Open the data popup on the map
  //   dataPopup.openOn(this.map);
  // });
  //
  // // Add an event listener to the marker for when the mouse pointer is no longer hovering over it
  // marker.on('mouseout', () =>
  // {
  //   // Close the data popup if it is open
  //   dataPopup.isOpen() ? this.map.closePopup() : undefined;
  // });

  // This function takes in an array of site data and an active depth value
  addInactiveMarker(data, active_depth) {

    // Define keys for the inactive site data
    const site_lat = 'Latitude(decimal_degrees)';
    const site_long = 'Longitude(decimal_degrees)';
    const site_name = 'Site_Name';

    // Loop through each element in the site data array
    data.forEach( async element => {
      if (!(this.active.includes(element[site_name].toLowerCase())))
      {
        // Create a new circle marker for the current element
        const marker  = L.circleMarker([element[site_lat],element[site_long]],
            {
              closePopupOnClick: false,
              color: '#000000',
              weight: 0,
              riseOnHover:true,
              fillColor: setColor('inactive'), // Set the fill color of the marker using a setColor function
              fillOpacity: 0.40,
              radius: this.defaultRadius
            });

        // Create a new data popup for the marker
        const dataPopup = L.popup({
          // autoPan: false,
          keepInView: true,
          closeButton: false,
          autoClose: true,
          offset: [0,-2]
        }).setLatLng([element[site_lat],element[site_long]]);

        // Create a new extended popup for the marker
        let extendedPopup = L.popup({
          // autoPan: false,
          keepInView: true,
          closeButton: true,
          autoClose: false,
          offset: [0,-2]
        }).setLatLng([element[site_lat],element[site_long]]);
        marker.bindPopup(extendedPopup);

        // Add an event listener to the marker for when the mouse pointer hovers over it
        marker.on('mouseover', async () =>
        {
          // Update the content of the data popup with information about the inactive site
          dataPopup.setContent(`${element[site_name]} is currently inactive <br/>`)

          // Open the data popup on the map
          dataPopup.openOn(this.map)
        });

        // Add an event listener to the marker for when the mouse pointer is no longer hovering over it
        marker.on('mouseout', () =>
        {
          // Close the data popup if it is open
          dataPopup.isOpen() ? this.map.closePopup() : undefined;
        });

        // const timeString = `${getDate().toLocaleString('default', { month: 'long' })} ${getDate().getDate()} ${getDate().getFullYear()} UTC </p>`

        // Get the site name of the current element
        const site = element[site_name]

        // Add an event listener to the marker for when it is clicked
        marker.on('click', async () =>
        {
          // Get the URL for the average data for the current site and time period
          if (parseInt(this.endDate[1])-1 !== this.startDate)
          {
            this.startDate[1] = parseInt(this.endDate[1])-1
          }
          const avgUrl = await getAvgUrl(site, this.endDate, this.startDate);
          // Get the full data for the current site and time period
          const timedSiteData = await getFullData(avgUrl)
          // Build a chart from the full data
          const chartData = buildChartData(timedSiteData, active_depth, this.endDate, this.startDate);

          // Check if there is data in the chart data array
          if (chartData.length !== 0) {
            // Create a chart control from the chart data
            const chartControl = this.createMarkerChart(chartData)
            // Get the last element in the chart data array
            const lastElement = latestOfSet(chartData)
            // Split the date string of the last element to get the last date
            const lastDate = lastElement[0].x.split(':')

            // Update the date string of the object calling the addInactiveMarker function
            this.updateDateString(lastDate)

            // Update the content of the extended popup with information about the inactive site and the most recent reading
            extendedPopup.setContent(`
              <p><span style='font-weight:bold'>Site is currently offline</span> </p>
              <div id='testtype'><p> ${site} has been active within the past thirty days. <span style='font-weight:bold'>${this.dateString}</span> is when the most recent reading occured.</p>
              <p> Site: <a href='https://aeronet.gsfc.nasa.gov/new_web/photo_db_v3/${site}.html'>${site}</a>  (${element[site_lat]},${element[site_long]})</p>
              <p> <a href=${avgUrl}>View Raw</a></p>
              </div>`);

            // Open the extended popup on the map
            extendedPopup.openOn(this.map);

            // Add the chart control to the markers layer
            chartControl.addTo(this.map);

            // Add an event listener to the marker for when the extended popup is closed
            marker.on('popupclose', (event) => {

              // Remove the chart control from the markers layer
              this.chartClear(chartControl)
            })
          } else {

            // If there is no data in the chart data array, update the content of the extended popup with information about the inactive site and the lack of data
            extendedPopup.setContent(`<p><span style='font-weight:bold'>Site is currently offline</span> </p>
            <!-- <p>${site} has been <span style='font-weight:bold'>inactive</span> within the past thirty days. no data to display.</p> -->
            <p> Site: <a href='https://aeronet.gsfc.nasa.gov/new_web/photo_db_v3/${site}.html'>${site}</a> (${element[site_lat]},${element[site_long]})</p>`);
            extendedPopup.openOn(this.map)
          }

        });
        this.markersInactiveLayer.addLayer(marker);
      }
    });
  }

  showInactiveMarkers(allSiteData, opticalDepth)
  {
    this.addInactiveMarker(allSiteData, opticalDepth)
  }

  clearInactiveMarkers()
  {
    this.markersInactiveLayer.clearLayers()
  }

  // clearMarkers() {
  //   this.markersLayer.clearLayers();
  // }

  updateMarkers(currentSiteData, allSiteData, opticalDepth, currentArgs, ){
    this.total = 0;
    this.active =[];
    this.currentArg = currentArgs;
    this.markersLayer.clearLayers();
    this.markersInactiveLayer.clearLayers();
    this.addMarker(currentSiteData, opticalDepth);
    this.addInactiveMarker(allSiteData, opticalDepth);
  }

  changeMarkerRadius(args) {
    if(args !== null)
    {
      this.markersLayer.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker) {
          // If the layer's ID is not already set in originalRadius, save the original radius
          if (!(layer._leaflet_id in this.originalRadius)) {
            this.originalRadius[layer._leaflet_id] = layer.getRadius();
          }
          const sizeConstraint = parseInt(parseFloat(layer.getRadius()) + parseFloat(args)) >= this.minRadius && parseInt(parseFloat(layer.getRadius()) + parseFloat(args)) <= this.maxRadius
          // Update the layer's radius
          if (sizeConstraint)
          {
            layer.setRadius(parseFloat(layer.getRadius()) + parseFloat(args));
          }else
          {
            parseFloat(args) > 0 ? layer.setRadius(this.originalRadius[layer._leaflet_id]+((this.maxRadius)-5)) : layer.setRadius(this.originalRadius[layer._leaflet_id]+this.minRadius);
          }

        }
      });

      this.markersInactiveLayer.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker) {
          if (!(layer._leaflet_id in this.originalRadius)) {

            this.originalRadius[layer._leaflet_id] = layer.getRadius();
          }
          const sizeConstraint = parseInt(parseFloat(layer.getRadius()) + parseFloat(args)) >= this.minRadius && parseInt(parseFloat(layer.getRadius()) + parseFloat(args)) <= this.maxRadius
          // Update the layer's radius
          if (sizeConstraint)
          {
            layer.setRadius(parseFloat(layer.getRadius()) + parseFloat(args));
          }else
          {
            parseFloat(args) > 0 ? layer.setRadius(this.originalRadius[layer._leaflet_id]+((this.maxRadius)-5)) : layer.setRadius(this.originalRadius[layer._leaflet_id]+this.minRadius);
          }        }
      });
    }else // set radius back to default
    {
      this.markersLayer.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker) {
          if (layer._leaflet_id in this.originalRadius) {
            layer.setRadius(this.originalRadius[layer._leaflet_id]);
          }
        }
      });
      this.markersInactiveLayer.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker) {
          if (layer._leaflet_id in this.originalRadius) {
            layer.setRadius(this.originalRadius[layer._leaflet_id]);
          }
        }
      });
    }
  }

  // This method dynamically changes the size of markers when triggering zoomend -> leaflets zoom event
  // zoomedMarkers() {
  //   // Add a listener to the map for the 'zoomend' event
  //   this.map.on('zoomend', () => {
  //     const zoomLevel = this.map.getZoom();
  //     this.currentZoom = this.map.getZoom();
  //     if (this.currentZoom < this.previousZoom) {
  //       this.previousZoom = this.currentZoom;
  //       const opacity = this.currentZoom <= 5 ? 0.1 : 1; // Adjust this value to control the zoom opacity factor
  //       this.fieldsClass.radiusIncreased = false
  //       this.fieldsClass.siteCurrentlyZoomed = false
  //       this.markersInactiveLayer.eachLayer((layer) => {
  //         if (layer instanceof L.CircleMarker) {
  //           if (this.currentZoom > 4) {
  //             layer.setStyle({ stroke: true, weight: 3, opacity:opacity });
  //           } else {
  //             layer.setStyle({ stroke: false });
  //           }
  //         }
  //       });
  //       if (this.currentZoom >= 5)
  //       {
  //         this.changeMarkerRadius(-4)
  //       }
  //       else {
  //         this.changeMarkerRadius(null)
  //       }
  //     } else {
  //       this.previousZoom = this.currentZoom;
  //       this.fieldsClass.radiusIncreased = false
  //       this.fieldsClass.siteCurrentlyZoomed = false
  //       const opacity = this.currentZoom <= 5 ? 0.1 : 1; // Adjust this value to control the zoom opacity factor
  //       this.markersInactiveLayer.eachLayer((layer) => {
  //         if (layer instanceof L.CircleMarker) {
  //           if (this.currentZoom > 4) {
  //             layer.setStyle({ stroke: true, weight: 3, opacity: opacity });
  //           } else {
  //             layer.setStyle({ stroke: false });
  //           }
  //         }
  //       });
  //       if (this.currentZoom >= 5)
  //       {
  //         this.changeMarkerRadius(+4)
  //       }
  //       else
  //       {
  //         this.changeMarkerRadius(null)
  //       }
  //     }
  //   });
  // }

  setDate()
  {

  }

  createMarkerChart(chartData)
  {
    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'graph';
    chartCanvas.width = 7;
    chartCanvas.height = 3;
    this.chart = drawGraph(chartData, chartCanvas);
    const chartControl = L.control({position: 'bottomright'});
    chartControl.onAdd = function() {
      const container = L.DomUtil.create('div', 'leaflet-control-graph');
      container.appendChild(chartCanvas);
      return container;
    };
    return chartControl;
  }
  chartClear(chartControl)
  {
    const chartCanvas = chartControl.getContainer().querySelector('.leaflet-control-graph canvas');
    if (chartCanvas && chartCanvas.parentNode) {
      chartCanvas.parentNode.removeChild(chartCanvas);
    }
    this.map.removeControl(chartControl);
    this.chart = null;
  }

// This method creates a custom control to reset the map view and marker radius
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
          map.setView([0.0, 0.0], 3);
        });
        // Return the button element
        return button;
      }
    });
    this.map.addControl(new customControl());
  }

  // pulloutMenu() {
  //   var menuControl = L.Control.extend({
  //     options: {
  //       position: 'topright'
  //     },
  //     onAdd: function () {
  //       var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
  //       container.innerHTML = '<div class="menu-header"><button id="menu-toggle"><p class="filter-title">Filters</p></button></div><div class="menu-content">' + document.getElementById('form').innerHTML + '</div>';
  //       var menuContent = container.querySelector('.menu-content');
  //       menuContent.style.display = 'none';
  //       L.DomEvent.disableClickPropagation(container);
  //       L.DomEvent.on(container.querySelector('.menu-header'), 'click', function () {
  //         var menuContent = container.querySelector('.menu-content');
  //         if (menuContent.style.display === 'none') {
  //           menuContent.style.display = 'block';
  //         } else {
  //           menuContent.style.display = 'none';
  //         }
  //         L.DomUtil.hasClass(container, 'menu-open') ? L.DomUtil.removeClass(container, 'menu-open') : L.DomUtil.addClass(container, 'menu-open');
  //       });
  //       return container;
  //     }
  //   });
  //   this.map.addControl(new menuControl());
  // }

  updateDateString(date)
  {
    // before custom date is on
    // date format = mm/dd/yyyy
    // setting date
    date[0] = parseInt(date[0])+1;
    //setting month
    date[1] = parseInt(date[1])-1;
    this.dateString = new Date(Date.UTC(date[2], date[1], date[0])).toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });

  }
}