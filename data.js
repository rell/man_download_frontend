// import {getDate} from './components.js';

// Latest data flow
// const date = getDate().toISOString().split('T')[0].split('-');
// const allSites = 'https://aeronet.gsfc.nasa.gov/aeronet_locations_v3.txt'
// const api_args = `?year=2023&month=6&day=11&AOD15=1&AVG=10&if_no_html=1`

const api_url = 'http://localhost:8000/maritimeapp/measurements/'
export async function getData(args)
{
    try
    {
        let allResults = [];
        let nextUrl = api_url.concat(args);
        const promises = [];

        while (nextUrl) {
            promises.push(fetch(nextUrl).then(response => response.json().then(data => {
                allResults = allResults.concat(data.results);
                nextUrl = data.next; // update nextUrl here
            })));
        }
        await Promise.all(promises);
        return allResults;

    } catch (error) {
        console.error(error);
        throw new Error('Failed to get data');
    }
}
