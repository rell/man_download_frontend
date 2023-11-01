// import {getDate} from './components.js';
//
// Latest data flow
// const date = getDate().toISOString().split('T')[0].split('-');
// const allSites = 'https://aeronet.gsfc.nasa.gov/aeronet_locations_v3.txt'
// const api_args = `?year=2023&month=6&day=11&AOD15=1&AVG=10&if_no_html=1`

export async function getData(url)
{
    try
    {
    let nextUrl = url;
    let allResults = [];

    while (nextUrl) {
        console.log(nextUrl)
        const response = await fetch(nextUrl);
        const data = await response.json();

        allResults = allResults.concat(data.results);
        console.log(allResults)
        nextUrl = data.next; // update nextUrl here
    }

    return allResults;

    } catch (error) {
        console.error(error);
        throw new Error('Failed to get data');
    }
}
