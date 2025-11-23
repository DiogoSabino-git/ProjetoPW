"use strict";

// DOM CREATOR
function toDom(tagName, attributes = {}, children = []) {
    const element = document.createElement(tagName); // 

    for (const prop in attributes) {
        if (Object.hasOwn(attributes, prop)) {
            if (prop === 'class') {
                element.className = attributes[prop];
            } else if (prop === 'for') {
                element.htmlFor = attributes[prop];
            } else {
                element[prop] = attributes[prop];
            }
        }
    }

    children.forEach(child => {
        if (typeof child === 'string' || typeof child === 'number') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });

    return element;
}

let manager;

 //INITIALIZATION
window.onload = function() {
    try {
        manager = new OrchidManager(data);
        console.log("Manager initialized with", manager.orchids.length, "orchids.");
    } catch (e) {
        console.error("Critical Error:", e);
        alert("Failed to load application data.");
        return;
    }

    buildLayout();
};

function buildLayout() {
    //Header
    const header = toDom('header', { className: 'app-header' }, [
        toDom('h1', {}, ['Orquídeas para Todos']) 
    ]);

    //Nav Bar
    const nav = toDom('nav', { className: 'app-nav' }, [
        createNavBtn('Géneros', 'genus'),
        createNavBtn('Tipos', 'type'),
        createNavBtn('Luminosidades', 'luminosity'),
        createNavBtn('Temperaturas', 'temperature'),
        createNavBtn('Humidades', 'humidity'),
        createNavBtn('Tamanhos', 'size'),
        createNavBtn('Todas', 'all'),
        createNavBtn('Sobre', 'about')
    ]);

    //Main Container
    const main = toDom('main', { id: 'main-container' }, []);

    //Footer
    const footer = toDom('footer', { className: 'app-footer' }, [
        toDom('p', {}, ['About © Tecnologia Setúbal • Programação Web'])
    ]);

    document.body.append(header, nav, main, footer);
}


// Create navigation buttons
function createNavBtn(label, viewName) {
    const btn = toDom('button', { className: 'nav-btn' }, [label]);
    
    btn.addEventListener('click', function() {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        showView(viewName); 
    });
    
    return btn;
}

//View Controller
function showView(viewName) {
    const main = document.getElementById('main-container');
    main.replaceChildren(); // Clear previous content

    switch (viewName) {
        case 'genus':
        case 'type':
        case 'luminosity':
        case 'temperature':
        case 'humidity':
        case 'size':
            renderCategoryView(main, viewName);
            break;
        
        case 'all':
            renderOrchidGallery(main, manager.orchids, "Todas as Orquídeas");
            break;

        case 'about': 
            renderAboutView(main);
            break;

        default:
            console.warn('Unknown view:', viewName);
    }
}


function renderCategoryView(container, categoryType) {
    //Title
    const titleText = categoryType.charAt(0).toUpperCase() + categoryType.slice(1);
    container.appendChild(toDom('h2', { className: 'view-title' }, [titleText]));

    // 2. Determine which list to fetch from the Manager
    let list = [];
    switch (categoryType) {
        case 'genus': list = manager.genusList; break;
        case 'type': list = manager.typeList; break;
        case 'luminosity': list = manager.luminosityList; break;
        case 'temperature': list = manager.temperatureList; break;
        case 'humidity': list = manager.humidityList; break;
        case 'size': list = manager.sizeList; break;
    }

    // 3. Create the Grid Container
    const grid = toDom('div', { className: 'category-grid' });

    // 4. Loop through the data and create cards
    list.forEach(item => {
        const card = toDom('div', { className: 'category-card' }, [
            toDom('h3', {}, [item.description])
        ]);

        card.addEventListener('click', function() {
            //Get the filtered list from the Manager
            const filteredList = manager.getByCategory(categoryType, item.id);
            
            //Get the main container
            const main = document.getElementById('main-container');
            
            //Render the Gallery with the filtered list
            const title = `${categoryType.charAt(0).toUpperCase() + categoryType.slice(1)}: ${item.description}`;
            renderOrchidGallery(main, filteredList, title);
        });

        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function renderOrchidGallery(container, orchidList, title) {
    //Clear container
    container.replaceChildren();

    //Set Title
    container.appendChild(toDom('h2', { className: 'view-title' }, [title]));

    const createBtn = toDom('button', { className: 'create-btn' }, ['+ Create New Orchid']);
    createBtn.addEventListener('click', () => renderOrchidForm(container));
    container.appendChild(createBtn);

    //Create Grid
    const grid = toDom('div', { className: 'orchid-grid' });

    if (orchidList.length === 0) {
        container.appendChild(toDom('p', { className: 'no-data' }, ['No orchids found in this category.']));
        return;
    }

    //Loop and Create Cards
    orchidList.forEach(orchid => {
        const card = toDom('div', { className: 'orchid-card' }, [
            //Image Container
            toDom('div', { className: 'card-img-container' }, [
                toDom('img', { 
                    src: orchid.src, 
                    alt: orchid.name,
                    className: 'card-img'
                })
            ]),
            // Info Container
            toDom('div', { className: 'card-info' }, [
                toDom('h3', {}, [orchid.name]),
                toDom('p', { className: 'card-subtitle' }, [orchid.genus.description]) // Display Genus name
            ]),
            // Action Buttons (Placeholder for Edit/Delete)
            toDom('div', { className: 'card-actions' }, [
                createActionButton('Edit', 'btn-edit', (e) => {
                e.stopPropagation();
                // Call the form with the current orchid object
                renderOrchidForm(container, orchid); 
            }),
                createActionButton('Delete', 'btn-delete', (e) => {
                        e.stopPropagation(); // Prevents opening the card details if we click delete
                        
                        // 1. Confirm with the user
                        if (confirm('Are you sure you want to delete this orchid?')) {
                            
                            // 2. Remove from data
                            manager.removeOrchid(orchid.id);
                            
                            // 3. Refresh the view to show the item is gone
                            // We get the main container again to be safe
                            const main = document.getElementById('main-container');
                            renderOrchidGallery(main, manager.orchids, "Todas as Orquídeas");
                        }
                    })
            ])
        ]);

        grid.appendChild(card);
    });

    container.appendChild(grid);
}

/**
 * Helper to create small action buttons
 */
function createActionButton(text, className, onClick) {
    const btn = toDom('button', { className: `action-btn ${className}` }, [text]);
    btn.addEventListener('click', onClick);
    return btn;
}

/**
 * Renders the Form for Creating or Editing an Orchid
 */
function renderOrchidForm(container, orchidToEdit = null) {
    container.replaceChildren();

    const title = orchidToEdit ? `Edit Orchid: ${orchidToEdit.name}` : "Create New Orchid";
    container.appendChild(toDom('h2', { className: 'view-title' }, [title]));

    // 1. Create Form Element
    const form = toDom('form', { className: 'orchid-form', novalidate: true });

    // 2. Name Input
    form.appendChild(createInputBlock('Name:', 'name', 'text', orchidToEdit?.name, true));

    // 3. Image URL Input
    form.appendChild(createInputBlock('Photo URL:', 'src', 'text', orchidToEdit?.src || 'images/orchids/', true));

    // 4. Dynamic Selects for Characteristics
    // note: We use ?.id to safely get the ID only if orchidToEdit exists
    form.appendChild(createSelectBlock('Genus:', 'genus', manager.genusList, orchidToEdit?.genus?.id));
    form.appendChild(createSelectBlock('Type:', 'type', manager.typeList, orchidToEdit?.type?.id));
    form.appendChild(createSelectBlock('Luminosity:', 'luminosity', manager.luminosityList, orchidToEdit?.luminosity?.id));
    form.appendChild(createSelectBlock('Temperature:', 'temperature', manager.temperatureList, orchidToEdit?.temperature?.id));
    form.appendChild(createSelectBlock('Humidity:', 'humidity', manager.humidityList, orchidToEdit?.humidity?.id));
    form.appendChild(createSelectBlock('Size:', 'size', manager.sizeList, orchidToEdit?.size?.id));

    // 5. Submit Button
    const submitBtn = toDom('button', { type: 'submit', className: 'form-btn' }, ['Save Orchid']);
    form.appendChild(submitBtn);

    // 6. Handle Submission
    form.addEventListener('submit', (e) => handleFormSubmit(e, form, orchidToEdit));

    container.appendChild(form);
}

/**
 * Helper to create a label + input group
 */
function createInputBlock(labelText, name, type, value = '', required = false) {
    const wrapper = toDom('div', { className: 'form-group' });
    wrapper.appendChild(toDom('label', { for: name }, [labelText]));
    
    // Create the input
    const input = toDom('input', { id: name, name: name, type: type });
    
    // Set value if it exists
    if (value) {
        input.value = value;
    }

    // Set required if true
    if (required) {
        input.required = true;
    }
    
    wrapper.appendChild(input);
    return wrapper;
}

/**
 * Helper to create a label + select group
 */
function createSelectBlock(labelText, name, optionsList, selectedId = null) {
    const wrapper = toDom('div', { className: 'form-group' });
    wrapper.appendChild(toDom('label', { for: name }, [labelText]));

    const select = toDom('select', { id: name, name: name, required: true });
    
    // Default empty option
    select.appendChild(toDom('option', { value: '' }, ['-- Select --']));

    // Populate options
    if (optionsList && Array.isArray(optionsList)) {
        optionsList.forEach(item => {
            const optionAttrs = { value: item.id };
            
            // Check if this option is the selected one (using loose equality == for string/number match)
            if (selectedId != null && item.id == selectedId) {
                optionAttrs.selected = true;
            }
            
            select.appendChild(toDom('option', optionAttrs, [item.description]));
        });
    }

    wrapper.appendChild(select);
    return wrapper;
}

function handleFormSubmit(e, form, orchidToEdit) {
    e.preventDefault(); 
    console.log("--- START FORM SUBMISSION ---");

    // 1. Check if Form Element exists
    if (!form) {
        console.error("CRITICAL: Form element is undefined.");
        return;
    }

    // 2. Validate HTML5 Constraints
    if (!form.checkValidity()) {
        console.warn("Form is invalid (HTML5 checks failed).");
        form.reportValidity();
        return;
    }

    // 3. Log Raw Input Values (To see if Selects are working)
    const rawGenus = form.elements['genus'].value;
    console.log("Raw Genus Value:", rawGenus); // Should be a number like "1", "2"

    // 4. Gather Data
    const formData = {
        name: form.elements['name'].value,
        src: form.elements['src'].value,
        genus: parseInt(form.elements['genus'].value),
        type: parseInt(form.elements['type'].value),
        luminosity: parseInt(form.elements['luminosity'].value),
        temperature: parseInt(form.elements['temperature'].value),
        humidity: parseInt(form.elements['humidity'].value),
        size: parseInt(form.elements['size'].value)
    };

    console.log("Processed Form Data:", formData);

    // 5. Check for NaNs (Not a Number)
    if (isNaN(formData.genus)) {
        console.error("ERROR: Genus is NaN. Did you select an option?");
        alert("Please select all options.");
        return;
    }

    try {
        if (orchidToEdit) {
            console.log("Mode: EDIT");
            manager.updateOrchid(orchidToEdit.id, formData);
        } else {
            console.log("Mode: CREATE");
            
            // Find objects (and log if they are found)
            const genusObj = manager.genusList.find(x => x.id == formData.genus);
            console.log("Found Genus Object:", genusObj);

            const newOrchid = new Orchid(
                0, // Temp ID
                formData.name,
                formData.src,
                genusObj,
                manager.typeList.find(x => x.id == formData.type),
                manager.luminosityList.find(x => x.id == formData.luminosity),
                manager.temperatureList.find(x => x.id == formData.temperature),
                manager.humidityList.find(x => x.id == formData.humidity),
                manager.sizeList.find(x => x.id == formData.size)
            );
            
            console.log("New Orchid Object created:", newOrchid);

            // Attempt to add to Manager
            manager.addOrchid(newOrchid);
            console.log("SUCCESS: Added to manager. Total Orchids:", manager.orchids.length);
        }

        // Refresh View
        const main = document.getElementById('main-container');
        renderOrchidGallery(main, manager.orchids, "Todas as Orquídeas");

    } catch (error) {
        console.error("CRITICAL ERROR inside Try/Catch:", error);
        alert("Error: " + error.message);
    }
}

/**
 * Renders the About View (Static Content)
 */
function renderAboutView(container) {
    container.replaceChildren();
    
    container.appendChild(toDom('h2', { className: 'view-title' }, ['Sobre o Projeto']));

    const content = toDom('div', { className: 'about-content' }, [
        toDom('p', {}, ['Este projeto foi desenvolvido no âmbito da disciplina de Programação Web.']),
        toDom('h3', {}, ['Autores:']),
        toDom('ul', { className: 'authors-list' }, [
            toDom('li', {}, ['Seu Nome Aqui - Nº de Estudante']),
            toDom('li', {}, ['Nome do Colega (se houver)'])
        ]),
        toDom('p', { className: 'tech-stack' }, ['Tecnologias: HTML, CSS, JavaScript (DOM Manually)'])
    ]);

    container.appendChild(content);
}