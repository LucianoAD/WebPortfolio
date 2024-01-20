//Lee un archivo JSON con infromacion de la carta y los muestra en el DOOM
const tarjetasContainer = document.getElementById("tarjetas-container");

// Obtener los datos del archivo JSON
fetch("carta.JSON")
    .then((response) => response.json())
    .then((data) => {
        // Recorrer los datos y crear las tarjetas
        data.project.forEach((project) => {
            
            // Crear elementos HTML

            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta");
            
            const luz = document.createElement("div");
            
            const punto = document.createElement("luz");
            luz.classList.add("tarjeta-luz");

            const imagen = document.createElement("img");
            imagen.src = project.ruta;
            imagen.alt = project.nombre;

            const nombre = document.createElement("h3");
            nombre.textContent = project.nombre;

            const btn = document.createElement("button"); 
            btn.textContent = "More...";
            btn.classList.add("tarjeta-button");

            // Agregar evento de clic al botón
            btn.addEventListener("click", () => {
                const url = project.url;
                window.location.href = url;
            });

            // Agregar elementos a la tarjeta
            tarjeta.appendChild(luz);
            tarjeta.appendChild(punto);
            tarjeta.appendChild(imagen);
            tarjeta.appendChild(nombre);
            tarjeta.appendChild(btn);

            // Agregar la tarjeta al contenedor
            tarjetasContainer.appendChild(tarjeta);
        });
    })
    .catch((error) => console.log("Error al obtener los datos del archivo JSON:", error));



