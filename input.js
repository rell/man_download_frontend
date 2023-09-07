class DateFieldCreator {
    constructor() {
        this.bboxField = null;
        this.siteField = null;
        this.startDate = null;
        this.endDate = null;
        this.containerDiv = document.createElement('div');
        this.containerDiv.classList.add('date-container');

        const h1 = document.createElement('h1');
        h1.textContent = 'Select Date (Optional)';
        this.containerDiv.appendChild(h1);

        const form = document.createElement('form');
        form.id = 'input-form';
        this.containerDiv.appendChild(form);

        const startDateLabel = document.createElement('label');
        const endDateLabel = document.createElement('label');
        startDateLabel.setAttribute('for', 'start-date');
        startDateLabel.textContent = 'Start Date:';
        startDateLabel.id = 'start-date';
        endDateLabel.setAttribute('for', 'end-date');
        endDateLabel.textContent = 'End Date:';
        endDateLabel.id = 'end-date';

        this.startDateInput = document.createElement('input');
        this.startDateInput.setAttribute('type', 'date');
        this.startDateInput.setAttribute('min', '2000-01-01');
        this.startDateInput.id = 'start-date';

        this.endDateInput = document.createElement('input');
        this.endDateInput.setAttribute('type', 'date');
        this.endDateInput.id = 'end-date';
        const today = new Date().toISOString().split('T')[0];
        this.endDateInput.setAttribute('max', today);
        this.startDateInput.setAttribute('max', today);

        this.startDateInput.addEventListener('input', () => {
            const selectedDate = new Date(this.startDateInput.value);
            if (selectedDate.toISOString().split('T')[0] === today) {
                this.endDateInput.setAttribute('min', today);

            } else {
                const nextDay = new Date(selectedDate);
                nextDay.setDate(nextDay.getDate());
                const minDate = nextDay.toISOString().split('T')[0];
                this.endDateInput.setAttribute('min', minDate);
            }
        });

        const addButtonContainer = document.createElement('div');
        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'submit');
        submitButton.textContent = 'Submit';
        addButtonContainer.classList.add('button-container');
        addButtonContainer.appendChild(submitButton);
        this.containerDiv.appendChild(addButtonContainer);

        submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.siteField.startDate = this.startDateInput.value;
            this.siteField.endDate = this.endDateInput.value;
            this.siteField.updateSiteList()


            // this.onSubmit(startDate, endDate);
        });

        form.appendChild(startDateLabel);
        form.appendChild(this.startDateInput);
        form.appendChild(endDateLabel);
        form.appendChild(this.endDateInput);

        document.body.appendChild(this.containerDiv);
    }
    setSiteField(siteSelection) {
        this.siteField = siteSelection
    }

    setBboxField(bboxField) {
        this.bboxField = bboxField
    }
}

class BoundingBoxContainer {
    constructor() {
        this.SiteSelection = null;
        this.minLat = null;
        this.minLng = null;
        this.maxLat = null;
        this.maxLng = null;

        this.containerDiv = document.createElement('div');
        this.containerDiv.classList.add('bbox-container');

        this.headerDiv = document.createElement('div');
        const h1 = document.createElement('h1');
        h1.textContent = 'Select Bounding Box (Optional)';
        this.headerDiv.appendChild(h1);

        this.inputContainer = document.createElement('div');
        this.inputContainer.classList.add('polygon-bbox');

        this.form = document.createElement('form');

        this.submissionContainer = document.createElement('div');
        this.submissionContainer.classList.add('submit');

        this.input1 = null;
        this.input2 = null;
        this.input3 = null;
        this.input4 = null;

        this.label1 = null;
        this.label2 = null;
        this.label3 = null;
        this.label4 = null;

        this.setupInputs();
        this.appendElements();
        this.addValidationListeners();
        this.addSubmitListener();
    }

    setupInputs() {
        this.input1 = document.createElement('input');
        this.input1.classList.add('min-lat');
        this.input1.type = 'number';
        this.input1.step = 'any';
        this.input1.min = -90
        this.input1.max = 90

        this.label1 = document.createElement('label');
        this.label1.textContent = 'Minimum Latitude: ';
        this.label1.appendChild(this.input1);

        this.input2 = document.createElement('input');
        this.input2.classList.add('min-lng');
        this.input2.type = 'number';
        this.input2.step = 'any';
        this.input2.min = -180
        this.input2.max = 180

        this.label2 = document.createElement('label');
        this.label2.textContent = 'Minimum Longitude: ';
        this.label2.appendChild(this.input2);

        this.input3 = document.createElement('input');
        this.input3.classList.add('max-lat');
        this.input3.type = 'number';
        this.input3.step = 'any';
        this.input3.min = -90
        this.input3.max = 90

        this.label3 = document.createElement('label');
        this.label3.textContent = 'Maximum Latitude: ';
        this.label3.appendChild(this.input3);

        this.input4 = document.createElement('input');
        this.input4.classList.add('max-lng');
        this.input4.type = 'number';
        this.input4.step = 'any';
        this.input4.min = -180
        this.input4.max = 180

        this.label4 = document.createElement('label');
        this.label4.textContent = 'Maximum Longitude: ';
        this.label4.appendChild(this.input4);

        this.submitButton = document.createElement('button');
        this.submitButton.setAttribute('type', 'submit');
        this.submitButton.textContent = 'Submit'
        this.submissionContainer.appendChild(this.submitButton);
    }

    appendElements() {
        this.form.appendChild(this.label1);
        this.form.appendChild(this.label2);
        this.form.appendChild(this.label3);
        this.form.appendChild(this.label4);

        this.inputContainer.appendChild(this.form);

        this.containerDiv.appendChild(this.headerDiv);
        this.containerDiv.appendChild(this.inputContainer);
        this.containerDiv.appendChild(this.submissionContainer)
        document.body.appendChild(this.containerDiv);
    }

    setSiteField(siteSelection) {
        this.SiteSelection = siteSelection
    }
    addValidationListeners() {
        const inputs = [this.input1, this.input2, this.input3, this.input4];

        inputs.forEach((input) => {
            input.addEventListener('input', () => {
                const hasData = inputs.some((input) => input.value !== '');
                inputs.forEach((input) => (input.required = hasData));
            });
        });
    }

    addSubmitListener() {
        this.submitButton.addEventListener('click', (event) => {
            event.preventDefault();

            if (this.form.checkValidity()) {
                const submission = {
                    minLat: this.input1.value,
                    minLng: this.input2.value,
                    maxLat: this.input3.value,
                    maxLng: this.input4.value,
                };

                this.SiteSelection.minLat = submission.minLat;
                this.SiteSelection.minLng = submission.minLng;
                this.SiteSelection.maxLat = submission.maxLat;
                this.SiteSelection.maxLng = submission.maxLng;
                this.SiteSelection.updateSiteList()

                console.log('Submission:', submission);
            }
        });
    }


}



class SiteSelection {
    constructor() {
        this.startDate = null;
        this.endDate = null;
        this.minLat = null;
        this.minLng = null;
        this.maxLat = null;
        this.maxLng = null;
        this.createElements();
        this.appendElements();
    }

    createElements()
    {
        this.containerDiv = document.createElement('div');
        this.containerDiv.classList.add('site-container');

        this.headerDiv = document.createElement('div');
        const h1 = document.createElement('h1');
        h1.textContent = 'Select Areas of Interest';
        this.headerDiv.appendChild(h1);

        this.listContainer = document.createElement('div');
        this.listContainer.classList.add('lists')

        this.originalList = document.createElement('ul');
        this.originalList.classList.add('original-list');

        this.newList = document.createElement('ul');
        this.newList.classList.add('new-list');
    }
    appendElements()
    {
        this.containerDiv.appendChild(this.headerDiv)
        this.listContainer.appendChild(this.originalList);
        this.containerDiv.appendChild(this.listContainer)
        document.body.appendChild(this.containerDiv);
    }

    handleChange(event) {
        const { name, value } = event.target;
        if (name === 'startDate') {
            this.startDate = value;
            console.log('Start Date changed:', this.startDate);
        } else if (name === 'endDate') {
            this.endDate = value;
            console.log('End Date changed:', this.endDate);
        }
    }

    updateSiteList() {
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

        // if (this.startDate !== '' && this.endDate !== '') {
        //     this.fetchMeasurementsData()
        //         .then(data => this.processData(data))
        //         .catch(error => {
        //             console.log('Error:', error);
        //         });
        // } else if (this.endDate !== '') {
        //     this.fetchMeasurementsData()
        //         .then(data => this.processData(data))
        //         .catch(error => {
        //             console.log('Error:', error);
        //         });
        // } else if (this.startDate !== '') {
        //     this.fetchMeasurementsData()
        //         .then(data => {
        //             this.processData(data)
        //         })
        //         .catch(error => {
        //             console.log('Error:', error);
        //         });
        // } else {
        //     this.fetchMeasurementsData()
        //         .then(data => this.processData(data))
        //         .catch(error => {
        //             console.log('Error:', error);
        //         });
        // }
    }

    fetchData(url) {
        return fetch(url)
            .then(async response => await response.json());
    }

    fetchMeasurementsData() {
        let api_args;
        if (this.minLat !== null && this.minLng !== null && this.maxLat !== null && this.maxLng !== null && this.startDate !== '' && this.endDate !== '')
        {
            api_args = `http://127.0.0.1:4956/maritimeapp/measurements/sites/?format=json&min_lat=${this.minLat}&min_lng=${this.minLng}&max_lat=${this.maxLat}&max_lng=${this.maxLng}&start_date=${this.startDate}&end_date=${this.endDate}`;
        }
        else if (this.minLat !== null && this.minLng !== null && this.maxLat !== null && this.maxLng !== null && this.endDate !== '')
        {
            api_args = `http://127.0.0.1:4956/maritimeapp/measurements/sites/?format=json&min_lat=${this.minLat}&min_lng=${this.minLng}&max_lat=${this.maxLat}&max_lng=${this.maxLng}&end_date=${this.endDate}`;

        }
        else if (this.minLat !== null && this.minLng !== null && this.maxLat !== null && this.maxLng !== null && this.startDate !== '')
        {
            api_args = `http://127.0.0.1:4956/maritimeapp/measurements/sites/?format=json&min_lat=${this.minLat}&min_lng=${this.minLng}&max_lat=${this.maxLat}&max_lng=${this.maxLng}&start_date=${this.startDate}`;

        }
        else if (this.minLat !== null && this.minLng !== null && this.maxLat !== null && this.maxLng !== null)
        {
            api_args = `http://127.0.0.1:4956/maritimeapp/measurements/sites/?format=json&min_lat=${this.minLat}&min_lng=${this.minLng}&max_lat=${this.maxLat}&max_lng=${this.maxLng}`;

        }
        else if (this.startDate !== null && this.endDate !== null)
        {
            api_args = `http://127.0.0.1:4956/maritimeapp/measurements/sites/?format=json&start_date=${this.startDate}&end_date=${this.endDate}`;
        }
        else if (this.endDate !== null)
        {
            api_args = `http://127.0.0.1:4956/maritimeapp/measurements/sites/?format=json&end_date=${this.endDate}`;

        }
        else if (this.startDate !== null)
        {
            api_args = `http://127.0.0.1:4956/maritimeapp/measurements/sites/?format=json&start_date=${this.startDate}`;
            console.log(this.startDate)

        }
        else {
            console.log("running here line 366")
            api_args = `http://127.0.0.1:4956/maritimeapp/sites/`
        }
        return this.fetchData(api_args);
    }

    processData(data) {
        this.clearList();
        // console.log(data.results)
        if (data.results === undefined)
        {
            console.log(data)
            data.forEach(item => {

                // console.log("RUNNIN")
                const listItem = document.createElement('li');
                listItem.classList.add('item');

                // Create the site name element
                const siteName = document.createElement('h3');
                siteName.textContent = item.site_name;
                listItem.appendChild(siteName);

                // Create additional information elements
                const info1 = document.createElement('p');
                info1.innerHTML = `MAN Site: <a href="https://aeronet.gsfc.nasa.gov/new_web/cruises_v3/${item.name}.html" target="_blank" ">${item.name}</a>`;
                listItem.appendChild(info1);

                const info2 = document.createElement('p');
                if (siteName.textContent.includes('-'))
                {
                    const siteNameParts = siteName.textContent.split('-');
                    const lastPart = siteNameParts[siteNameParts.length - 1].trim();
                    if (!isNaN(parseFloat(lastPart))) {
                        const description_name = item.name
                        let first_year = description_name.split('-')[0].split('_')
                        first_year = first_year[first_year.length - 1]
                        const second_year =description_name.split('-')[1]
                        info2.textContent = `Start-End: 20${first_year}-20${second_year}`;
                        listItem.appendChild(info2);
                    }
                }
                else
                {
                    info2.textContent = 'Description: ';
                    listItem.appendChild(info2);
                }


                listItem.addEventListener('click', () => {

                    if (!listItem.className.includes('selected'))
                    {
                        this.moveItemToList(item.site_name);
                        this.saveSelectedItem(item.site_name);
                        listItem.classList.add('selected');
                    }
                    if (listItem.className.includes('selected'))
                    {
                        listItem.classList.remove('selected')
                    }
                });

                listItem.addEventListener('click', () => {
                    if (!listItem.className.includes('selected')) {
                        listItem.classList.add('selected');
                        this.moveItemToList(item.name);
                        this.saveSelectedItem(item.name);
                    }
                    else if(listItem.className.includes('selected')){
                        listItem.classList.remove('selected');

                    }
                });

                this.originalList.appendChild(listItem);            });
        }
        else {
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
                if (siteName.textContent.includes('-'))
                {
                    const siteNameParts = siteName.textContent.split('-');
                    const lastPart = siteNameParts[siteNameParts.length - 1].trim();
                    if (!isNaN(parseFloat(lastPart))) {
                        const description_name = item.name
                        let first_year = description_name.split('-')[0].split('_')
                        first_year = first_year[first_year.length - 1]
                        const second_year =description_name.split('-')[1]
                        info2.textContent = `Start-End: 20${first_year}-20${second_year}`;
                        listItem.appendChild(info2);
                    }
                }
                else
                {
                    info2.textContent = 'Description: ';
                    listItem.appendChild(info2);
                }

                listItem.addEventListener('click', () => {
                    if (!listItem.className.includes('selected')) {
                        listItem.classList.add('selected');
                        this.moveItemToList(item.name);
                        this.saveSelectedItem(item.name);
                    }
                    else if(listItem.className.includes('selected')){
                        listItem.classList.remove('selected');
                        this.moveItemToList(item.name)

                    }
                });

                this.originalList.appendChild(listItem);
            });
        }
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
            this.saveSelectedItem(itemName);
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

        }else {
            const newListItem = document.createElement('li');
            newListItem.textContent = item;
            this.newList.appendChild(newListItem);
        }
        // newListItem.addEventListener('click', () => {
        //     const index = Array.from(this.originalList.children).findIndex(
        //         listItem => listItem.textContent === item
        //     );
        //
        //     if (index !== -1) {
        //         this.originalList.children[index].classList.remove('selected');
        //     }
        //
        //     newListItem.remove();
        // });

    }

    createButtons() {
        const addButtonContainer = document.createElement('div');
        const addAllButton = document.createElement('button');
        const removeAllButton = document.createElement('button');

        addButtonContainer.classList.add('button-container');
        addAllButton.textContent = 'Add All';
        removeAllButton.textContent = 'Remove All';

        addAllButton.addEventListener('click', () => {
            this.addAllSites();
        });

        removeAllButton.addEventListener('click', () => {

            console.log("CLICKED REMOVE ALL")
            this.removeAllSites();

        });

        addButtonContainer.appendChild(addAllButton);
        addButtonContainer.appendChild(removeAllButton);
        this.containerDiv.appendChild(addButtonContainer);
    }


    saveSelectedItem(item) {
        localStorage.setItem('selectedItem', JSON.stringify(item));
    }
}

// Inherit from SiteSelection and create a new class
class ExtendedSiteSelection extends SiteSelection {
    constructor() {
        super();
    }

    createListItems() {
        super.updateSiteList();
        this.createButtons();
    }

}

const submitData = (dateField, siteSelection) => {
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    document.body.appendChild(submitButton);


    submitButton.addEventListener('click', () => {
        console.log(siteSelection.newList.innerHTML)

        localStorage.setItem('startDate', siteSelection.startDate)
        localStorage.setItem('endDate', siteSelection.endDate)
        localStorage.setItem('minLat', siteSelection.minLat)
        localStorage.setItem('minLng', siteSelection.minLng)
        localStorage.setItem('maxLat', siteSelection.maxLat)
        localStorage.setItem('maxLng', siteSelection.maxLng)
        localStorage.setItem('siteList', JSON.stringify(Array.from(siteSelection.newList.children).map(child => child.textContent)));

        // Get the values of the desired variables
        // const startDate = dateField.startDate;
        // const endDate = dateField.endDate;
        // const siteList = siteSelection.newList;

        // Redirect to the new webpage
        window.location.href = `map.html`;
        // window.location.href = `map.html?var1=${encodeURIComponent(startDate)}&var2=${encodeURIComponent(endDate)}&var3=${encodeURIComponent(siteList)}`;
    });
}

window.onload = function() {
    // fieldCreator
    const dateField = new DateFieldCreator();
    const bboxField = new BoundingBoxContainer();
    const siteSelection = new ExtendedSiteSelection();

    siteSelection.createListItems();
    dateField.setSiteField(siteSelection);
    bboxField.setSiteField(siteSelection)
    // bboxField.setDateField(dateField)
    // dateField.setBboxField(bboxField)
    submitData(dateField, siteSelection)
};