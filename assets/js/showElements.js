const tarjetasContainerProjects = document.getElementById("tarjetas-container-projects");
const tarjetasContainerCourseTaken = document.getElementById("tarjetas-container-coursetaken");
const tarjetasContainerCourseTaught = document.getElementById("tarjetas-container-coursetaught");
const tarjetasContainerTitles = document.getElementById("tarjetas-container-titles");
const tarjetasContainerConferences = document.getElementById("tarjetas-container-conferences");

document.addEventListener('DOMContentLoaded', function () {
    try {
        AOS.init();

        if (window.innerWidth < 1024) {
            document.querySelectorAll('[data-aos]').forEach(el => {
                el.removeAttribute('data-aos');
                el.removeAttribute('data-aos-duration');
            });
        }

        fetch("carta.json")
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                // Proyectos
                try {
                    if (tarjetasContainerProjects && Array.isArray(data.project)) {
                        data.project.forEach(project => {
                            tarjetasContainerProjects.appendChild(createTarjeta(project));
                        });
                    }
                } catch (err) {
                    console.error("Error cargando proyectos:", err);
                }

                // Cursos tomados
                try {
                    if (tarjetasContainerCourseTaken && Array.isArray(data.course_taken)) {
                        data.course_taken.forEach(course => {
                            tarjetasContainerCourseTaken.appendChild(createFlipCard(course));
                        });
                    }
                } catch (err) {
                    console.error("Error cargando cursos tomados:", err);
                }

                // Cursos impartidos
                try {
                    if (tarjetasContainerCourseTaught && Array.isArray(data.course_taught)) {
                        data.course_taught.forEach(course => {
                            tarjetasContainerCourseTaught.appendChild(createFlipCard(course));
                        });
                    }
                } catch (err) {
                    console.error("Error cargando cursos impartidos:", err);
                }

                // Títulos
                try {
                    if (tarjetasContainerTitles && Array.isArray(data.titles)) {
                        data.titles.forEach(title => {
                            const img = document.createElement("img");
                            img.loading = "lazy";
                            img.src = title.image_url ?? "";
                            tarjetasContainerTitles.appendChild(img);
                        });
                    }
                } catch (err) {
                    console.error("Error cargando títulos:", err);
                }

                // Conferencias
                try {
                    if (tarjetasContainerConferences && Array.isArray(data.conferences)) {
                        let years = [...new Set(data.conferences.map(conf => conf.year ?? ""))].sort();

                        const timeline = document.createElement("div");
                        timeline.classList.add("timeline-line");

                        const conferencesContainer = document.createElement("div");
                        conferencesContainer.classList.add("conferences-container");

                        tarjetasContainerConferences.appendChild(timeline);
                        tarjetasContainerConferences.appendChild(conferencesContainer);

                        years.forEach(year => {
                            if (!year) return; // Evita años vacíos

                            const pointContainer = document.createElement("div");
                            pointContainer.classList.add("timeline-item");

                            const point = document.createElement("div");
                            point.classList.add("timeline-point");

                            const label = document.createElement("div");
                            label.classList.add("timeline-label");
                            label.innerText = year;

                            pointContainer.append(point, label);
                            timeline.appendChild(pointContainer);

                            const onClick = () => {
                                setActiveYear(year);
                                showConferenceCarousel(year, data.conferences, conferencesContainer);
                            };

                            point.addEventListener("click", onClick);
                            label.addEventListener("click", onClick);
                        });
                    }
                } catch (err) {
                    console.error("Error cargando conferencias:", err);
                }

                // Slick ajustes iniciales
                imagesLoaded(document.querySelectorAll('.tarjetas-container-projects, .tarjetas-container-coursetaken, .tarjetas-container-coursetaught, .tarjetas-container-titles'), function () {
                    $('.tarjetas-container-projects, .tarjetas-container-coursetaken, .tarjetas-container-coursetaught, .tarjetas-container-titles').slick('setPosition');
                });

                $('.tarjetas-container-projects').slick({
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    autoplay: false,
                    arrows: true,
                    dots: true,
                    infinite: false,
                    adaptiveHeight: false,
                    centerMode: false,
                    responsive: [
                        { breakpoint: 1050, settings: { slidesToShow: 1, slidesToScroll: 1 } },
                        { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
                        { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
                    ]
                });

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
                    focusOnSelect: true
                }).on('afterChange', function (event, slick, currentSlide) {
                    slick.$slider.slick('setPosition');
                    slick.$list.height(slick.$slides.eq(currentSlide).outerHeight(true));
                });

                $(window).on('resize orientationchange', function () {
                    $('.tarjetas-container-coursetaken, .tarjetas-container-coursetaught').slick('setPosition');
                });

                $('.tarjetas-container-titles').slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: false,
                    arrows: true,
                    dots: false,
                    adaptiveHeight: false,
                    responsive: [
                        { breakpoint: 1024, settings: { slidesToShow: 1 } },
                        { breakpoint: 768, settings: { slidesToShow: 1 } },
                        { breakpoint: 480, settings: { slidesToShow: 1 } }
                    ]
                });

            })
            .catch((error) => console.error("Error al obtener los datos del archivo JSON:", error));

    } catch (globalError) {
        console.error("Error general en la inicialización:", globalError);
    }
});

// ================= FUNCIONES =================

function createTarjeta(data) {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");
    tarjeta.setAttribute('data-url', data.url ?? "#");

    const luz = document.createElement("div");
    luz.classList.add("tarjeta-luz");

    const punto = document.createElement("div");
    punto.classList.add("tarjeta-punto");

    const imagen = document.createElement("img");
    imagen.src = data.ruta ?? "";
    imagen.alt = data.nombre ?? "";

    const nombreBoton = document.createElement("button");
    nombreBoton.textContent = data.nombre ?? "Ver más";
    nombreBoton.classList.add("tarjeta-nombre");
    nombreBoton.addEventListener("click", () => {
        window.location.href = data.url ?? "#";
    });

    tarjeta.append(luz, punto, imagen, nombreBoton);
    return tarjeta;
}

function createFlipCard(course) {
    const flipCard = document.createElement("div");
    flipCard.classList.add("flip-card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("flip-card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("flip-card-front");

    const img = document.createElement("img");
    img.loading = "lazy";
    img.src = course.imagen ?? "";
    cardFront.appendChild(img);

    const cardBack = document.createElement("div");
    cardBack.classList.add("flip-card-back");

    const flipCardLeft = document.createElement("div");
    flipCardLeft.classList.add("flip-card-left");

    const title = document.createElement("h3");
    title.textContent = course.id ?? "Curso";
    flipCardLeft.appendChild(title);

    const flipCardRight = document.createElement("div");
    flipCardRight.classList.add("flip-card-right");

    const description = document.createElement("p");
    let descriptionText = course.description ?? "";
    if (course.url && course.url.trim() !== "") {
        descriptionText += ` <a href="${course.url}" target="_blank">here</a>.`;
    }
    description.innerHTML = descriptionText;
    flipCardRight.appendChild(description);

    const link = description.querySelector('a');
if (link) {
  // Detiene la propagación del CLICK (para computadora)
  link.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  // Detiene la propagación del TOUCH (para celular)
  link.addEventListener('touchstart', (event) => {
    event.stopPropagation();
  });
}

    cardBack.append(flipCardLeft, flipCardRight);
    cardInner.append(cardFront, cardBack);
    flipCard.appendChild(cardInner);

   const handleFlip = (event) => {
  // Previene que se dispare el evento 'click' justo después del 'touchstart'
  if (event.type === 'touchstart') {
    event.preventDefault();
  }
  flipCard.classList.toggle('flipped');
};

// Asignamos los listeners
flipCard.addEventListener('click', handleFlip);
flipCard.addEventListener('touchstart', handleFlip);

    return flipCard;
}

function adjustGlobalSlideHeights() {
    let maxHeight = 0;
    $('.conference-carousel-container .conference-item').each(function () {
        const thisHeight = $(this).outerHeight(true);
        if (thisHeight > maxHeight) maxHeight = thisHeight;
    });
    $('.conference-carousel-container .conference-item').css('min-height', maxHeight + 'px');
}

function showConferenceCarousel(year, conferences, container) {
    const conferencesForYear = conferences.filter(conf => conf.year === year);

    const carouselContainer = document.createElement("div");
    carouselContainer.classList.add("conference-carousel-container");

    container.innerHTML = '';

    conferencesForYear.forEach(conf => {
        const slideContainer = document.createElement("div");
        slideContainer.classList.add("slide-container");

        const item = document.createElement("div");
        item.classList.add("conference-item");

        const title = document.createElement("h3");
        title.classList.add("conference-title");
        title.innerText = conf.name ?? "Sin título";

        const details = document.createElement("p");
        details.classList.add("conference-details");
        details.innerHTML = `
            <strong>Place:</strong> ${conf.place ?? "N/A"}<br>
            <strong>Category:</strong> ${conf.issue ?? "N/A"}<br>
            <strong>Participation:</strong> ${conf.participation ?? "N/A"}<br>
        `;

        if (conf.url) {
            const link = document.createElement("a");
            link.href = conf.url;
            link.target = "_blank";
            link.classList.add("conference-link");
            link.innerText = "View my participation";
            details.appendChild(link);
        }

        item.append(title, details);
        slideContainer.appendChild(item);
        carouselContainer.appendChild(slideContainer);
    });

    container.appendChild(carouselContainer);

    $(carouselContainer).slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        edgeFriction: 0,
        arrows: true,
        dots: false,
        adaptiveHeight: false,
        variableWidth: false,
        centerPadding: "0px",
        centerMode: false,
        responsive: [
            { breakpoint: 768, settings: { slidesToShow: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } }
        ]
    }).on('init', function () {
        $(carouselContainer).slick('setPosition');
    });

    adjustGlobalSlideHeights();
}

function setActiveYear(selectedYear) {
    document.querySelectorAll(".timeline-item").forEach(item => {
        const label = item.querySelector(".timeline-label");
        const point = item.querySelector(".timeline-point");
        const isActive = label.innerText === selectedYear.toString();
        label.classList.toggle("active", isActive);
        point.classList.toggle("active", isActive);
    });
}
