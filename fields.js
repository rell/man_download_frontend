// import {getSitesData, latestOfSet} from './data.js';
// import {updateAOD, updateTime, getStartEndDateTime} from './components.js';
// import {initDropdown} from './init.js';

// This class is responsible for initializing and updating the various fields in the user interface


export class FieldInit
{
    constructor() {
        // Classes and Modules
        this.map = null;
        this.markerLayer = null;
        this.data = null;
        this.aod_selection = null;
        this.download_module = null;

        // Submission Fields
        this.siteList = null;
        this.siteDates = null;
        this.start_date = null;
        this.end_date = null;
        this.minLat = null;
        this.minLng = null;
        this.maxLat = null;
        this.maxLng = null;

        // Submission Datatypes
        this.lev20 = true
        this.lev15 = true
        this.lev10 = true


        //Cookies
        this.csrfCookie = null

        // Containers
        this.mapContainer = document.getElementById('map-container')
        this.mapContainer.style.width = '90vw'
        this.containerDiv = document.createElement('div');
        this.containerDiv.classList.add('column')
        this.fieldsContainer = document.createElement('div')
        this.fieldsContainer.classList.add('fields')
        this.fieldsContainer.style.width = '30vw'
        this.containerDiv.appendChild(this.fieldsContainer)


        // Setup
        this.setupFields();
        this.setupCookie();
        this.initiateListeners();

    }

    setDataSelections()
    {
        this.selectionContainer = document.createElement('div');

// Add a section heading using an h1 element
        const downloadLevelHeader = document.createElement('h1');
        downloadLevelHeader.textContent = 'Data Level';
        this.selectionContainer.appendChild(downloadLevelHeader);

// Create an object to store the selected options
        this.selectedOptions = {};

        const createRadioButton = (id, label, value) => {
            const radioButton = document.createElement('input');
            radioButton.type = 'radio';
            radioButton.id = id;
            radioButton.checked = true;
            // this.selectedOptions.push(value)
            this.selectedOptions[value] = true
            const radioButtonLabel = document.createElement('label');
            radioButtonLabel.textContent = label;
            radioButtonLabel.setAttribute('for', id);

            this.selectionContainer.appendChild(radioButton);
            this.selectionContainer.appendChild(radioButtonLabel);

            // Add a click event listener to the radio button
            radioButton.addEventListener('click', () => {
                if (this.selectedOptions[value]) {
                    this.selectedOptions[value] = false;
                    radioButton.checked = false;
                    `${this.value = false}`;

                    console.log(`Option "${label}" (${value}) removed.`);
                } else {
                    radioButton.checked = true
                    this.selectedOptions[value] = true;
                    `${this.value = true}`;
                    console.log(`Option "${label}" (${value}) selected.`);
                }
            });
        };

        createRadioButton('level20', 'Level 2.0', 'lev20');
        createRadioButton('level15', 'Level 1.5', 'lev15');
        createRadioButton('level10', 'Level 1.0', 'lev10');

        this.fieldsContainer.appendChild(this.selectionContainer);
    }

    setDataSelections3()
    {
        this.selectionContainer = document.createElement('div');

// Add a section heading using an h1 element
        const downloadLevelHeader = document.createElement('h1');
        downloadLevelHeader.textContent = 'Data Format';
        this.selectionContainer.appendChild(downloadLevelHeader);

// Create an object to store the selected options
        this.selectedOptions = {};

        const createRadioButton = (id, label, value) => {
            const radioButton = document.createElement('input');
            radioButton.type = 'radio';
            radioButton.id = id;
            radioButton.checked = true;
            // this.selectedOptions.push(value)
            this.selectedOptions[value] = true
            const radioButtonLabel = document.createElement('label');
            radioButtonLabel.textContent = label;
            radioButtonLabel.setAttribute('for', id);

            this.selectionContainer.appendChild(radioButton);
            this.selectionContainer.appendChild(radioButtonLabel);

            // Add a click event listener to the radio button
            radioButton.addEventListener('click', () => {
                if (this.selectedOptions[value]) {
                    this.selectedOptions[value] = false;
                    radioButton.checked = false;
                    `${this.value = false}`;

                    console.log(`Option "${label}" (${value}) removed.`);
                } else {
                    radioButton.checked = true
                    this.selectedOptions[value] = true;
                    `${this.value = true}`;
                    console.log(`Option "${label}" (${value}) selected.`);
                }
            });
        };

        createRadioButton('aod', 'AOD', 'aod');
        createRadioButton('sda', 'SDA', 'aod');

        this.fieldsContainer.appendChild(this.selectionContainer);
    }


    setDataSelections2()
    {
        this.selectionContainer = document.createElement('div');

// Add a section heading using an h1 element
        const downloadLevelHeader = document.createElement('h1');
        downloadLevelHeader.textContent = 'Data Types';
        this.selectionContainer.appendChild(downloadLevelHeader);

// Create an object to store the selected options
        this.selectedOptions = {};

        const createRadioButton = (id, label, value) => {
            const radioButton = document.createElement('input');
            radioButton.type = 'radio';
            radioButton.id = id;
            radioButton.checked = true;
            // this.selectedOptions.push(value)
            this.selectedOptions[value] = true
            const radioButtonLabel = document.createElement('label');
            radioButtonLabel.textContent = label;
            radioButtonLabel.setAttribute('for', id);

            this.selectionContainer.appendChild(radioButton);
            this.selectionContainer.appendChild(radioButtonLabel);

            // Add a click event listener to the radio button
            radioButton.addEventListener('click', () => {
                if (this.selectedOptions[value]) {
                    this.selectedOptions[value] = false;
                    radioButton.checked = false;
                    `${this.value = false}`;

                    console.log(`Option "${label}" (${value}) removed.`);
                } else {
                    radioButton.checked = true
                    this.selectedOptions[value] = true;
                    `${this.value = true}`;
                    console.log(`Option "${label}" (${value}) selected.`);
                }
            });
        };

        createRadioButton('series', 'series', 'series');
        createRadioButton('daily', 'daily', 'daily');
        createRadioButton('all_points', 'all points', 'all_points');

        this.fieldsContainer.appendChild(this.selectionContainer);
    }

    downloadButton()
    {
        this.submitButton = document.createElement('button')
        this.submitButton.classList.add('download')
        this.submitButton.type = 'submit'
        this.submitButton.textContent = 'Download SET'
        this.submitButton.style.position = 'absolute';
        this.submitButton.style.bottom = '10px';
        this.submitButton.style.width = '100%'

// Adjust the parent container's position to relative or absolute if necessary
        this.fieldsContainer.style.position = 'relative';
        this.fieldsContainer.style.height = '100vh'
        this.fieldsContainer.style.width = '100%'
        this.fieldsContainer.appendChild(this.submitButton)

    }
    setupFields()
    {
        this.downloadButton()
        this.setDataSelections()
        this.setDataSelections2()
        this.setDataSelections3()

        document.body.appendChild(this.containerDiv);
        this.mapContainer.appendChild(this.containerDiv)
    }

    async setupCookie() {
        let csrfToken = await this.getCSRFCookie()
        console.log(csrfToken['csrfToken'])
        this.csrfToken = csrfToken['csrfToken']
        console.log(this.csrfToken)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7); // Set the expiration to 7 days from now

        document.cookie = `csrftoken=${this.csrfToken}; SameSite=Strict; Secure; expires=${expirationDate.toUTCString()}`;
        // console.log(document.cookie)
    }

    getCSRFCookie() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://127.0.0.1:4956/maritimeapp/get-csrf-token/', true);
            xhr.onreadystatechange = async function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        console.log("HERE")
                        const csrfToken = JSON.parse(xhr.response)
                        // const csrfToken = xhr.getResponseHeader('csrfToken');
                        // console.log(csrfToken)
                        resolve(csrfToken);
                    } else {
                        reject(new Error('Failed to retrieve CSRF token'));
                    }
                }
            };
            xhr.send();
        });
    }

    handleBounds(minLat, minLng, maxLat, maxLng)
    {
        this.minLat = minLat
        this.minLng = minLng
        this.maxLat = maxLat
        this.maxLng = maxLng
    }

// Usage
//     getCSRFCookie()
// .then(csrfToken => {
//     // Use the CSRF token in your JavaScript code or set it as a cookie
//     console.log('CSRF Token:', csrfToken);
//     // Set the CSRF token as a cookie using JavaScript
//     document.cookie = 'csrftoken=' + csrfToken + '; SameSite=Strict; Secure';
// })
// .catch(error => {
//     console.error('Error:', error);
// });
    initiateListeners() {
        this.submitButton.addEventListener('click', async event => {
            // Disable the button
            this.submitButton.disabled = true;
            // Add a class to change the button style
            this.submitButton.classList.add('grayed-out');

            const url = 'http://127.0.0.1:4956/maritimeapp/download/'; // Update the URL to the appropriate endpoint
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.csrfToken,
                },
                body: JSON.stringify({ sites: {list: this.siteList, dates: this.siteDates},
                    bbox: {minLat: this.minLat, minLng: this.minLng, maxLat: this.maxLat, maxLng: this.maxLng},
                    date_range: {start_date: this.start_date, end_date: this.end_date},
                    data_types: {lev10: this.lev10, lev15: this.lev15, lev20: this.lev20}}), // Convert the body to a JSON string
            };

            console.log(options.body);

            try {
                const response = await fetch(url, options);
                if (response.ok) {
                    const blob = await response.blob();
                    console.log(blob)
                    console.log(blob.text())
                    const downloadLink = document.createElement('a');
                    const url = URL.createObjectURL(blob);
                    downloadLink.href = url;
                    // downloadLink.download = 'Maritime Dataset.gz';
                    downloadLink.click();
                    URL.revokeObjectURL(url);

                    // Enable the button and remove the grayed-out class
                    this.submitButton.disabled = false;
                    this.submitButton.classList.remove('grayed-out');
                } else {
                    console.error('Error:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);

                // Enable the button and remove the grayed-out class in case of an error
                this.submitButton.disabled = false;
                this.submitButton.classList.remove('grayed-out');
            }

            console.log(this.siteList);
        });
    }

    setMarkerClass(markerLayer) {
        this.markerLayer = markerLayer
    }
}