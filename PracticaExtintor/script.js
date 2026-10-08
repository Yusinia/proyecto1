const cartel = document.querySelector(".cartel");
const status = document.querySelector(".status");

let contexto;
let fuente;
let volumen;
let mouseEncima = false;
let habilitado = false;

function register(texto) {
  status.textContent = texto;
}

function crearSonido() {
  const duracion = 4;
  const frecuencia = contexto.sampleRate;
  const cantidad = frecuencia * duracion;

  const buffer = contexto.createBuffer(
    1,
    cantidad,
    frecuencia
  );

  const datos = buffer.getChannelData(0);

  let anterior = 0;

  for (let i = 0; i < cantidad; i++) {
    const ruido = Math.random() * 2 - 1;

    anterior = anterior * 0.85 + ruido * 0.15;
    datos[i] = anterior * 0.25;
  }

  for (let chispa = 0; chispa < 100; chispa++) {
    const inicio = Math.floor(
      Math.random() * (cantidad - 1500)
    );

    const largo = 100 + Math.floor(Math.random() * 1400);
    const fuerza = 0.2 + Math.random() * 0.6;

    for (let j = 0; j < largo; j++) {
      const ruido = Math.random() * 2 - 1;
      const caida = Math.exp(-j / (largo / 6));

      datos[inicio + j] += ruido * fuerza * caida;
    }
  }

  return buffer;
}

function reproducir() {
  if (!habilitado || contexto.state !== "running") {
    register("Haga clic en el cartel para habilitar el sonido.");
    return;
  }

  if (fuente) {
    return;
  }

  fuente = contexto.createBufferSource();
  fuente.buffer = crearSonido();
  fuente.loop = true;

  volumen = contexto.createGain();
  volumen.gain.value = 0.6;

  fuente.connect(volumen);
  volumen.connect(contexto.destination);

  fuente.start();

  register("Sonido de fuego reproduciéndose.");
}

function detener() {
  if (fuente) {
    fuente.stop();
    fuente.disconnect();
    volumen.disconnect();

    fuente = null;
    volumen = null;
  }

  register("Sonido detenido.");
}

cartel.addEventListener("click", async () => {
  try {
    if (!contexto) {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      contexto = new AudioContext();
    }

    await contexto.resume();
    habilitado = contexto.state === "running";

    mouseEncima = cartel.matches(":hover");

    if (mouseEncima && !document.hidden) {
      reproducir();
    } else {
      register("Sonido habilitado. Pase el mouse por el cartel.");
    }
  } catch (error) {
    register("No se pudo habilitar el sonido.");
    console.error(error);
  }
});

cartel.addEventListener("mouseenter", () => {
  mouseEncima = true;
  reproducir();
});

cartel.addEventListener("mouseleave", () => {
  mouseEncima = false;
  detener();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    mouseEncima = false;
    detener();
  }
});

register("Haga clic en el cartel para habilitar el sonido.");