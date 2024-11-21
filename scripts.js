document.addEventListener('DOMContentLoaded', () => {
    // Función para manejar la apertura de las opciones de filtros
    const filters = document.querySelectorAll('.filter .option-button');

    filters.forEach(button => {
        button.addEventListener('click', () => {
            const parentFilter = button.parentElement;
            const dropdown = parentFilter.querySelector('.dropdown-content');

            // Toggle active class
            if (button.classList.contains('active')) {
                button.classList.remove('active');
                dropdown.style.display = 'none';
            } else {
                // Cerrar otros dropdowns
                document.querySelectorAll('.filter .option-button').forEach(btn => {
                    btn.classList.remove('active');
                    btn.parentElement.querySelector('.dropdown-content').style.display = 'none';
                });

                button.classList.add('active');
                dropdown.style.display = 'block';
            }
        });
    });

    // Función para agregar fechas dinámicamente
    const cuandoOptions = document.getElementById('cuando-options');
    const sitioOptions = document.getElementById('sitio-options');
    const temaOptions = document.getElementById('tema-options');

    // Agregar las próximas 5 fechas a 'cuando'
    for(let i = 1; i <= 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const day = date.toLocaleDateString('es-ES', { weekday: 'long' });
        const fecha = date.toLocaleDateString('es-ES');

        const btn = document.createElement('button');
        btn.textContent = `${capitalizeFirstLetter(day)}, ${fecha}`;
        btn.setAttribute('data-value', fecha);
        btn.addEventListener('click', () => {
            const cuandoButton = document.querySelector('#cuando .option-button');
            cuandoButton.textContent = btn.textContent;
            cuandoButton.setAttribute('data-value', btn.getAttribute('data-value'));
            cuandoButton.classList.remove('active');
            cuandoOptions.style.display = 'none';
            filterEvents();
        });
        cuandoOptions.appendChild(btn);
    }

    // Agregar opciones de sitios (puedes agregar más sitios según necesidad)
    const sitios = ['Madrid', 'Valencia', 'Sevilla', 'Bilbao', 'Zaragoza'];
    sitios.forEach(sitio => {
        const btn = document.createElement('button');
        btn.textContent = sitio;
        btn.setAttribute('data-value', sitio.toLowerCase());
        btn.addEventListener('click', () => {
            const sitioButton = document.querySelector('#sitio .option-button');
            sitioButton.textContent = sitio;
            sitioButton.setAttribute('data-value', sitio.toLowerCase());
            sitioButton.classList.remove('active');
            sitioOptions.style.display = 'none';
            filterEvents();
        });
        sitioOptions.appendChild(btn);
    });

    // Agregar opciones de temas
    const temas = ['todos', 'deporte', 'cultura', 'fiesta'];
    temas.forEach(tema => {
        const btn = document.createElement('button');
        btn.textContent = capitalizeFirstLetter(tema);
        btn.setAttribute('data-value', tema);
        btn.addEventListener('click', () => {
            const temaButton = document.querySelector('#tema .option-button');
            temaButton.textContent = capitalizeFirstLetter(tema);
            temaButton.setAttribute('data-value', tema);
            temaButton.classList.remove('active');
            temaOptions.style.display = 'none';
            filterEvents();
        });
        temaOptions.appendChild(btn);
    });

    // Función para capitalizar la primera letra de una palabra
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Función para filtrar eventos
    function filterEvents() {
        const cuando = document.querySelector('#cuando .option-button').getAttribute('data-value') || 'hoy';
        const sitio = document.querySelector('#sitio .option-button').getAttribute('data-value') || 'barcelona';
        const tema = document.querySelector('#tema .option-button').getAttribute('data-value') || 'todos';

        const events = document.querySelectorAll('.event-item');

        events.forEach(event => {
            const eventTemas = event.getAttribute('data-tema').split(',');
            const eventTemaLower = eventTemas.map(t => t.trim().toLowerCase());

            let isVisible = true;

            // Filtrar por tema
            if (tema !== 'todos' && !eventTemaLower.includes(tema)) {
                isVisible = false;
            }

            // Filtrar por sitio
            if (sitio !== 'barcelona' && !event.textContent.toLowerCase().includes(sitio)) {
                isVisible = false;
            }

            // Filtrar por cuando (Por ahora, no hay datos específicos de fecha en los eventos)
            // Puedes implementar esta funcionalidad cuando tengas información de fechas en los eventos

            if (isVisible) {
                event.style.display = 'block';
            } else {
                event.style.display = 'none';
            }
        });
    }

    // Opcional: Cerrar dropdown al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (!e.target.matches('.option-button')) {
            document.querySelectorAll('.dropdown-content').forEach(dd => {
                dd.style.display = 'none';
            });
            document.querySelectorAll('.filter .option-button').forEach(btn => {
                btn.classList.remove('active');
            });
        }
    });

    // Inicializar filtros al cargar la página
    filterEvents();
});
