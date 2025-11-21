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
        createNavBtn('Todas', 'all')
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
                createActionButton('Edit', 'btn-edit', () => console.log('Edit', orchid.id)),
                createActionButton('Delete', 'btn-delete', (e) => {
                    e.stopPropagation(); //Prevent triggering card click
                    console.log('Delete', orchid.id);
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