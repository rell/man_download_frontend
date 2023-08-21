class DateFieldCreator {
    constructor() {
        this.siteField = null;
        this.startDate = null;
        this.endDate = null;
        this.containerDiv = document.createElement('div');
        this.containerDiv.classList.add('date-container');

        const h1 = document.createElement('h1');
        h1.textContent = 'Select Desired Date';
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
}

class SiteSelection {
    constructor() {
        this.startDate = '';
        this.endDate = '';
        this.containerDiv = document.createElement('div');
        this.headerDiv = document.createElement('div');
        this.containerDiv.classList.add('site-container');
        this.listContainer = document.createElement('div');

        this.originalList = document.createElement('ul');
        this.originalList.classList.add('original-list');
        this.newList = document.createElement('ul');
        this.newList.classList.add('new-list');
        const h1 = document.createElement('h1');
        h1.textContent = 'Select Areas of Interest';
        this.headerDiv.appendChild(h1);
        this.containerDiv.appendChild(this.headerDiv)
        this.listContainer.appendChild(this.originalList);
        this.listContainer.appendChild(this.newList);
        this.listContainer.classList.add('lists')
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
        if (this.startDate !== '' && this.endDate !== '') {
            this.fetchMeasurementsData()
                .then(data => this.processData(data))
                .catch(error => {
                    console.log('Error:', error);
                });
        } else if (this.endDate !== '') {
            this.fetchMeasurementsData()
                .then(data => this.processData(data))
                .catch(error => {
                    console.log('Error:', error);
                });
        } else if (this.startDate !== '') {
            this.fetchMeasurementsData()
                .then(data => {
                    this.processData(data)
                })
                .catch(error => {
                    console.log('Error:', error);
                });
        } else {
            this.fetchMeasurementsData()
                .then(data => this.processData(data))
                .catch(error => {
                    console.log('Error:', error);
                });
        }
    }

    fetchData(url) {
        return fetch(url)
            .then(async response => await response.json());
    }

    fetchMeasurementsData() {
        let api_args;
        if (this.startDate !== '' && this.endDate !== '')
        {
            api_args = `http://127.0.0.1:8000/maritimeapp/measurements/sites/?format=json&start_date=${this.startDate}&end_date=${this.endDate}`;
        }
        else if (this.endDate !== '')
        {
            api_args = `http://127.0.0.1:8000/maritimeapp/measurements/sites/?format=json&end_date=${this.endDate}`;

        }
        else if (this.startDate !== '')
        {
            api_args = `http://127.0.0.1:8000/maritimeapp/measurements/sites/?format=json&start_date=${this.startDate}`;
            console.log(this.startDate)

        }
        else {
            api_args = `http://127.0.0.1:8000/maritimeapp/sites/`
        }
        return this.fetchData(api_args);
    }

    processData(data) {
        this.clearList();
        console.log(data.results)
        if (data.results === undefined)
        {
            console.log(data)
            data.forEach(item => {

                console.log("RUNNIN")
                const listItem = document.createElement('li');
                listItem.classList.add('item');

                // Create the site name element
                const siteName = document.createElement('h3');
                siteName.textContent = item.site_name;
                listItem.appendChild(siteName);

                // Create additional information elements
                const info1 = document.createElement('p');
                info1.textContent = 'Information 1: ' + item.info1;
                listItem.appendChild(info1);

                const info2 = document.createElement('p');
                info2.textContent = 'Information 2: ' + item.info2;
                listItem.appendChild(info2);


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
                this.originalList.appendChild(listItem);
            });
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
                info1.innerHTML = `MAN Site: <a href="http://" target="_blank" ">${item.name}</a>`;
                listItem.appendChild(info1);

                const info2 = document.createElement('p');
                info2.textContent = 'Description: ' + item.description;
                listItem.appendChild(info2);

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
            const itemName = listItem.textContent;
            this.moveItemToList(itemName);
            this.saveSelectedItem(itemName);
            listItem.classList.add('selected');
        });
    }

    removeAllSites() {
        const listItems = Array.from(this.newList.children);
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
            console.log('Item already exists in the new list.');
            return;
        }

        const newListItem = document.createElement('li');
        newListItem.textContent = item;
        this.newList.appendChild(newListItem);

        newListItem.addEventListener('click', () => {
            const index = Array.from(this.originalList.children).findIndex(
                listItem => listItem.textContent === item
            );

            if (index !== -1) {
                this.originalList.children[index].classList.remove('selected');
            }

            newListItem.remove();
        });

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

        // Get the values of the desired variables
        const startDate = dateField.startDate;
        const endDate = dateField.endDate;
        const siteList = siteSelection.newList;

        // Redirect to the new webpage
        window.location.href = `map.html?var1=${encodeURIComponent(startDate)}&var2=${encodeURIComponent(endDate)}&var3=${encodeURIComponent(siteList)}`;
    });
}

window.onload = function() {
    const dateField = new DateFieldCreator();
    // fieldCreator
    const siteSelection = new ExtendedSiteSelection();
    siteSelection.createListItems();
    dateField.setSiteField(siteSelection);
    submitData(dateField, siteSelection)
};