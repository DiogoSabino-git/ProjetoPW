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
    // Dicionário de Traduções
    const translations = {
        genus: 'Géneros',
        type: 'Tipos',
        luminosity: 'Luminosidade',
        temperature: 'Temperatura',
        humidity: 'Humidade',
        size: 'Tamanho'
    };

    // Usar a tradução para o título
    const titleText = translations[categoryType] || categoryType;
    
    container.appendChild(toDom('h2', { className: 'view-title' }, [titleText]));

    // Determine which list to fetch from the Manager
    let list = [];
    switch (categoryType) {
        case 'genus': list = manager.genusList; break;
        case 'type': list = manager.typeList; break;
        case 'luminosity': list = manager.luminosityList; break;
        case 'temperature': list = manager.temperatureList; break;
        case 'humidity': list = manager.humidityList; break;
        case 'size': list = manager.sizeList; break;
    }

    // Create the Grid Container
    const grid = toDom('div', { className: 'category-grid' });

    // Loop through the data and create cards
    list.forEach(item => {
        const card = toDom('div', { className: 'category-card' }, [
            toDom('h3', {}, [item.description])
        ]);

        card.addEventListener('click', function() {
            // Get the filtered list from the Manager
            const filteredList = manager.getByCategory(categoryType, item.id);
            
            // Get the main container
            const main = document.getElementById('main-container');
            
            const ptLabel = translations[categoryType] || categoryType;
            const title = `${ptLabel}: ${item.description}`;
            
            renderOrchidGallery(main, filteredList, title);
        });

        grid.appendChild(card);
    });

    container.appendChild(grid);
}

const ITEMS_PER_PAGE = 25;

/**
 * Renders the Grid of Orchids with Pagination
 */
function renderOrchidGallery(container, fullList, title, currentPage = 1) {
    container.replaceChildren();
    
    // Título
    container.appendChild(toDom('h2', { className: 'view-title' }, [title]));

    // Botão Adicionar
    const createBtn = toDom('button', { className: 'create-btn' }, ['+ Adicionar Nova']);
    createBtn.addEventListener('click', () => renderOrchidForm(container));
    container.appendChild(createBtn);

    // Lógica de Paginação
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    // Criamos uma sub-lista apenas com os itens desta página
    const paginatedList = fullList.slice(startIndex, endIndex);

    // Grelha
    const grid = toDom('div', { className: 'orchid-grid' });

    if (paginatedList.length === 0) {
        container.appendChild(toDom('p', { className: 'no-data' }, ['Nenhuma orquídea encontrada.']));
        // Se a lista estiver vazia, não desenhamos paginação
        return;
    }

    paginatedList.forEach(orchid => {
        const card = toDom('div', { className: 'orchid-card text-only' });
        
        card.addEventListener('click', () => {
            renderOrchidDetails(container, orchid);
        });

        const infoContainer = toDom('div', { className: 'card-info' }, [
            toDom('h3', {}, [orchid.name])
        ]);

        card.appendChild(infoContainer);
        grid.appendChild(card);
    });

    container.appendChild(grid);

    // Adicionar Controlos de Paginação
    if (fullList.length > ITEMS_PER_PAGE) {
        renderPaginationControls(container, fullList, title, currentPage);
    }
}

/**
 * Helper para desenhar os botões de página
 */
function renderPaginationControls(container, fullList, title, currentPage) {
    const totalPages = Math.ceil(fullList.length / ITEMS_PER_PAGE);
    
    const paginationWrapper = toDom('div', { className: 'pagination-wrapper' });

    // Botão "Anterior"
    const prevBtn = toDom('button', { className: 'page-btn prev-next' }, ['<']);
    if (currentPage === 1) prevBtn.disabled = true;
    prevBtn.addEventListener('click', () => {
        renderOrchidGallery(container, fullList, title, currentPage - 1);
    });
    paginationWrapper.appendChild(prevBtn);

    // Números das Páginas
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = toDom('button', { className: 'page-btn' }, [i]);
        
        // Destacar a página atual
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }

        pageBtn.addEventListener('click', () => {
            // Volta a chamar a galeria, mas agora forçando a página 'i'
            renderOrchidGallery(container, fullList, title, i);
        });

        paginationWrapper.appendChild(pageBtn);
    }

    // Botão "Próximo" (>)
    const nextBtn = toDom('button', { className: 'page-btn prev-next' }, ['>']);
    if (currentPage === totalPages) nextBtn.disabled = true;
    nextBtn.addEventListener('click', () => {
        renderOrchidGallery(container, fullList, title, currentPage + 1);
    });
    paginationWrapper.appendChild(nextBtn);

    container.appendChild(paginationWrapper);
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

    const title = orchidToEdit ? `Editar Orquídea: ${orchidToEdit.name}` : "Adicionar Nova Orquídea";
    container.appendChild(toDom('h2', { className: 'view-title' }, [title]));

    const form = toDom('form', { className: 'orchid-form', novalidate: true });

    form.appendChild(createInputBlock('Nome:', 'name', 'text', orchidToEdit?.name, true));

    form.appendChild(createInputBlock('Foto URL:', 'src', 'text', orchidToEdit?.src || 'images/orchids/', true));

    //Dynamic Selects for Characteristics
    form.appendChild(createSelectBlock('Género:', 'genus', manager.genusList, orchidToEdit?.genus?.id));
    form.appendChild(createSelectBlock('Tipo:', 'type', manager.typeList, orchidToEdit?.type?.id));
    form.appendChild(createSelectBlock('Luminosidade:', 'luminosity', manager.luminosityList, orchidToEdit?.luminosity?.id));
    form.appendChild(createSelectBlock('Temperatura:', 'temperature', manager.temperatureList, orchidToEdit?.temperature?.id));
    form.appendChild(createSelectBlock('Humidade:', 'humidity', manager.humidityList, orchidToEdit?.humidity?.id));
    form.appendChild(createSelectBlock('Tamanho:', 'size', manager.sizeList, orchidToEdit?.size?.id));

    //Submit Button
    const submitBtn = toDom('button', { type: 'submit', className: 'form-btn' }, ['Guardar']);
    form.appendChild(submitBtn);

    //Handle Submission
    form.addEventListener('submit', (e) => handleFormSubmit(e, form, orchidToEdit));

    container.appendChild(form);
}

/**
 * Helper to create a label + input group
 */
function createInputBlock(labelText, name, type, value = '', required = false) {
    const wrapper = toDom('div', { className: 'form-group' });
    wrapper.appendChild(toDom('label', { for: name }, [labelText]));
    
    //Create the input
    const input = toDom('input', { id: name, name: name, type: type });
    
    //Set value if it exists
    if (value) {
        input.value = value;
    }

    //Set required if true
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
    
    //Default empty option
    select.appendChild(toDom('option', { value: '' }, ['-- Select --']));

    //Populate options
    if (optionsList && Array.isArray(optionsList)) {
        optionsList.forEach(item => {
            const optionAttrs = { value: item.id };
            
            //Check if this option is the selected one (using loose equality == for string/number match)
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

    //Check if Form Element exists
    if (!form) {
        console.error("CRITICAL: Form element is undefined.");
        return;
    }

    //Validate HTML5 Constraints
    if (!form.checkValidity()) {
        console.warn("Form is invalid (HTML5 checks failed).");
        form.reportValidity();
        return;
    }

    //Log Raw Input Values
    const rawGenus = form.elements['genus'].value;
    console.log("Raw Genus Value:", rawGenus);

    //Gather Data
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

    //Check for NaNs
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
            
            const genusObj = manager.genusList.find(x => x.id == formData.genus);
            console.log("Found Genus Object:", genusObj);

            const newOrchid = new Orchid(
                0,
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
 * Renders the About View
 */
function renderAboutView(container) {
    container.replaceChildren();
    
    container.appendChild(toDom('h2', { className: 'view-title' }, ['Sobre a Equipa']));

    //Dados dos Autores
    const authors = [
        {
            name: "Rodrigo Antunes",
            number: "2023151048",
            photo: "/www/images/authors/Antunes.jpg",
            social: {
                linkedin: "https://linkedin.com",
                github: "https://github.com/Rodry010"
            }
        },
        {
            name: "Diogo Sabino",
            number: "202300149",
            photo: "/www/images/Authors/bino.png",
            social: {
                linkedin: "https://linkedin.com",
                github: "https://github.com/DiogoSabino-git"
            }
        }
    ];

    //Criar Grelha
    const teamGrid = toDom('div', { className: 'team-grid' });

    authors.forEach(author => {
        const card = toDom('div', { className: 'team-card' }, [
            //Foto do Autor
            toDom('div', { className: 'team-photo-container' }, [
                toDom('img', { 
                    src: author.photo, 
                    alt: author.name, 
                    className: 'team-photo' 
                })
            ]),
            
            //Info
            toDom('div', { className: 'team-info' }, [
                toDom('h3', {}, [author.name]),
                toDom('p', { className: 'team-number' }, [`Nº ${author.number}`]),
                
                //Links Sociais
                toDom('div', { className: 'team-social' }, [
                    createSocialLink('LinkedIn', author.social.linkedin),
                    createSocialLink('GitHub', author.social.github)
                ])
            ])
        ]);
        teamGrid.appendChild(card);
    });

    container.appendChild(teamGrid);
}

/**
 * Helper para criar links sociais
 */
function createSocialLink(label, url) {
    return toDom('a', { href: url, target: '_blank', className: 'social-link' }, [label]);
}

/**
 * Renders the Full Details View for a specific Orchid
 */
function renderOrchidDetails(container, orchid) {
    container.replaceChildren();

    // Botão de Voltar
    const backBtn = toDom('button', { className: 'back-btn' }, ['← Voltar à Galeria']);
    backBtn.addEventListener('click', () => showView('all'));
    container.appendChild(backBtn);

    // Contentor de Detalhes
    const detailsWrapper = toDom('div', { className: 'details-wrapper' });

    // Coluna da Esquerda: Imagem
    const imgCol = toDom('div', { className: 'details-image-col' }, [
        toDom('img', { src: orchid.src, alt: orchid.name, className: 'details-img' })
    ]);

    // Coluna da Direita: Informação
    const infoCol = toDom('div', { className: 'details-info-col' }, [
        toDom('h2', { className: 'details-title' }, [orchid.name]),
        
        // Lista de Características
        createDetailItem('Género:', orchid.genus.description),
        createDetailItem('Tipo:', orchid.type.description),
        createDetailItem('Luminosidade:', orchid.luminosity.description),
        createDetailItem('Temperatura:', orchid.temperature.description),
        createDetailItem('Humidade:', orchid.humidity.description),
        createDetailItem('Tamanho:', orchid.size.description),
    ]);

    //Adicionar Botões de Ação (Editar/Apagar) também nesta página
    const actionsDiv = toDom('div', { className: 'details-actions' }, [
        createActionButton('Editar', 'btn-edit', () => renderOrchidForm(container, orchid)),
        createActionButton('Apagar', 'btn-delete', () => {
             if (confirm('Tem a certeza que quer apagar esta orquídea?')) {
                manager.removeOrchid(orchid.id);
                showView('all'); // Volta à lista depois de apagar
            }
        })
    ]);
    infoCol.appendChild(actionsDiv);

    //Juntar tudo
    detailsWrapper.appendChild(imgCol);
    detailsWrapper.appendChild(infoCol);
    container.appendChild(detailsWrapper);
}

/**
 * Helper para criar linhas de detalhe (Label: Valor)
 */
function createDetailItem(label, value) {
    return toDom('p', { className: 'detail-item' }, [
        toDom('strong', {}, [label + ' ']),
        value
    ]);
}