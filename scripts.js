// scripts.js

// Espera que tot el contingut del DOM estigui carregat abans d'executar les funcions
document.addEventListener('DOMContentLoaded', () => {
    initializeDropdowns();          // Inicialitza els desplegables dels filtres
    populateFilterOptions();        // Omple les opcions dels filtres
    loadEvents();                   // Carrega els esdeveniments des de events.html
    setupOutsideClickListener();    // Configura l'escoltador per tancar els desplegables quan es clica fora
    initializeNavbarLinks();        // Inicialitza els enllaços de la barra de navegació
    initializeContactForm();        // Inicialitza el formulari de contacte
    initializeHeaderScrollEffect(); // Inicialitza l'efecte de scroll al header
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
        { label: 'Hoy', value: 'hoy' },
        ...generateDateOptions(7)
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

    for (let i = 1; i <= days; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dayName = date.toLocaleDateString('ca-ES', { weekday: 'long' });
        const formattedDate = date.toLocaleDateString('ca-ES', { year: 'numeric', month: 'short', day: 'numeric' });

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
    const selectedSitio = document.querySelector('#sitio .option-button').getAttribute('data-value') || 'todos';
    const selectedTema = document.querySelector('#tema .option-button').getAttribute('data-value') || 'todos';

    const events = document.querySelectorAll('.event-item');

    events.forEach(event => {
        const eventTemas = event.getAttribute('data-tema').split(',').map(t => t.trim().toLowerCase());
        const eventSitio = event.getAttribute('data-sitio').toLowerCase();

        let isVisible = true;

        // Filtrar per tema
        if (selectedTema !== 'todos' && !eventTemas.includes(selectedTema)) {
            isVisible = false;
        }

        // Filtrar per localitat
        if (selectedSitio !== 'todos' && eventSitio !== selectedSitio) {
            isVisible = false;
        }

        // Mostrar o amagar l'esdeveniment
        if (isVisible) {
            event.style.display = 'block'; // Mostrar
            event.classList.remove('hidden');
        } else {
            event.style.display = 'none'; // Amagar
            event.classList.add('hidden');
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






/**
 * Funció per fer scroll suau amb els enllaços de la navbar
 */
function initializeNavbarLinks() {
    const navbarLinks = document.querySelectorAll('.navbar ul li a');

    navbarLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop;
                window.scrollTo({
                    top: offsetTop - 50, // Ajusta segons l'alçada del header
                    behavior: 'smooth'
                });
            }
        });
    });
}





/**
 * Funció per amagar el header en fer scroll
*/function initializeHeaderScrollEffect() {
    const header = document.querySelector('header');
    const headerContent = document.querySelector('.header-content');
    const main = document.querySelector('main');
    const fullScaleThreshold = 0; // Scroll mínim, escala completa
    const minimizedScaleThreshold = 150; // Scroll per començar a escalar
    const hiddenThreshold = 300; // Scroll per desaparèixer completament

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        if (scrollPosition > hiddenThreshold) {
            // Amaga completament el contingut del header
            headerContent.classList.add('hidden');
            header.style.height = '0'; // Elimina l'alçada del `header`
        } else if (scrollPosition > minimizedScaleThreshold) {
            // Escala progressivament entre 1 i 0.2
            headerContent.classList.remove('hidden');
            const scale = Math.max(0.2, 1 - (scrollPosition - minimizedScaleThreshold) / (hiddenThreshold - minimizedScaleThreshold));
            headerContent.style.transform = `scale(${scale})`;
            headerContent.style.opacity = `${scale}`; // Redueix l'opacitat progressivament
            header.style.height = `${scale * 60}vh`; // Ajusta l'alçada proporcional a l'escala
        } else {
            // Mostra el header completament
            headerContent.classList.remove('hidden');
            headerContent.style.transform = 'scale(1)';
            headerContent.style.opacity = '1';
            header.style.height = '60vh'; // Alçada inicial
        }
    });
}
