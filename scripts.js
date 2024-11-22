// scripts.js

// Espera que tot el contingut del DOM estigui carregat abans d'executar les funcions
document.addEventListener('DOMContentLoaded', () => {
    initializeDropdowns();          // Inicialitza els desplegables dels filtres
    populateFilterOptions();        // Omple les opcions dels filtres
    loadEvents();                   // Carrega els esdeveniments des de events.html
    setupOutsideClickListener();    // Configura l'escoltador per tancar els desplegables quan es clica fora
    initializeNavbarLinks();        // Inicialitza els enllaços de la barra de navegació
    initializeContactForm();        // Inicialitza el formulari de contacte
});

// Funció per inicialitzar els desplegables dels filtres
function initializeDropdowns() {
    const filterButtons = document.querySelectorAll('.filter .option-button');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parentFilter = button.parentElement;
            const dropdown = parentFilter.querySelector('.dropdown-content');

            // Tancar altres desplegables
            document.querySelectorAll('.filter .dropdown-content').forEach(dd => {
                if (dd !== dropdown) {
                    dd.classList.remove('visible');
                }
            });
            document.querySelectorAll('.filter .option-button').forEach(btn => {
                if (btn !== button) {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle de la classe 'active' i 'visible' per al desplegable actual
            const isActive = button.classList.toggle('active');
            dropdown.classList.toggle('visible');
            button.setAttribute('aria-expanded', isActive);
        });

        // Gestionar el focus dins dels desplegables amb teclat
        button.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const firstOption = button.parentElement.querySelector('.dropdown-content button');
                if (firstOption) firstOption.focus();
            }
        });
    });
}

// Funció per omplir les opcions dels filtres
function populateFilterOptions() {
    // Opcions per al filtre "¿Cuándo?"
    addOptions('cuando-options', [
        { label: 'Todos', value: 'todos' },
        ...generateDateOptions(40) // Inclou "Todos" abans de les dates
    ], handleCuandoSelection);

    // Opcions per al filtre "¿Sitio?"
    addOptions('sitio-options', [
        { label: 'Barcelona', value: 'barcelona' },
        { label: 'Madrid', value: 'madrid' },
        { label: 'Valencia', value: 'valencia' },
        { label: 'Sevilla', value: 'sevilla' },
        { label: 'Bilbao', value: 'bilbao' },
        { label: 'Zaragoza', value: 'zaragoza' }
    ], handleSitioSelection);

    // Opcions per al filtre "¿Tema?"
    addOptions('tema-options', [
        { label: 'Todos', value: 'todos' },
        { label: 'Deporte', value: 'deporte' },
        { label: 'Cultura', value: 'cultura' },
        { label: 'Fiesta', value: 'fiesta' }
    ], handleTemaSelection);
}

// Funció per afegir opcions als desplegables
function addOptions(elementId, options, callback) {
    const container = document.getElementById(elementId);
    const fragment = document.createDocumentFragment();

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option.label;
        btn.setAttribute('data-value', option.value);
        btn.addEventListener('click', () => callback(btn));
        fragment.appendChild(btn);
    });

    container.appendChild(fragment);
}

// Funció per generar opcions de data per al filtre "¿Cuándo?"
function generateDateOptions(days) {
    const options = [];

    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
        const formattedDate = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });

        options.push({
            label: `${capitalizeFirstLetter(dayName)}, ${formattedDate}`,
            value: date.toISOString().split('T')[0] // Format 'YYYY-MM-DD'
        });
    }

    return options;
}

// Funció per gestionar la selecció del filtre "¿Cuándo?"
function handleCuandoSelection(button) {
    const cuandoButton = document.querySelector('#cuando .option-button');
    cuandoButton.textContent = button.textContent;
    cuandoButton.setAttribute('data-value', button.getAttribute('data-value'));
    cuandoButton.classList.remove('active');
    document.getElementById('cuando-options').classList.remove('visible');
    cuandoButton.setAttribute('aria-expanded', 'false');
    filterEvents();
}

// Funció per gestionar la selecció del filtre "¿Sitio?"
function handleSitioSelection(button) {
    const sitioButton = document.querySelector('#sitio .option-button');
    sitioButton.textContent = button.textContent;
    sitioButton.setAttribute('data-value', button.getAttribute('data-value').toLowerCase());
    sitioButton.classList.remove('active');
    document.getElementById('sitio-options').classList.remove('visible');
    sitioButton.setAttribute('aria-expanded', 'false');
    filterEvents();
}

// Funció per gestionar la selecció del filtre "¿Tema?"
function handleTemaSelection(button) {
    const temaButton = document.querySelector('#tema .option-button');
    temaButton.textContent = capitalizeFirstLetter(button.textContent);
    temaButton.setAttribute('data-value', button.getAttribute('data-value'));
    temaButton.classList.remove('active');
    document.getElementById('tema-options').classList.remove('visible');
    temaButton.setAttribute('aria-expanded', 'false');
    filterEvents();
}

// Funció per capitalitzar la primera lletra d'una cadena
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Funció principal per filtrar els esdeveniments segons els filtres seleccionats
function filterEvents() {
    const cuando = document.querySelector('#cuando .option-button').getAttribute('data-value') || 'todos';
    const sitio = document.querySelector('#sitio .option-button').getAttribute('data-value') || 'barcelona';
    const tema = document.querySelector('#tema .option-button').getAttribute('data-value') || 'todos';

    const events = document.querySelectorAll('.event-item');

    events.forEach(event => {
        const eventTemas = event.getAttribute('data-tema').split(',').map(t => t.trim().toLowerCase());
        const eventSitio = event.getAttribute('data-sitio').toLowerCase();
        const eventFecha = event.getAttribute('data-fecha'); // Format 'YYYY-MM-DD'

        let isVisible = true;

        // Filtrar per tema
        if (tema !== 'todos' && !eventTemas.includes(tema)) {
            isVisible = false;
        }

        // Filtrar per sitio
        if (sitio !== 'barcelona' && eventSitio !== sitio) {
            isVisible = false;
        }

        // Filtrar per cuándo
        if (cuando !== 'todos') {
            if (cuando !== 'hoy') {
                const selectedDate = new Date(cuando);
                const eventDate = new Date(eventFecha);
                // Comparar només la data, no la hora
                if (
                    selectedDate.getFullYear() !== eventDate.getFullYear() ||
                    selectedDate.getMonth() !== eventDate.getMonth() ||
                    selectedDate.getDate() !== eventDate.getDate()
                ) {
                    isVisible = false;
                }
            } else {
                // Mostrar només esdeveniments d'avui
                const today = new Date();
                const eventDate = new Date(eventFecha);
                if (
                    today.getFullYear() !== eventDate.getFullYear() ||
                    today.getMonth() !== eventDate.getMonth() ||
                    today.getDate() !== eventDate.getDate()
                ) {
                    isVisible = false;
                }
            }
        }

        // Mostrar o ocultar l'esdeveniment segons el resultat del filtratge
        if (isVisible) {
            event.classList.remove('hidden');
            event.style.display = 'block';
        } else {
            event.classList.add('hidden');
            // Utilitzar setTimeout per permetre la transició (si tens transicions CSS)
            setTimeout(() => {
                event.style.display = 'none';
            }, 300); // 300ms coincideix amb la durada de la transició
        }
    });
}

// Funció per tancar els desplegables quan es clica fora dels filtres
function setupOutsideClickListener() {
    window.addEventListener('click', (e) => {
        if (!e.target.closest('.filter')) {
            document.querySelectorAll('.dropdown-content').forEach(dd => {
                dd.classList.remove('visible');
            });
            document.querySelectorAll('.filter .option-button').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            });
        }
    });
}

// Funció per inicialitzar els enllaços de la barra de navegació per fer scroll suau
function initializeNavbarLinks() {
    const navbarLinks = document.querySelectorAll('.navbar ul li a');

    navbarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100, // Ajusta segons l'alçada del header
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Funció per carregar els esdeveniments des de events.html dins de la secció event-feed
function loadEvents() {
    fetch('events.html') // Assegura't que la ruta és correcta i que events.html està al mateix directori que index.html
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al carregar els esdeveniments.');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('event-feed').innerHTML = data;
            filterEvents(); // Filtrar després de carregar els esdeveniments
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('event-feed').innerHTML = '<p>No s\'han pogut carregar els esdeveniments.</p>';
        });
}

// Funció per gestionar el formulari de contacte
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Recollir dades del formulari
            const name = e.target.name.value.trim();
            const email = e.target.email.value.trim();
            const message = e.target.message.value.trim();
        
            if (name && email && message) {
                // Aquí pots implementar l'enviament de les dades al servidor
                // Per exemple, mitjançant fetch o AJAX
        
                // Exemple simple de feedback
                alert('¡Gracias por tu mensaje, ' + name + '! Nos pondremos en contacto contigo pronto.');
        
                // Reset del formulari
                e.target.reset();
            } else {
                alert('Por favor, completa todos los campos.');
            }
        });
    }
}
