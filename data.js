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
