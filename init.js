export function initMap() {
    let basemapLayer, options, bounds;

    const basemapUrl =
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    basemapLayer = L.tileLayer(basemapUrl, {
        attribution: '<a href="https://openstreetmap.org">OpenStreetMap</a>',
        noWrap: true,
        tileSize: 256,
        errorTileUrl: '',
        errorTileTimeout: 5000,
    });

    const labelsUrl =
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';
    const labelsLayer = L.tileLayer(labelsUrl, {
        zIndex: 1,
        noWrap: true,
        tileSize: 256,
        errorTileUrl: '',
        errorTileTimeout: 500,
    });

    // Define the bounds for the map
    bounds = [
        [-90, -180], // Southwest coordinates
        [90, 180], // Northeast coordinates
    ];

    options = {
        layers: [basemapLayer, labelsLayer],
        minwidth: 200,
        minZoom: 2,
        maxZoom: 17,
        maxBounds: bounds,
    };

    // Create the Leaflet map with basemap layer and labels layer
    const map = L.map('map', options);

    // Return the map object and basemap layer
    return {
        map: map,
        basemapLayer: basemapLayer,
    };
}
export function initDropdown(id, options, fieldDescription, placeholder, disabledPlaceholder, group, toolTipContent)// create dropdown fields
{
    let dropdownHTML = `<div class="tooltip-container">
                               <div id='row'><label for=${id}>${fieldDescription}</label>
                               <div class="tooltip-trigger-container">
                               <span class="tooltip-trigger">?</span>
                               <div class="tooltip-content">
                               <p>${toolTipContent}</p>
                               </div>
                               </div>
                               </div>`;
    dropdownHTML += `<select id='${id}' name='${group}'>`;

    if (disabledPlaceholder) {
        dropdownHTML += `<option value='' selected>${placeholder}</option>`;
    }

    for (const option of options) {
        if (option.value.toString().includes(placeholder) && !disabledPlaceholder) {
            dropdownHTML += `<option value='${option.value}' selected>${option.label}</option>`;
        } else {
            dropdownHTML += `<option value='${option.value}'>${option.label}</option>`;
        }
    }

    dropdownHTML += `</select></div>`;

    return dropdownHTML;
}