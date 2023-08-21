
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

const api_call = 'http://127.0.0.1:8000/maritimeapp/measurements/?level=15&page=1&reading=aod&type=daily'
const api_url = 'http://localhost:8000/maritimeapp/measurements/'

console.log("TEST WORKED")
// Usage
// const url = '...'; // URL to fetch data from
const allResults = await fetchAllResults(api_call);


const map = initMap();

const markerLayer = new MarkerManager(map);
// markerLayer.addMarker2(allResults);
markerLayer.addMarker(allResults);
map.setView([0,0], 0);

// console.log(allResults);
