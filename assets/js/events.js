



//IR A LA SECCION A TRAVES DE LOS ENLACES DEL MENU

// Seleccionar todos los enlaces del menú
var menuLinks = document.querySelectorAll("nav a");

// Agregar un evento de clic a cada enlace
menuLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
      event.preventDefault(); // Evitar el comportamiento predeterminado del enlace

      // Obtener el destino del enlace (la sección a la que se debe desplazar)
      var targetId = this.getAttribute("href");

      // Obtener el elemento de destino
      var targetElement = document.querySelector(targetId);

      // Realizar el desplazamiento suave
      targetElement.scrollIntoView({
          behavior: "smooth",
      });
  });
});


window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
      // Si la página es recuperada de la caché, se recarga para asegurar que se ve correctamente
      window.location.reload();
  }
});

