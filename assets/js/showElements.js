const tarjetasContainerProjects = document.getElementById("tarjetas-container-projects");
const tarjetasContainerCourseTaken = document.getElementById("tarjetas-container-coursetaken");
const tarjetasContainerCourseTaught = document.getElementById("tarjetas-container-coursetaught");
const tarjetasContainerHobbies = document.getElementById("tarjetas-container-hobbies");

window.onload = function () {
    fetch("carta.JSON")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Proyectos
            if (tarjetasContainerProjects && data.project) {
                data.project.forEach((project) => {
                    const tarjeta = createTarjeta(project);
                    tarjetasContainerProjects.appendChild(tarjeta);
                });
            }

            // Hobbies
            if (tarjetasContainerHobbies && data.hobbie) {
                data.hobbie.forEach((hobbie) => {
                    const tarjeta = createTarjeta(hobbie);
                    tarjetasContainerHobbies.appendChild(tarjeta);
                });
            }

            // Cursos tomados
            if (tarjetasContainerCourseTaken && data.course_taken) {
                data.course_taken.forEach((course) => {
                    const flipCard = createFlipCard(course);
                    tarjetasContainerCourseTaken.appendChild(flipCard);
                });
            }

            // Cursos impartidos
            if (tarjetasContainerCourseTaught && data.course_taught) {
                data.course_taught.forEach((course) => {
                    const flipCard = createFlipCard(course);
                    tarjetasContainerCourseTaught.appendChild(flipCard);
                });
            }

            // Inicialización de Slick
            $('.tarjetas-container-projects, .tarjetas-container-hobbies').slick({
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: false,
                arrows: true,
                dots: true,
                adaptiveHeight: true,
                responsive: [
                    { breakpoint: 768, settings: { slidesToShow: 2 } },
                    { breakpoint: 480, settings: { slidesToShow: 1 } }
                ]
            });

            $('.tarjetas-container-coursetaken, .tarjetas-container-coursetaught').slick({
                vertical: true, // Establece que el carrusel es vertical
                slidesToShow: 1, // Muestra una tarjeta a la vez
                slidesToScroll: 1,
                swipeToSlide: true, // Permite arrastrar para navegar
                draggable: true, // Habilita el arrastre
                touchThreshold: 10, // Ajusta la sensibilidad del touch
                arrows: false, // Sin flechas de navegación
                dots: false, // Sin indicadores, opcional
                verticalSwiping: true, // Activa el swipe vertical
                infinite: false, // Opcional: sin bucle infinito
            });            

            $('.slick-slide').attr('tabindex', '0');

            $(document).on('click', '.tarjeta', function () {
                const url = $(this).closest('.tarjeta').data('url');
                if (url) {
                    window.location.href = url;
                }
            });
        })
        .catch((error) => console.error("Error al obtener los datos del archivo JSON:", error));
};


function createTarjeta(data) {
    // Crear elementos HTML
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");
    tarjeta.setAttribute('data-url', data.url); // Almacenar la URL en un atributo de datos

    const luz = document.createElement("div");
    luz.classList.add("tarjeta-luz");

    const punto = document.createElement("div");
    punto.classList.add("tarjeta-punto");

    const imagen = document.createElement("img");
    imagen.src = data.ruta;
    imagen.alt = data.nombre;
 
    const nombreBoton = document.createElement("button");
    nombreBoton.textContent = data.nombre;
    nombreBoton.classList.add("tarjeta-nombre"); // Clase para estilizar el botón 
    nombreBoton.addEventListener("click", () => {
        // Acciones al hacer clic en el botón
        window.location.href = data.url; // Navegar a la URL asociada
    });

    // Agregar elementos a la tarjeta
    tarjeta.appendChild(luz);
    tarjeta.appendChild(punto);
    tarjeta.appendChild(imagen);
    tarjeta.appendChild(nombreBoton);

    return tarjeta;

}

function createFlipCard(course) {
    const flipCard = document.createElement("div");
    flipCard.classList.add("flip-card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("flip-card-inner");

    // Parte frontal con la imagen del certificado
    const cardFront = document.createElement("div");
    cardFront.classList.add("flip-card-front");

    const img = document.createElement("img");
    img.src = course.imagen; // Ruta de la imagen desde JSON
    cardFront.appendChild(img);

    // Parte trasera con título y descripción
    const cardBack = document.createElement("div");
    cardBack.classList.add("flip-card-back");

    const title = document.createElement("h3");
    title.textContent = course.id; // Usar la ID del curso como título
    const description = document.createElement("p");
    description.textContent = course.description; // Descripción del curso

    cardBack.appendChild(title);
    cardBack.appendChild(description);

    // Combinar las partes en el flip card
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    flipCard.appendChild(cardInner);

    // Si hay un URL asociado, podemos hacer que toda la tarjeta sea un enlace
    if (course.url) {
        flipCard.addEventListener("click", () => {
            window.location.href = course.url; // Navegar al enlace proporcionado
        });
    }

    return flipCard;
}


//Ocultar la metodologia de los proyectos y desplazarlas al hacer click
document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.querySelector('.toggle-methodology');
    const methodologyContent = document.querySelector('.methodology-content');
    const arrow = document.querySelector('.arrow');

    // Al hacer clic en el botón, alternamos la visibilidad del contenido
    toggleButton.addEventListener('click', function () {
        if (methodologyContent.style.display === 'none' || methodologyContent.style.display === '') {
            methodologyContent.style.display = 'block'; // Mostrar el contenido
            arrow.textContent = '▼';  // Flecha hacia abajo
        } else {
            methodologyContent.style.display = 'none'; // Ocultar el contenido
            arrow.textContent = '➔';  // Flecha hacia la derecha
        }
    });
});

