const CLAVE = "apellidos-familiares";    // lista de apellidos
const CLAVE_TEXTO = "apellidos-texto";   // texto que se está escribiendo
let apellidos = [];                      // lista de apellidos guardados
// Elementos de la página
const campoApellido = document.getElementById("apellido");
const campoBuscar = document.getElementById("buscar");
const mensaje = document.getElementById("mensaje");
const contador = document.getElementById("contador");
const vacio = document.getElementById("vacio");
const lista = document.getElementById("lista");
// Guarda la lista de apellidos en localStorage
function guardar() {
    localStorage.setItem(CLAVE, JSON.stringify(apellidos));
}
// Recupera lo guardado al abrir o refrescar la página
function cargar() {
    const texto = localStorage.getItem(CLAVE);
    if (texto) apellidos = JSON.parse(texto);
    campoApellido.value = localStorage.getItem(CLAVE_TEXTO) || ""; // texto a medio escribir
    mostrar();
}
// Pone la primera letra de cada palabra en mayúscula (rodríguez -> Rodríguez)
function ponerMayuscula(texto) {
    return texto.toLowerCase().split(" ").map(function (palabra) {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    }).join(" ");
}
// Dibuja la lista de apellidos (solo los que coinciden con la búsqueda)
function mostrar() {
    const buscado = campoBuscar.value.toLowerCase();
    lista.innerHTML = "";
    apellidos.forEach(function (apellido, posicion) {
        // Si el apellido no contiene lo buscado, no se dibuja
        if (!apellido.toLowerCase().includes(buscado)) return;
        // Crea un elemento de lista con el apellido y un botón X
        const item = document.createElement("li");
        const texto = document.createElement("span");
        texto.textContent = apellido;
        const boton = document.createElement("button");
        boton.textContent = "X";
        boton.onclick = function () { quitar(posicion); };
        item.appendChild(texto);
        item.appendChild(boton);
        lista.appendChild(item);
    });
    contador.textContent = "Total: " + apellidos.length;
    vacio.hidden = apellidos.length > 0; // oculta el texto si ya hay apellidos
}
// Agrega uno o varios apellidos (separados por coma)
function agregar() {
    const partes = campoApellido.value.split(",");
    const repetidos = []; // apellidos que ya estaban en la lista
    let hayError = false;
    mensaje.textContent = "";
    partes.forEach(function (parte) {
        const apellido = ponerMayuscula(parte.trim());
        if (apellido === "") return;
        // Solo se permiten letras, espacios, guiones y apóstrofes
        if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/.test(apellido)) { hayError = true; return; }
        if (apellidos.includes(apellido)) { repetidos.push(apellido); return; }
        apellidos.push(apellido);
    });
    // Avisos según lo que pasó
    if (hayError) mensaje.textContent = "Usa solo letras en los apellidos.";
    else if (repetidos.length > 0) mensaje.textContent = "Ya estaba en la lista: " + repetidos.join(", ");
    else if (campoApellido.value.trim() === "") mensaje.textContent = "Escribe al menos un apellido.";
    // Si no hubo error, se limpia el campo
    if (!hayError) {
        campoApellido.value = "";
        localStorage.removeItem(CLAVE_TEXTO);
    }
    guardar();
    mostrar();
}
// Quita un apellido de la lista
function quitar(posicion) {
    apellidos.splice(posicion, 1);
    guardar();
    mostrar();
}
// Eventos: qué pasa cuando el usuario hace algo
document.getElementById("agregar").addEventListener("click", agregar);
campoBuscar.addEventListener("input", mostrar);
// Guarda lo que se escribe, por si se recarga la página
campoApellido.addEventListener("input", function () {
    localStorage.setItem(CLAVE_TEXTO, campoApellido.value);
});
// Pulsar Enter en el campo equivale a pulsar el botón Agregar
campoApellido.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") agregar();
});
// Ordena la lista alfabéticamente
document.getElementById("ordenar").addEventListener("click", function () {
    apellidos.sort(function (a, b) { return a.localeCompare(b, "es"); });
    guardar();
    mostrar();
});
// Borra todos los apellidos (pide confirmación)
document.getElementById("borrar-todo").addEventListener("click", function () {
    if (confirm("¿Seguro que quieres borrar todos los apellidos?")) {
        apellidos = [];
        guardar();
        mostrar();
    }
});
// Al abrir la página se carga lo guardado
cargar();