const tarjetasContainerProjects = document.getElementById("tarjetas-container-projects");
const tarjetasContainerHobbies = document.getElementById("tarjetas-container-hobbies");

window.onload = function() {
    // Obtener los datos del archivo JSON
    fetch("carta.JSON")
        .then((response) => response.json())
        .then((data) => {
            // Recorrer los datos y crear las tarjetas de proyectos
            data.project.forEach((project) => {
                const tarjeta = createTarjeta(project);
                tarjetasContainerProjects.appendChild(tarjeta);
            });

            // Recorrer los datos y crear las tarjetas de hobbies
            data.hobbie.forEach((hobbie) => {
                const tarjeta = createTarjeta(hobbie);
                tarjetasContainerHobbies.appendChild(tarjeta);
            });

            // Inicializa Slick Carousel después de que las tarjetas hayan sido añadidas
            $('.tarjetas-container-projects').slick({
                slidesToShow: 3, // Número de tarjetas visibles al mismo tiempo
                slidesToScroll: 1, // Número de tarjetas que se desplazan por clic
                autoplay: false,
                arrows: true,
                dots: true,
                adaptiveHeight: true,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1
                        }
                    }
                ]
            });

            // Cambiar tabindex a 0 para los elementos del carrusel
            $('.slick-slide').attr('tabindex', '0');

            // Asignar eventos de clic a los botones después de la inicialización del carrusel
            $(document).on('click', '.tarjeta', function() {
                const url = $(this).closest('.tarjeta').data('url');
                window.location.href = url;
            });
        })
        .catch((error) => console.log("Error al obtener los datos del archivo JSON:", error));
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
    nombreBoton.classList.add("tarjeta-nombre"); // Clase para estilizar el botón como si fuera un nombre
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
