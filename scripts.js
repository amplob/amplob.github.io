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
            document.querySelector('#cuando .option-button').textContent = btn.textContent;
            document.querySelector('#cuando .option-button').classList.remove('active');
            dropdown.style.display = 'none';
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
            document.querySelector('#sitio .option-button').textContent = sitio;
            document.querySelector('#sitio .option-button').classList.remove('active');
            sitioOptions.style.display = 'none';
            filterEvents();
        });
        sitioOptions.appendChild(btn);
    });

    // Agregar opciones de temas
    const temas = ['deporte', 'cultura', 'fiesta'];
    temas.forEach(tema => {
        const btn = document.createElement('button');
        btn.textContent = capitalizeFirstLetter(tema);
        btn.setAttribute('data-value', tema);
        btn.addEventListener('click', () => {
            document.querySelector('#tema .option-button').textContent = capitalizeFirstLetter(tema);
            document.querySelector('#tema .option-button').classList.remove('active');
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
        const cuando = document.querySelector('#cuando .option-button').textContent.toLowerCase();
        const sitio = document.querySelector('#sitio .option-button').textContent.toLowerCase();
        const tema = document.querySelector('#tema .option-button').textContent.toLowerCase();

        const events = document.querySelectorAll('.event-item');

        events.forEach(event => {
            const eventTema = event.getAttribute('data-tema');
            let isVisible = true;

            // Filtrar por tema
            if (tema !== 'todos' && eventTema !== tema) {
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
