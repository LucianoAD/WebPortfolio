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

