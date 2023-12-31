import {MarkerManager} from './marker.js'
import {initMap} from './init.js';
// import {FieldInit} from '/fields.js'
import {getData} from "./data.js";

let buildBox = false
const startDate = localStorage.getItem('startDate')
const endDate = localStorage.getItem('endDate')
const minLat = eval(localStorage.getItem('minLat'))
const minLng = eval(localStorage.getItem('minLng'))
const maxLat = eval(localStorage.getItem('maxLat'))
const maxLng = eval(localStorage.getItem('maxLng'))
const siteList = eval(localStorage.getItem('siteList'))
localStorage.removeItem('startDate')
localStorage.removeItem('endDate')
localStorage.removeItem('minLat')
localStorage.removeItem('minLng')
localStorage.removeItem('maxLat')
localStorage.removeItem('maxLng')
localStorage.removeItem('siteList')

const api_ep = "http://localhost:8000"
let api_call = `${api_ep}/maritimeapp/measurements/?format=json&level=15&reading=aod&type=daily`;
if (startDate && startDate !== 'null') {
    api_call += `&start_date=${startDate}`;
}

if (endDate && endDate !== 'null') {
    api_call += `&end_date=${endDate}`;
}

if (minLat && minLat !== 'null') {
    api_call += `&min_lat=${minLat}`;
}

if (minLng && minLng !== 'null') {
    api_call += `&min_lng=${minLng}`;
}

if (maxLat && maxLat !== 'null') {
    api_call += `&max_lat=${maxLat}`;
}

if (maxLng && maxLng !== 'null') {
    api_call += `&max_lng=${maxLng}`;
    buildBox = true
}

const api_url = `${api_ep}/maritimeapp/measurements/`
// Usage
// const url = '...'; // URL to fetch data from
const allResults = await getData(api_call);
const mapData = initMap();
const map = mapData.map;
const baseLayer = mapData.basemapLayer;
const markerLayer = new MarkerManager(map, baseLayer);
markerLayer.shareMarkerClass(markerLayer)
markerLayer.setSiteList(siteList);
markerLayer.addMarker(allResults);

if (buildBox) {
    markerLayer.FieldInit.minLat = minLat
    markerLayer.FieldInit.minLng = minLng
    markerLayer.FieldInit.maxLat = maxLat
    markerLayer.FieldInit.maxLng = maxLng

    markerLayer.drawRecAuto()
}
map.setView([0, 0], 0);


// console.log(allResults);
