// import {getSitesData, latestOfSet} from './data.js';
// import {updateAOD, updateTime, getStartend_dateTime} from './components.js';
// import {initDropdown} from './init.js';

// This class is responsible for initializing and updating the various fields in the user interface


export class FieldInit {
    api_ep = "http://localhost:8000";

    constructor() {
        this.selectedOptions = {};

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

        this.tempListItems = [];
        this.searchActive = false;


        //Cookies
        this.csrfCookie = null

        // Containers
        this.mapContainer = document.getElementById('map-container')
        this.mapContainer.style.width = '100vw'
        this.containerDiv = document.createElement('div');
        this.containerDiv.classList.add('column')
        this.containerDiv.style.width = 'auto';
        this.containerDiv.style.position = 'relative';
        // this.containerDiv.style.justifyContent = 'flex-end';
        this.containerDiv.style.right = '0'
        // this.containerDiv.style.width = '20vw'
        // this.containerDiv.style.right = '0';
        // this.containerDiv.style.overflowY = 'scroll';
        // this.containerDiv.style.display = 'absolute';
        this.containerDiv.style.overflowY = 'auto';
        this.fieldsContainer = document.createElement('div')
        this.fieldsContainer.style.padding = '10px 25px 10px 25px'
        this.fieldsContainer.classList.add('fields')
        this.fieldsContainer.style.minWidth = '500px'

        // this.fieldsContainer.style.width
        // Adjust the parent container's position to relative or absolute if necessary
        // this.fieldsContainer.style.position = 'flex';
        // this.fieldsContainer.style.height = '100vh'
        // this.fieldsContainer.style.overflow = 'scroll'
        this.containerDiv.appendChild(this.fieldsContainer)


        // Setup
        this.setupFields();
        this.setupCookie();
        this.submissionListener();


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
            xhr.open('GET', `${this.api_ep}/maritimeapp/get-csrf-token/`, true);
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

    setupFields() {
        this.fileDataModificationSection()
        this.fileOptionSelection()
        document.body.appendChild(this.containerDiv);
        this.mapContainer.appendChild(this.containerDiv)
    }

    setMarkerClass(markerLayer) {
        this.markerLayer = markerLayer
    }


    fileOptionSelection() {
        this.fileOptionContainer = document.createElement('div')
        this.fileOptionContainer.style.padding = '25px 10px 25px 10px'
        this.fileOptionContainer.classList.add('file-options')
        // this.fieldsContainer.style.padding = '25px 10px 25px 10px'
        this.fieldsContainerHeader = document.createElement('h1')
        this.fieldsContainerHeader.textContent = 'File Options'
        this.fileOptionContainer.appendChild(this.fieldsContainerHeader)
        this.fieldsContainer.appendChild(this.fileOptionContainer)

        this.dataTypeSelection()
        this.readingTypeSelection()
        this.qualityTypeSelection()
        this.downloadButton()

    }


    fileDataModificationSection() {
        this.modifySectionContainer = document.createElement('div');
        this.modifySectionContainer.classList.add('modification-section');
        this.modifySectionContainer.style.padding = '25px 10px 25px 10px'
        this.modifySectionContainerHeader = document.createElement('h1');
        this.modifySectionContainerHeader.textContent = 'Data Modification';
        this.modifySectionContainer.appendChild(this.modifySectionContainerHeader);
        this.fieldsContainer.appendChild(this.modifySectionContainer);
        this.dateSelection();
        this.boundSelection();
        this.siteSelection();
        this.updateSiteList()
        //
    }

    fetchData(url) {
        // print(url)
        console.log(url)
        return fetch(url)
            .then(async response => await response.json());
    }

    fetchMeasurementsData() {
        let api_args;
        // console.log(this.start_date)
        if (this.minLat !== null && this.minLng !== null && this.maxLat !== null && this.maxLng !== null && this.start_date !== '' && this.end_date !== '') {
            api_args = `${this.api_ep}/maritimeapp/measurements/sites/?format=json&min_lat=${this.minLat}&min_lng=${this.minLng}&max_lat=${this.maxLat}&max_lng=${this.maxLng}&start_date=${this.start_date}&end_date=${this.end_date}`;
        } else if (this.minLat !== null && this.minLng !== null && this.maxLat !== null && this.maxLng !== null && this.end_date !== '') {
            api_args = `${this.api_ep}/maritimeapp/measurements/sites/?format=json&min_lat=${this.minLat}&min_lng=${this.minLng}&max_lat=${this.maxLat}&max_lng=${this.maxLng}&end_date=${this.end_date}`;

        } else if (this.minLat !== null && this.minLng !== null && this.maxLat !== null && this.maxLng !== null && this.start_date !== '') {
            api_args = `${this.api_ep}/maritimeapp/measurements/sites/?format=json&min_lat=${this.minLat}&min_lng=${this.minLng}&max_lat=${this.maxLat}&max_lng=${this.maxLng}&start_date=${this.start_date}`;

        } else if (this.minLat !== null && this.minLng !== null && this.maxLat !== null && this.maxLng !== null) {
            api_args = `${this.api_ep}/maritimeapp/measurements/sites/?format=json&min_lat=${this.minLat}&min_lng=${this.minLng}&max_lat=${this.maxLat}&max_lng=${this.maxLng}`;

        } else if (this.start_date !== null && this.end_date !== null) {
            api_args = `${this.api_ep}/maritimeapp/measurements/sites/?format=json&start_date=${this.start_date}&end_date=${this.end_date}`;
        } else if (this.end_date !== null) {
            api_args = `${this.api_ep}/maritimeapp/measurements/sites/?format=json&end_date=${this.end_date}`;

        } else if (this.start_date !== null) {
            api_args = `${this.api_ep}/maritimeapp/measurements/sites/?format=json&start_date=${this.start_date}`;

        } else {
            console.log("running here line 366")
            api_args = `${this.api_ep}/maritimeapp/sites/`
        }
        console.log(api_args)
        return this.fetchData(api_args);
    }

    processData(data) {
        this.clearList();
        // console.log(data.results)
        if (data.results === undefined) {
            // console.log(data)
            data.forEach(item => {

                // console.log(item.site_name)
                // console.log(item)
                // console.log("RUNNIN")
                const listItem = document.createElement('li');
                listItem.classList.add('item');

                // Create the site name element
                const siteName = document.createElement('h3');
                siteName.textContent = item.site_name;
                listItem.appendChild(siteName);

                // Create additional information elements
                const info1 = document.createElement('p');
                info1.innerHTML = `MAN Site: <a href="https://aeronet.gsfc.nasa.gov/new_web/cruises_v3/${item.site_name}.html" target="_blank" ">${item.site_name}</a>`;
                listItem.appendChild(info1);

                const info2 = document.createElement('p');

                info2.textContent = 'Description: ';
                listItem.appendChild(info2);

                // if (item)

                listItem.addEventListener('click', () => {
                    // console.log("hello world")

                    if (!listItem.className.includes('selected')) {
                        listItem.classList.add('selected');
                        this.moveItemToList(item.site_name);
                        // this.saveSelectedItem(item.name);
                    } else if (listItem.className.includes('selected')) {
                        listItem.classList.remove('selected');
                        this.moveItemToList(item.site_name)

                    }
                });

                this.originalList.appendChild(listItem);
            });
        } else {
            data.results.forEach(item => {
                const listItem = document.createElement('li');
                listItem.classList.add('item');

                // Create the site name element
                const siteName = document.createElement('h3');
                siteName.textContent = item.name;
                listItem.appendChild(siteName);

                // Create additional information elements
                const info1 = document.createElement('p');
                info1.innerHTML = `MAN Site: <a href="https://aeronet.gsfc.nasa.gov/new_web/cruises_v3/${item.name}.html" target="_blank" ">${item.name}</a>`;
                listItem.appendChild(info1);

                const info2 = document.createElement('p');
                if (siteName.textContent.includes('-')) {
                    const siteNameParts = siteName.textContent.split('-');
                    const lastPart = siteNameParts[siteNameParts.length - 1].trim();
                    if (!isNaN(parseFloat(lastPart))) {
                        const description_name = item.name
                        let first_year = description_name.split('-')[0].split('_')
                        first_year = first_year[first_year.length - 1]
                        const second_year = description_name.split('-')[1]
                        info2.textContent = `Start-End: 20${first_year}-20${second_year}`;
                        listItem.appendChild(info2);
                    }
                } else {
                    info2.textContent = 'Description: ';
                    listItem.appendChild(info2);
                }

                listItem.addEventListener('click', () => {

                    // console.log("bye world")
                    if (!listItem.className.includes('selected')) {
                        listItem.classList.add('selected');
                        this.moveItemToList(item.name);
                        // this.saveSelectedItem(item.name);
                    } else if (listItem.className.includes('selected')) {
                        listItem.classList.remove('selected');
                        this.moveItemToList(item.name)

                    }
                });

                this.originalList.appendChild(listItem);
            });
        }
    }


    siteSelection() {
        this.siteDiv = document.createElement('div');
        this.siteDiv.classList.add('site-container');
        const siteDivHeader = document.createElement('h2');
        siteDivHeader.textContent = 'Select Cruise(s)';
        siteDivHeader.style.justifyContent = 'center';
        siteDivHeader.style.display = 'flex';
        siteDivHeader.addEventListener('click', function () {
            this.siteDivFields.classList.toggle('hidden'); // Toggle the 'hidden' class
        }.bind(this));
        this.siteDiv.appendChild(siteDivHeader)
        this.siteDivFields = document.createElement('div')
        this.siteDiv.appendChild(this.siteDivFields)
        this.siteDivFields.style.minWidth = '500px'
        this.siteDivFields.classList.add('hidden')

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search...';
        searchInput.style.width = '40%'
        searchInput.style.minWidth = '50px'
        searchInput.addEventListener('input', function () {
            const searchQuery = this.value.toLowerCase();
            this.tempListItems = Array.from(document.querySelectorAll('.original-list li')); // Update this line
            // this.searchActive = this.tempListItems.length >= 1;

            this.tempListItems.forEach(function (item) {
                const itemText = item.textContent.toLowerCase();
                if (itemText.includes(searchQuery)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        this.siteDivFields.appendChild(searchInput);

        this.listContainer = document.createElement('div');
        this.listContainer.classList.add('lists')
        this.siteDivFields.appendChild(this.listContainer)
        this.originalList = document.createElement('ul');
        this.originalList.classList.add('original-list');
        this.listContainer.appendChild(this.originalList)
        this.originalList.style.height = '300px'
        this.originalList.style.overflow = 'scroll'


        this.newList = document.createElement('ul');
        this.newList.classList.add('new-list');

        // this.siteSelection()

        this.siteButtons()
        this.modifySectionContainer.appendChild(this.siteDiv)

    }

    siteButtons() {
        const addButtonContainer = document.createElement('div');
        const addAllButton = document.createElement('button');
        const removeAllButton = document.createElement('button');
        this.siteUpdateButton = document.createElement('button');


        addButtonContainer.classList.add('button-container');
        addAllButton.textContent = 'Add All';
        removeAllButton.textContent = 'Remove All';
        this.siteUpdateButton.textContent = 'Update';
        this.siteUpdateButton.style.float = 'right'


        this.siteUpdateButton.addEventListener("click", () => {
            this.siteList = Array.from(this.newList.children).map(child => child.textContent)

            this.markerLayer.setSiteList(Array.from(this.newList.children).map(child => child.textContent))
            // this.markerLayer.siteList = Array.from(this.newList.children).map(child => child.textContent)

            this.markerLayer.updateMarkers()
            // // this.markerLayer.updateMarkersFromFields()
        })
        addAllButton.addEventListener('click', () => {
            console.log(this.tempListItems)
            this.addAllSites();
        });

        removeAllButton.addEventListener('click', () => {

            console.log("CLICKED REMOVE ALL")
            this.removeAllSites();
            this.siteList = []

        });

        addButtonContainer.appendChild(addAllButton);
        addButtonContainer.appendChild(removeAllButton);
        addButtonContainer.appendChild(this.siteUpdateButton)
        this.siteDivFields.appendChild(addButtonContainer)
        // this.siteDiv.appendChild(addButtonContainer);
    }


    updateSiteList() {
        // console.log(data)
        let listItems = Array.from(this.newList.children);
        listItems.forEach(listItem => {
            this.newList.removeChild(listItem)
            listItem.classList.remove('selected'); // Remove the 'selected' class
        });
        this.fetchMeasurementsData()
            .then(data => this.processData(data))
            .catch(error => {
                console.log('Error:', error);
            });
    }

    clearList() {
        while (this.originalList.firstChild) {
            this.originalList.firstChild.remove();
        }
    }

    addAllSites() {
        const listItems = Array.from(this.originalList.children);
        listItems.forEach(listItem => {
            const itemName = listItem.textContent.split('MAN')[0];
            this.moveItemToList(itemName);
            listItem.classList.add('selected');
        });
    }

    removeAllSites() {
        let listItems = Array.from(this.newList.children);
        listItems.forEach(listItem => {
            this.newList.removeChild(listItem)
            listItem.classList.remove('selected'); // Remove the 'selected' class
        });
        listItems = Array.from(this.originalList.children);
        listItems.forEach(listItem => {
            this.originalList.appendChild(listItem);
            listItem.classList.remove('selected'); // Remove the 'selected' class
        });

        console.log(this.originalList);
        localStorage.removeItem('selectedItem');
    }

    moveItemToList(item) {
        const existingItem = Array.from(this.newList.children).find(
            listItem => listItem.textContent === item
        );

        if (existingItem) {
            this.newList.removeChild(existingItem);

        } else {
            const newListItem = document.createElement('li');
            newListItem.textContent = item;
            this.newList.appendChild(newListItem);
        }
    }

    createRadioButton = (id, label, value, div) => {

        const container = document.createElement('div');
        container.style.display = 'flex'; // Apply flexbox layout
        container.style.alignItems = 'center'; // Align items vertically in the center
        const radioButton = document.createElement('input');


        radioButton.type = 'radio';
        radioButton.id = id;
        radioButton.checked = true;
        this.selectedOptions[value] = true
        radioButton.style.verticalAlign = 'middle'; // Align radio button vertically

        const radioButtonLabel = document.createElement('label');
        radioButtonLabel.textContent = label;
        radioButtonLabel.setAttribute('for', id);
        radioButtonLabel.style.verticalAlign = 'middle'; // Align label vertically
        radioButtonLabel.style.textTransform = 'uppercase';

        container.appendChild(radioButton);
        container.appendChild(radioButtonLabel);

        // this.fileOptionContainer.appendChild(container);
        div.appendChild(container)
        // Add a click event listener to the radio button
        radioButton.addEventListener('click', () => {
            if (this.selectedOptions[value] || this.selectedOptions[value] === undefined) {
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

    qualityTypeSelection() {
        this.qualitySelectionContainer = document.createElement('div');
        this.qualitySelectionContainer.classList.add('quality-selection')

        this.qualitySelectionDiv = document.createElement('div')
        this.qualitySelectionDiv.classList.add('hidden')

        // Add a section heading using an h1 element
        const downloadLevelHeader = document.createElement('h2');
        downloadLevelHeader.textContent = 'Quality Level';
        downloadLevelHeader.style.justifyContent = 'center';
        downloadLevelHeader.style.display = 'flex';
        downloadLevelHeader.addEventListener('click', function () {
            this.qualitySelectionDiv.classList.toggle('hidden'); // Toggle the 'hidden' class
        }.bind(this));
        this.qualitySelectionContainer.appendChild(downloadLevelHeader);

        // Create an object to store the selected options

        this.createRadioButton('level-select10', 'Level 1.0', 'lev10', this.qualitySelectionDiv);
        this.createRadioButton('level-select15', 'Level 1.5', 'lev15', this.qualitySelectionDiv);
        this.createRadioButton('level-select20', 'Level 2.0', 'lev20', this.qualitySelectionDiv);

        this.qualitySelectionContainer.appendChild(this.qualitySelectionDiv)
        this.fileOptionContainer.appendChild(this.qualitySelectionContainer)
        // this.fieldsContainer.appendChild(this.selectionContainer);
    }

    dataTypeSelection() {
        this.dataTypeContainer = document.createElement('div');
        this.dataTypeContainer.classList.add('data-selection')
        this.dataTypeSelectionContainer = document.createElement('div')
        this.dataTypeSelectionContainer.classList.add('hidden')
        // Add a section heading using an h1 element
        const downloadLevelHeader = document.createElement('h2');
        downloadLevelHeader.textContent = 'Data Type';
        downloadLevelHeader.style.justifyContent = 'center';
        downloadLevelHeader.style.display = 'flex';

        downloadLevelHeader.addEventListener('click', function () {
            this.dataTypeSelectionContainer.classList.toggle('hidden'); // Toggle the 'hidden' class
        }.bind(this));

        this.dataTypeContainer.appendChild(downloadLevelHeader);

        // Create an object to store the selected options

        this.createRadioButton('aod', 'AOD', 'aod', this.dataTypeSelectionContainer);
        this.createRadioButton('sda', 'SDA', 'sda', this.dataTypeSelectionContainer);
        this.dataTypeContainer.appendChild(this.dataTypeSelectionContainer)
        this.fileOptionContainer.appendChild(this.dataTypeContainer);
    }


    readingTypeSelection() {
        this.readingTypeContainer = document.createElement('div');
        this.readingTypeContainer.classList.add('reading-selection');
        this.readingSelectionContainer = document.createElement('div')
        this.readingSelectionContainer.classList.add('hidden')
        // Add a section heading using an h1 element
        const readingHeader = document.createElement('h2');
        // downloadLevelHeader.style.backgroundColor = 'blue'
        readingHeader.textContent = 'Reading Type';
        readingHeader.style.justifyContent = 'center';
        readingHeader.style.display = 'flex';

        readingHeader.addEventListener('click', function () {
            this.readingSelectionContainer.classList.toggle('hidden'); // Toggle the 'hidden' class
        }.bind(this));

        this.readingTypeContainer.appendChild(readingHeader);

        // Create an object to store the selected options
        this.createRadioButton('all_points', 'all points', 'all_points', this.readingSelectionContainer);
        this.createRadioButton('series', 'series', 'series', this.readingSelectionContainer);
        this.createRadioButton('daily', 'daily', 'daily', this.readingSelectionContainer);
        this.readingTypeContainer.appendChild(this.readingSelectionContainer)
        this.fileOptionContainer.appendChild(this.readingTypeContainer);
    }


    dateSelection() {
        this.dateSelectionDiv = document.createElement('div');
        this.dateSelectionDiv.classList.add('date-container');

        const h2 = document.createElement('h2');
        h2.textContent = 'Start/End Date';
        h2.style.display = 'flex';
        h2.style.justifyContent = 'center';
        h2.addEventListener('click', function () {
            this.dateSelectionCont.classList.toggle('hidden'); // Toggle the 'hidden' class
        }.bind(this));
        this.dateSelectionDiv.appendChild(h2);
        this.dateSelectionCont = document.createElement('div')
        // const form = document.createElement('form');
        // form.id = 'input-form';
        this.dateSelectionDiv.appendChild(this.dateSelectionCont);

        const start_dateContainer = document.createElement('div');
        start_dateContainer.style.display = 'flex';
        start_dateContainer.style.alignItems = 'center';

        const start_dateLabel = document.createElement('label');
        start_dateLabel.setAttribute('for', 'start-date');
        start_dateLabel.textContent = 'Start Date:';
        start_dateLabel.id = 'start-date';
        start_dateContainer.appendChild(start_dateLabel);

        this.start_dateInput = document.createElement('input');
        this.start_dateInput.setAttribute('type', 'date');
        this.start_dateInput.setAttribute('min', '2000-01-01');
        this.start_dateInput.id = 'start-date';
        this.start_dateInput.style.border = 'None';
        this.start_dateInput.style.marginLeft = '10px'; // Add margin between label and input
        start_dateContainer.appendChild(this.start_dateInput);

        const end_dateContainer = document.createElement('div');
        end_dateContainer.style.display = 'flex';
        end_dateContainer.style.alignItems = 'center';
        const end_dateLabel = document.createElement('label');
        end_dateLabel.setAttribute('for', 'end-date');
        end_dateLabel.textContent = 'End Date:';
        end_dateLabel.id = 'end-date';
        end_dateContainer.appendChild(end_dateLabel);

        this.end_dateInput = document.createElement('input');
        this.end_dateInput.setAttribute('type', 'date');
        this.end_dateInput.id = 'end-date';
        this.end_dateInput.style.border = 'None'

        const today = new Date().toISOString().split('T')[0];
        this.end_dateInput.setAttribute('max', today);
        this.start_dateInput.setAttribute('max', today);
        end_dateContainer.appendChild(this.end_dateInput);

        this.dateSelectionCont.appendChild(start_dateContainer);
        this.dateSelectionCont.appendChild(end_dateContainer);
        this.dateSelectionCont.classList.add('hidden')

        this.dateButtons()
        this.dateListener()
        this.modifySectionContainer.appendChild(this.dateSelectionDiv);
    }

    dateListener() {
        this.start_dateInput.addEventListener('input', () => {
            const selectedDate = new Date(this.start_dateInput.value);
            if (selectedDate.toISOString().split('T')[0] === today) {
                this.end_dateInput.setAttribute('min', today);
            } else {
                const nextDay = new Date(selectedDate);
                nextDay.setDate(nextDay.getDate());
                const minDate = nextDay.toISOString().split('T')[0];
                this.end_dateInput.setAttribute('min', minDate);
            }
        });
    }

    dateButtons() {
        const addButtonContainer = document.createElement('div');
        this.dateClearButton = document.createElement('button');
        this.dateUpdateButton = document.createElement('button');
        this.dateClearButton.textContent = 'Clear';
        this.dateClearButton.style.float = 'left';
        this.dateUpdateButton.textContent = 'Update';
        this.dateUpdateButton.style.float = 'right';
        addButtonContainer.appendChild(this.dateClearButton)
        addButtonContainer.appendChild(this.dateUpdateButton)
        this.dateSelectionCont.appendChild(addButtonContainer)
        this.dateEventListener()
    }

    dateEventListener() {
        this.dateClearButton.addEventListener('click', (event) => {
            this.start_date = null;
            this.end_date = null;

            this.updateSiteList()
            // this.markerLayer.updateMarkers()
            this.markerLayer.drawRecAuto()
        });

        this.dateUpdateButton.addEventListener('click', (event) => {

            event.preventDefault();
            if (this.form.checkValidity()) {

                this.end_date = this.end_dateInput.value;
                this.start_date = this.start_dateInput.value;
                this.updateSiteList()
                // this.b
                this.markerLayer.updateMarkers()
                this.markerLayer.drawRecAuto()
            }
        });
    }


    boundSelection() {
        this.form = document.createElement('form');


        this.boundsContainer = document.createElement('div');
        this.boundsContainer.classList.add('bounds');

        this.boundsContainerHeader = document.createElement('h2');
        this.boundsContainerHeader.style.display = 'flex';
        this.boundsContainerHeader.style.justifyContent = 'center';
        this.boundsContainerHeader.textContent = 'Set Boundaries';
        this.boundsContainerHeader.addEventListener('click', function () {
            this.boundSelectionContainer.classList.toggle('hidden'); // Toggle the 'hidden' class
        }.bind(this));
        this.boundsContainer.appendChild(this.boundsContainerHeader);

        this.boundSelectionContainer = document.createElement('div');
        this.boundSelectionContainer.classList.add('bounds-fields');
        this.boundSelectionContainer.classList.add('hidden')

        // Minimum Latitude
        this.minlatContainer = document.createElement('div');
        this.minlatContainer.style.display = 'block';
        this.minlatLabel = document.createElement('label');
        this.minlatLabel.textContent = 'Minimum Latitude: ';
        this.minlatInput = document.createElement('input');
        this.minlatInput.classList.add('min-lat');
        this.minlatInput.type = 'number';
        this.minlatInput.step = 'any';
        this.minlatInput.min = -90;
        this.minlatInput.max = 90;
        this.minlatContainer.appendChild(this.minlatLabel);
        this.minlatContainer.appendChild(this.minlatInput);
        this.boundSelectionContainer.appendChild(this.minlatContainer);

        // Minimum Longitude
        this.minlngContainer = document.createElement('div');
        this.minlngContainer.style.display = 'block';
        this.minlngLabel = document.createElement('label');
        this.minlngLabel.textContent = 'Minimum Longitude: ';
        this.minlngInput = document.createElement('input');
        this.minlngInput.classList.add('min-lng');
        this.minlngInput.type = 'number';
        this.minlngInput.step = 'any';
        this.minlngInput.min = -180;
        this.minlngInput.max = 180;
        this.minlngContainer.appendChild(this.minlngLabel);
        this.minlngContainer.appendChild(this.minlngInput);
        this.boundSelectionContainer.appendChild(this.minlngContainer);

        // Maximum Latitude
        this.maxlatContainer = document.createElement('div');
        this.maxlatContainer.style.display = 'block';
        this.maxlatLabel = document.createElement('label');
        this.maxlatLabel.textContent = 'Maximum Latitude: ';
        this.maxlatInput = document.createElement('input');
        this.maxlatInput.classList.add('max-lat');
        this.maxlatInput.type = 'number';
        this.maxlatInput.step = 'any';
        this.maxlatInput.min = -90;
        this.maxlatInput.max = 90;
        this.maxlatContainer.appendChild(this.maxlatLabel);
        this.maxlatContainer.appendChild(this.maxlatInput);
        this.boundSelectionContainer.appendChild(this.maxlatContainer);

        // Maximum Longitude
        this.maxlngContainer = document.createElement('div');
        this.maxlngContainer.style.display = 'block';
        this.maxlngLabel = document.createElement('label');
        this.maxlngLabel.textContent = 'Maximum Longitude: ';
        this.maxlngInput = document.createElement('input');
        this.maxlngInput.classList.add('max-lng');
        this.maxlngInput.type = 'number';
        this.maxlngInput.step = 'any';
        this.maxlngInput.min = -180;
        this.maxlngInput.max = 180;
        this.maxlngContainer.appendChild(this.maxlngLabel);
        this.maxlngContainer.appendChild(this.maxlngInput);
        this.boundSelectionContainer.appendChild(this.maxlngContainer);


        this.boundsContainer.appendChild(this.boundSelectionContainer);

        this.modifySectionContainer.appendChild(this.boundsContainer)
        // this.submitButton = document.createElement('button');
        // this.submitButton.setAttribute('type', 'update');

        this.boundaryButtons()
        // this.submissionContainer.appendChild(this.submitButton);
    }

    handleBounds(minLat, minLng, maxLat, maxLng) {
        this.minLat = minLat
        this.minLng = minLng
        this.maxLat = maxLat
        this.maxLng = maxLng
    }

    boundaryEventListener() {
        this.boundaryClearButton.addEventListener('click', (event) => {
            this.minLat = null;
            this.minLng = null;
            this.maxLat = null;
            this.maxLng = null;

            this.max

            this.updateSiteList()
            // this.markerLayer.updateMarkers()
            this.markerLayer.drawRecAuto()
        });

        this.boundaryUpdateButton.addEventListener('click', (event) => {

            event.preventDefault();
            if (this.form.checkValidity()) {
                console.log(this.minLat, this.minLng, this.maxLat, this.maxLng)

                this.minLat = this.minlatInput.value;
                this.minLng = this.minlngInput.value;
                this.maxLat = this.maxlatInput.value;
                this.maxLng = this.maxlngInput.value;

                this.updateSiteList()
                // this.markerLayer.updateMarkers()
                this.markerLayer.drawRecAuto()
            }
        });
    }

    boundaryButtons() {
        const addButtonContainer = document.createElement('div');
        this.boundaryClearButton = document.createElement('button');
        this.boundaryUpdateButton = document.createElement('button');
        this.boundaryClearButton.textContent = 'Clear';
        this.boundaryClearButton.style.float = 'left';
        this.boundaryUpdateButton.textContent = 'Update';
        this.boundaryUpdateButton.style.float = 'right';
        addButtonContainer.appendChild(this.boundaryClearButton)
        addButtonContainer.appendChild(this.boundaryUpdateButton)
        this.boundSelectionContainer.appendChild(addButtonContainer)
        this.boundaryEventListener();


    }


    downloadButton() {
        this.submitButton = document.createElement('button')
        this.submitButton.classList.add('download')
        this.submitButton.type = 'submit'
        this.submitButton.textContent = 'Download'
        this.submitButton.style.position = 'relative';
        this.submitButton.style.bottom = '10px';
        this.submitButton.style.width = '100%'
        this.submitButton.style.margin = '20px 0px 0px 0px'
        this.fieldsContainer.appendChild(this.submitButton)


    }


    submissionListener() {
        this.submitButton.addEventListener('click', async event => {
            this.submitButton.disabled = true;
            this.submitButton.textContent = 'Processing, Please wait.';
            this.submitButton.classList.add('grayed-out');

            const url = `${this.api_ep}/maritimeapp/download/`; // Update the URL to the appropriate endpoint
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.csrfToken,
                },
                body: JSON.stringify({
                    sites: {list: this.siteList, dates: this.siteDates},
                    date_range: {start_date: this.start_date, end_date: this.end_date},
                    download_options: this.selectedOptions
                }),
            };

            try {
                const response = await fetch(url, options);
                if (response.ok) {
                    const blob = await response.blob();
                    const downloadLink = document.createElement('a');
                    const url = URL.createObjectURL(blob);
                    downloadLink.href = url;
                    // downloadLink.download = 'Maritime Dataset.gz';
                    downloadLink.click();
                    URL.revokeObjectURL(url);

                    // Enable the button and remove the grayed-out class
                    this.submitButton.disabled = false;
                    this.submitButton.classList.remove('grayed-out');
                    this.submitButton.textContent = 'Download'

                } else {
                    console.error('Error:', response.status, response.statusText);
                    this.submitButton.disabled = false;
                    this.submitButton.classList.remove('grayed-out');
                    this.submitButton.textContent = 'Download'
                }
            } catch (error) {
                console.error('Error:', error);
                // Enable the button and remove the grayed-out class in case of an error
                this.submitButton.disabled = false;
                this.submitButton.classList.remove('grayed-out');
                this.submitButton.textContent = 'Download'

            }

        });
    }

}