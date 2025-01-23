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

            // Hobbies
            if (tarjetasContainerHobbies && data.hobbie) {
                data.hobbie.forEach((hobbie) => {
                    const tarjeta = createTarjeta(hobbie);
                    tarjetasContainerHobbies.appendChild(tarjeta);
                });
            }
            // cargar las imagenes antes de que se muetren
            imagesLoaded(document.querySelector('.tarjetas-container-coursetaken'), function() {
                $('.tarjetas-container-coursetaken, .tarjetas-container-coursetaught').slick('setPosition');
            });

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
  
            $('.slick-slide').attr('tabindex', '0');

            $(document).on('click', '.tarjeta', function () {
                const url = $(this).closest('.tarjeta').data('url');
                if (url) {
                    window.location.href = url;
                }
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
                adaptiveHeight: true// Ajusta la altura automáticamente
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

    // Parte trasera con dos secciones: izquierda y derecha
    const cardBack = document.createElement("div");
    cardBack.classList.add("flip-card-back");

    // Contenedor para la mitad izquierda (color diferente)
    const flipCardLeft = document.createElement("div");
    flipCardLeft.classList.add("flip-card-left");

    const title = document.createElement("h3");
    title.textContent = course.id; // Usar la ID del curso como título

    flipCardLeft.appendChild(title); // Añadimos el título a la parte izquierda

    // Contenedor para la mitad derecha (contenido adicional)
    const flipCardRight = document.createElement("div");
    flipCardRight.classList.add("flip-card-right");

    const description = document.createElement("p");
    description.textContent = course.description; // Descripción del curso
    flipCardRight.appendChild(description); // Añadimos la descripción a la parte derecha
    // Aquí estamos reemplazando la palabra "url" por el enlace
    const descriptionText = `${course.description}<a href="${course.url}" target="_blank">here</a>.`;
    description.innerHTML = descriptionText; // Inserta HTML dinámicamente

    // Combinar las secciones en la parte trasera
    cardBack.appendChild(flipCardLeft);
    cardBack.appendChild(flipCardRight);

    // Combinar todas las partes en la tarjeta
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    flipCard.appendChild(cardInner);

    return flipCard;
}
