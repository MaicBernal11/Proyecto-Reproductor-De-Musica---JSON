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

// Alterna entre reproducir y pausar la canción
function reproducir() {
    if (estaReproduciendo) {
        audio.pause();
        estaReproduciendo = false;
    } else {
        audio.play();
        estaReproduciendo = true;
    }
    actualizarIconoPlay();
}

// Cambia el ícono del botón play/pause
function actualizarIconoPlay() {
    document.querySelectorAll(".play-btn i").forEach(icono => {
        if (estaReproduciendo) {
            icono.className = "bi bi-pause-fill";
        } else {
            icono.className = "bi bi-play-fill";
        }
    });
}

// Reproduce la canción anterior (navegación cíclica)
function cancionAnterior() {
    if (indiceActual === 0) {
        indiceActual = canciones.length - 1;
    } else {
        indiceActual--;
    }
    mostrarCancion(indiceActual);
    if (estaReproduciendo) {
        audio.play();
    }
}

// Reproduce la siguiente canción (con soporte para modo aleatorio)
function cancionSiguiente() {
    if (modoAleatorio) {
        // Selecciona una canción aleatoria diferente a la actual
        let nuevoIndice;
        do {
            nuevoIndice = Math.floor(Math.random() * canciones.length);
        } while (nuevoIndice === indiceActual && canciones.length > 1);
        indiceActual = nuevoIndice;
    } else {
        // Avanza a la siguiente canción de forma secuencial
        if (indiceActual === canciones.length - 1) {
            indiceActual = 0;
        } else {
            indiceActual++;
        }
    }
    mostrarCancion(indiceActual);
    if (estaReproduciendo) {
        audio.play();
    }
}

// Activa o desactiva el modo aleatorio
function toggleShuffle() {
    modoAleatorio = !modoAleatorio;
    document.querySelectorAll(".shuffle-btn").forEach(btn => {
        if (modoAleatorio) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

// Activa o desactiva el modo repetir
function toggleRepeat() {
    modoRepetir = !modoRepetir;
    document.querySelectorAll(".repeat-btn").forEach(btn => {
        if (modoRepetir) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

// Permite cambiar la posición de reproducción al hacer clic en la barra
function cambiarProgreso(evento) {
    const contenedor = evento.currentTarget;
    const rect = contenedor.getBoundingClientRect();
    const posicion = (evento.clientX - rect.left) / rect.width;

    if (audio.duration) {
        audio.currentTime = posicion * audio.duration;
    }
}

// Actualiza la barra de progreso y el tiempo actual de reproducción
function actualizarProgreso() {
    if (audio.duration) {
        // Calcula y actualiza el porcentaje de progreso
        const porcentaje = (audio.currentTime / audio.duration) * 100;

        document.querySelectorAll(".progress-bar").forEach(barra => {
            barra.style.width = porcentaje + "%";
        });

        // Formatea y muestra el tiempo actual
        const minutos = Math.floor(audio.currentTime / 60);
        const segundos = Math.floor(audio.currentTime % 60);
        const segundosFormato = segundos < 10 ? "0" + segundos : segundos;

        document.querySelectorAll(".current-time").forEach(el => {
            el.innerHTML = minutos + ":" + segundosFormato;
        });
    }
}

// Inicializa los eventos del reproductor de audio
function inicializarEventos() {
    // Actualiza el progreso continuamente mientras se reproduce
    audio.addEventListener("timeupdate", actualizarProgreso);

    // Maneja el evento cuando termina una canción
    audio.addEventListener("ended", function () {
        if (modoRepetir) {
            audio.currentTime = 0;
            audio.play();
        } else {
            cancionSiguiente();
        }
    });
}