const cartel = document.querySelector(".cartel");
const status = document.querySelector(".status");

const sonido = new Audio("./fuego.mp3");
sonido.loop = true;
sonido.volume = 0.5;

let mouseEncima = false;

function detener() {
    sonido.pause();
    sonido.currentTime = 0;
}

function reproducir() {
    sonido.play().then(function() {
        if (!mouseEncima) {
            detener();
        }
    }).catch(function(error) {
        if (error.name === "NotAllowedError") {
            status.textContent =
                "Haga clic en el cartel para habilitar el sonido.";
        } else if (error.name !== "AbortError") {
            status.textContent =
                "No se pudo reproducir fuego.mp3. Revise el archivo.";
        }

        console.log("Error de audio:", error);
    });
}

cartel.addEventListener("mouseenter", function() {
    mouseEncima = true;
    reproducir();
});

cartel.addEventListener("mouseleave", function() {
    mouseEncima = false;
    detener();
});

cartel.addEventListener("click", function() {
    mouseEncima = true;
    reproducir();
});

sonido.addEventListener("play", function() {
    status.textContent = "Sonido de fuego reproduciéndose.";
});

sonido.addEventListener("pause", function() {
    status.textContent = "Sonido detenido.";
});

sonido.addEventListener("error", function() {
    status.textContent =
        "No se pudo cargar fuego.mp3. Revise su nombre y ubicación.";
});

document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        mouseEncima = false;
        detener();
    }
});