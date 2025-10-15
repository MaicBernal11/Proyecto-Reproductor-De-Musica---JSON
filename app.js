// Variables globales
let canciones = [];
let indiceActual = 0;
let estaReproduciendo = false;
let volumenActual = 0.7;
let modoAleatorio = false;
let modoRepetir = false;
const audio = new Audio();

// Inicializar - Cargar canciones desde el archivo JSON
document.addEventListener("DOMContentLoaded", function () {

    // Se realiza una petición para obtener los datos del archivo JSON
    fetch("canciones.json")
        .then(response => response.json()) // Se convierte la respuesta a formato JSON
        .then(data => {

            // Guardamos los datos del archivo JSON en el arreglo "canciones"
            canciones = data;

            // Mostramos la primera canción
            mostrarCancion(indiceActual);

            // Llenamos la lista de canciones
            llenarPlaylist();

            // Inicializamos los eventos del reproductor
            inicializarEventos();

        })
        // Si ocurre un error al cargar el archivo, se muestra en la consola
        .catch(error => {
            console.error("Error al cargar las canciones:", error);
            // Mostrar mensaje de error al usuario
            document.querySelectorAll(".song-title").forEach(el => {
                el.innerHTML = "Error al cargar canciones";
            });
        });
});

function mostrarCancion(indice) {
    const cancionActual = canciones[indice];

    document.querySelectorAll(".song-title").forEach(el => {
        el.innerHTML = cancionActual.nombre;
    });

    document.querySelectorAll(".artist").forEach(el => {
        el.innerHTML = cancionActual.artista;
    });

    document.querySelectorAll(".album-image").forEach(el => {
        el.src = cancionActual.portada;
    });

    document.querySelectorAll(".total-time").forEach(el => {
        el.innerHTML = cancionActual.duración;
    });

    audio.src = cancionActual.cancion;
    audio.volume = volumenActual;

    actualizarPlaylistActiva();
}



// Llena la lista de canciones en la interfaz de playlist
function llenarPlaylist() {
    const contenedorLista = document.querySelector(".songs-list");
    contenedorLista.innerHTML = "";

    // Recorre cada canción y crea un elemento en la lista
    canciones.forEach(function (cancion, index) {
        const itemCancion = document.createElement("div");
        itemCancion.className = "song-item";

        // Marca como activa la canción actual
        if (index === indiceActual) {
            itemCancion.classList.add("active");
        }

        // Construye el HTML del item con información de la canción
        itemCancion.innerHTML =
            '<div class="song-number">' + (index + 1) + '</div>' +
            '<img src="' + cancion.portada + '" alt="' + cancion.nombre + '" class="song-thumb">' +
            '<div class="song-info">' +
            '<div class="song-name">' + cancion.nombre + '</div>' +
            '<div class="song-artist">' + cancion.artista + ' • ' + cancion.duración + '</div>' +
            '</div>' +
            '<div class="now-playing-indicator">▶</div>';

        // Al hacer clic, reproduce la canción seleccionada
        itemCancion.addEventListener("click", function () {
            indiceActual = index;
            mostrarCancion(indiceActual);
            audio.play();
            estaReproduciendo = true;
            actualizarIconoPlay();
        });

        contenedorLista.appendChild(itemCancion);
    });

    // Actualiza el contador de canciones
    document.querySelector(".songs-count").innerHTML = canciones.length + " songs";
}

// Actualiza visualmente qué canción está activa en la playlist
function actualizarPlaylistActiva() {
    document.querySelectorAll(".song-item").forEach(function (item, idx) {
        if (idx === indiceActual) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}
