
import {MarkerManager} from './marker.js'
import { initMap } from './init.js';


async function fetchAllResults(url) {
    console.log(url)
    let allResults = [];
    let nextUrl = url;

    while (nextUrl) {
        console.log(nextUrl)
        const response = await fetch(nextUrl);
        const data = await response.json();

        allResults = allResults.concat(data.results);
        console.log(allResults)
        nextUrl = data.next; // update nextUrl here
    }

    return allResults;
}


const startDate  = localStorage.getItem('startDate')
const endDate  = localStorage.getItem('endDate')
const minLat  = localStorage.getItem('minLat')
const minLng  = localStorage.getItem('minLng')
const maxLat  = localStorage.getItem('maxLat')
const maxLng  = localStorage.getItem('maxLng')
const siteList = localStorage.getItem('siteList')
localStorage.removeItem('startDate')
localStorage.removeItem('endDate')
localStorage.removeItem('minLat')
localStorage.removeItem('minLng')
localStorage.removeItem('maxLat')
localStorage.removeItem('maxLng')
localStorage.removeItem('siteList')
console.log(startDate, endDate, minLat, minLng, maxLng, maxLat)
console.log(siteList)




// const api_call = 'http://127.0.0.1:8000/maritimeapp/measurements/?level=15&page=1&reading=aod&type=daily'
const api_call = `http://127.0.0.1:8000/maritimeapp/measurements/?level=15&page=1&reading=aod&type=daily&min_lat=${minLat}&min_lng=${minLng}&max_lat=${maxLat}&max_lng=${maxLat}`
const api_url = 'http://localhost:8000/maritimeapp/measurements/'

console.log("TEST WORKED")
// Usage
// const url = '...'; // URL to fetch data from
const allResults = await fetchAllResults(api_call);


const map = initMap();

const markerLayer = new MarkerManager(map);
markerLayer.setSiteList(siteList);
// markerLayer.addMarker2(allResults);
markerLayer.addMarker(allResults);
map.setView([0,0], 0);

// console.log(allResults);
