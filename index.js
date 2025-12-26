// Funcionalidad de la Barra de Navegación //

document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - document.querySelector('.navbar').offsetHeight,
                behavior: 'smooth'
            });
        }
    });
});


// Funcionalidad del Carrusel //

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;

    function showNextSlide() {
        if (slides.length === 0) return;

        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        setInterval(showNextSlide, 5000);
    }
});


// Funcionalidad del Menú Hamburguesa //

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            menuToggle.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <=768){
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('open');
                }
            });
        });
    }
});



/// Funcionalidad de las Secciones Dinámicas: Pilotos//
// Se define la funcionalidad en una función para ser llamada al cargar el DOM

function initPilotosCards() {
    // 💡 CORRECCIÓN PRINCIPAL 1: Definición de la variable del contenedor
    const resourcesContainer = document.getElementById('resources-container');
    const modal = document.getElementById('resource-modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');

    if (!resourcesContainer) {
        console.error('Error: No se encontró el elemento #resources-container. Asegúrate de que existe en el HTML.');
        return; 
    }

    let allPilotos = [];

    async function fetchPilotos() {
        try {
            const response = await fetch('pilotos.json');
            const data = await response.json();
            
            allPilotos = data.pilotos;
            renderPilotos(allPilotos);
        } catch (error) {
            console.error('Error al cargar los pilotos:', error);
            resourcesContainer.innerHTML = '<p>Lo sentimos, no pudimos cargar los pilotos.</p>';
        }
    }

    function renderPilotos(pilotos) {
        resourcesContainer.innerHTML = '';
        
        if (pilotos.length === 0) {
            resourcesContainer.innerHTML = '<p>No se encontraron resultados.</p>';
            return;
        }

        pilotos.forEach(piloto => {
            const card = document.createElement('div');
            card.classList.add('resource-card');
            
            card.setAttribute('data-resource-id', piloto.id);

            // --- CONTENIDO DE LA TARJETA ---
            card.innerHTML = `
                <img src="${piloto.imagen}" alt="${piloto.name}">
                <h3>${piloto.name}</h3>
                <p>${piloto.descripcion_corta}</p>
            `;

            resourcesContainer.appendChild(card);
        });

        // Agregar listeners de clic a todas las tarjetas después de crearlas
        document.querySelectorAll('.resource-card').forEach(card => {
            card.addEventListener('click', () => {
                const pilotoId = parseInt(card.getAttribute('data-resource-id'));
                const piloto = allPilotos.find(res => res.id === pilotoId);
                
                if (piloto) {
                    // --- CONTENIDO DEL MODAL (con enlaces actualizados) ---
                    modalBody.innerHTML = `
                        <img src="${piloto.imagen}" alt="${piloto.name}">
                        <h3>${piloto.name}</h3>
                        <p>${piloto.contenido_completo}</p>
                        
                    `;
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
                }
            });
        });
    }//

    // Manejar el cierre del modal
    if(closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restaurar scroll de fondo
        });
    }

    // Cerrar el modal al hacer clic fuera de la ventana
    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restaurar scroll de fondo
            }
        });
    }

    // 💡 INICIALIZACIÓN: Llama a la función de carga al final de la inicialización.
    fetchPilotos();
}

// 💡 CORRECCIÓN PRINCIPAL 2: Aseguramos la inicialización solo cuando el DOM está listo.
document.addEventListener('DOMContentLoaded', initPilotosCards);