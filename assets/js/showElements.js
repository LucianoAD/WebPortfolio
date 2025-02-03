const tarjetasContainerProjects = document.getElementById("tarjetas-container-projects");
const tarjetasContainerCourseTaken = document.getElementById("tarjetas-container-coursetaken");
const tarjetasContainerCourseTaught = document.getElementById("tarjetas-container-coursetaught");
const tarjetasContainerHobbies = document.getElementById("tarjetas-container-hobbies");
const tarjetasContainerTitles = document.getElementById("tarjetas-container-titles");
const tarjetasContainerConferences = document.getElementById("tarjetas-container-conferences");

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

            // Títulos
            if (tarjetasContainerTitles && data.titles) {
                data.titles.forEach((title) => {
                    const img = document.createElement("img");
                    img.src = title.image_url; 
                    tarjetasContainerTitles.appendChild(img);
                });
            }
            //conferenses
            if (tarjetasContainerConferences && data.conferences) {
                let years = [...new Set(data.conferences.map(conf => conf.year))].sort(); // Ordenamos los años
            
                // Creamos la línea horizontal del timeline
                const timeline = document.createElement("div");
                timeline.classList.add("timeline-line");
            
                // Contenedor para las conferencias (donde se añadirá el carrusel)
                const conferencesContainer = document.createElement("div");
                conferencesContainer.classList.add("conferences-container");
            
                tarjetasContainerConferences.appendChild(timeline); // Agregamos la línea del timeline
                tarjetasContainerConferences.appendChild(conferencesContainer); // Contenedor para las conferencias
            
                // Para cada año, creamos un punto y una etiqueta
                years.forEach((year) => {
                    const pointContainer = document.createElement("div");
                    pointContainer.classList.add("timeline-item");
            
                    const point = document.createElement("div");
                    point.classList.add("timeline-point");
            
                    const label = document.createElement("div");
                    label.classList.add("timeline-label");
                    label.innerText = year;
            
                    pointContainer.appendChild(point);
                    pointContainer.appendChild(label);
                    timeline.appendChild(pointContainer);
            
                    // Añadir evento de click tanto en el punto como en la etiqueta
                    const onClick = () => {
                        // Cambiar el estilo del punto y la etiqueta seleccionada
                        setActiveYear(year);
            
                        // Mostrar el carrusel para el año seleccionado
                        showConferenceCarousel(year, data.conferences, conferencesContainer);
                    };
            
                    point.addEventListener("click", onClick);
                    label.addEventListener("click", onClick);
                });
            }
            imagesLoaded(document.querySelectorAll('.tarjetas-container-coursetaken, .tarjetas-container-coursetaught, .tarjetas-container-titles'), function () {
                $('.tarjetas-container-coursetaken, .tarjetas-container-coursetaught, .tarjetas-container-titles').slick('setPosition');
            });

            // Inicialización de Slick para contenedores horizontales
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

            // Inicialización de Slick para contenedores verticales
            $('.tarjetas-container-coursetaken, .tarjetas-container-coursetaught').slick({
                vertical: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                swipeToSlide: true,
                draggable: true,
                touchThreshold: 10,
                arrows: false,
                dots: false,
                verticalSwiping: true,
                infinite: false,
                adaptiveHeight: true,
                rows: 0,
                focusOnSelect: true,
            }).on('afterChange', function (event, slick, currentSlide) {
                slick.$slider.slick('setPosition');
                slick.$list.height(slick.$slides.eq(currentSlide).outerHeight(true));
            });

            $('.tarjetas-container-titles').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: false,
                arrows: true,
                dots: false,
                adaptiveHeight: false,
                responsive: [
                    { breakpoint: 768, settings: { slidesToShow: 2 } },
                    { breakpoint: 480, settings: { slidesToShow: 1 } }
                ]
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
   // Descripción básica del curso
    let descriptionText = course.description; 

    // Verificar si la URL no está vacía y válida
    if (course.url && course.url.trim() !== "") {
        // Añade el enlace al final solo si hay URL
        descriptionText += ` <a href="${course.url}" target="_blank">here</a>.`;
    }

    // Establecer el contenido de la descripción (HTML dinámico solo si incluye el enlace)
    description.innerHTML = descriptionText;
    flipCardRight.appendChild(description); // Añadir a la parte derecha

    // Combinar las secciones en la parte trasera
    cardBack.appendChild(flipCardLeft);
    cardBack.appendChild(flipCardRight);

    // Combinar todas las partes en la tarjeta
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    flipCard.appendChild(cardInner);

    return flipCard;
}

function showConferenceCarousel(year, conferences, container) {
    // Filtrar las conferencias por año
    const conferencesForYear = conferences.filter(conf => conf.year === year);

    // Crear un contenedor para el carrusel
    const carouselContainer = document.createElement("div");
    carouselContainer.classList.add("conference-carousel-container");

    // Limpiar el contenedor para asegurarse de que no haya duplicados
    container.innerHTML = ''; // Limpiar el contenedor de conferencias

    // Crear el carrusel con las conferencias de ese año
    const conferenceItems = conferencesForYear.map(conf => {
        const item = document.createElement("div");
        item.classList.add("conference-item");

        const img = document.createElement("img");
        img.src = conf.certification;

        const title = document.createElement("h3");
        title.classList.add("conference-title");  // Clase personalizada para el título
        title.innerText = conf.name;

        const details = document.createElement("p");
        details.classList.add("conference-details");  // Clase personalizada para los detalles
        details.innerHTML = `
            <strong>Place:</strong> ${conf.place}<br>
            <strong>Category:</strong> ${conf.issue}<br>
            <strong>Participation:</strong> ${conf.participation}
        `;

        item.appendChild(img);
        item.appendChild(title);
        item.appendChild(details);

        return item;
    });

    // Agregar los items al contenedor del carrusel
    conferenceItems.forEach(item => {
        carouselContainer.appendChild(item);
    });

    // Agregar el carrusel al contenedor de conferencias
    container.appendChild(carouselContainer);

    // Inicializar Slick para el carrusel
    $(carouselContainer).slick({
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
}

function setActiveYear(selectedYear) {
    // Obtener todos los puntos y etiquetas
    const points = document.querySelectorAll(".timeline-point");
    const labels = document.querySelectorAll(".timeline-label");

    // Eliminar la clase active de todos los puntos y etiquetas
    points.forEach((point) => point.classList.remove("active"));
    labels.forEach((label) => label.classList.remove("active"));

    // Agregar la clase active al punto y la etiqueta del año seleccionado
    const selectedPoint = [...points].find((point) => point.innerText === selectedYear.toString());
    const selectedLabel = [...labels].find((label) => label.innerText === selectedYear.toString());

    if (selectedPoint) {
        selectedPoint.classList.add("active");
    }
    if (selectedLabel) {
        selectedLabel.classList.add("active");
    }
}
