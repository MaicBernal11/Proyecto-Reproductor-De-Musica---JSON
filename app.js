// Variables globales
let canciones = [];
let indiceActual = 0;
let estaReproduciendo = false;
let volumenActual = 0.7;
let modoAleatorio = false;
let modoRepetir = false;
const audio = new Audio();

// Inicializar - Cargar canciones desde el archivo JSON
document.addEventListener("DOMContentLoaded", function() {
    
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
