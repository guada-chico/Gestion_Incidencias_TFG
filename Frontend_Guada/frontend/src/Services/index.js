import * as auth from './auth-service.js';
import * as api from './incidencias-service.js';

// Función para el botón de login
async function manejarLogin() {
    try {
        await auth.login('admin.kyocera', '1234'); 
        alert("¡Bienvenido!");
        cargarPanelIncidencias();
    } catch (error) {
        console.error("Fallo al entrar:", error.message);
    }
}

async function cargarPanelIncidencias() {
    const lista = await api.getIncidencias({ pageNumber: 1 });
    console.log("Datos para mostrar en la tabla:", lista.data);
}

if (localStorage.getItem('token')) {
    cargarPanelIncidencias();
}