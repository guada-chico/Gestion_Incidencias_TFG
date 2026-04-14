import * as auth from './auth-service.js';
import * as api from './incidencias-service.js';

// Función para el botón de login
async function manejarLogin() {
    try {
        // En lugar de valores fijos, podrías tomarlos de inputs:
        // const user = document.getElementById('username').value;
        await auth.login('admin.kyocera', '1234'); 
        alert("¡Bienvenido!");
        cargarPanelIncidencias();
    } catch (error) {
        console.error("Fallo al entrar:", error.message);
    }
}

// Función para cargar la lista
async function cargarPanelIncidencias() {
    const lista = await api.getIncidencias({ pageNumber: 1 });
    console.log("Datos para mostrar en la tabla:", lista.data);
    // Aquí mapearías lista.data a tu tabla HTML
}

// Ejecutar algo al cargar la página si ya hay token
if (localStorage.getItem('token')) {
    cargarPanelIncidencias();
}