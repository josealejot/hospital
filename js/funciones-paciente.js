/* =======================================================
   LÓGICA DEL PANEL DE PACIENTE - HOSPITAL CESDE
   ======================================================= */

// --- 1. PROTECCIÓN DE RUTA Y SESIÓN ---
// Leemos el usuario activo desde el Local Storage
const usuarioActivo = JSON.parse(localStorage.getItem("usuario_activo"));

// Si NO hay un usuario con sesión iniciada O su rol no es "Paciente"
if (!usuarioActivo || usuarioActivo.rol !== "Paciente") {
    alert("⛔ Acceso denegado. Debes iniciar sesión como Paciente.");
    window.location.href = "index.html"; // Redirigimos al Login
} else {
    // TODO el código del panel solo se ejecuta si el usuario pasó la validación de arriba

    // Mostrar el nombre del paciente en la barra de navegación
    const elementoBienvenida = document.getElementById("bienvenida-usuario");
    if (elementoBienvenida) {
        elementoBienvenida.textContent = `Bienvenido(a), ${usuarioActivo.nombre}`;
    }

    // Lógica para cerrar sesión
    const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", function() {
            localStorage.removeItem("usuario_activo"); // Eliminamos la sesión activa
            window.location.href = "index.html"; // De vuelta al login
        });
    }

    // --- 2. CAPTURA DE ELEMENTOS DEL DOM ---
    const formularioCitas = document.getElementById("formulario-citas");
    const especialidadInput = document.getElementById("especialidad-cita");
    const fechaInput = document.getElementById("fecha-cita");
    const horaInput = document.getElementById("hora-cita");
    const tablaCitas = document.getElementById("tabla-citas");

    // --- 3. CRUD: CREAR (AGENDAR CITA) ---
    if (formularioCitas) {
        formularioCitas.addEventListener("submit", function(evento) {
            evento.preventDefault(); // Evitamos que la página se recargue

            // Leemos las citas guardadas o creamos un array vacío
            let citasHospital = JSON.parse(localStorage.getItem("citas_hospital")) || [];

            // Creamos el objeto de la nueva cita
            const nuevaCita = {
                id: Date.now(), // Identificador único
                emailPaciente: usuarioActivo.email,
                nombrePaciente: usuarioActivo.nombre,
                especialidad: especialidadInput.value,
                fecha: fechaInput.value,
                hora: horaInput.value,
                estado: "Pendiente" // Estado inicial por regla de negocio
            };

            // Guardamos en Local Storage
            citasHospital.push(nuevaCita);
            localStorage.setItem("citas_hospital", JSON.stringify(citasHospital));

            alert("✅ Cita agendada correctamente.");
            formularioCitas.reset();
            pintarTabla(); // Actualizamos la tabla
        });
    }

    // --- 4. CRUD: LEER (MOSTRAR HISTORIAL DE CITAS) ---
    function pintarTabla() {
        if (!tablaCitas) return;

        const citasHospital = JSON.parse(localStorage.getItem("citas_hospital")) || [];
        
        // Filtramos para mostrar ÚNICAMENTE las citas del paciente actual
        const misCitas = citasHospital.filter(cita => cita.emailPaciente === usuarioActivo.email);

        tablaCitas.innerHTML = "";

        // Si el paciente aún no tiene citas
        if (misCitas.length === 0) {
            tablaCitas.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-3">No tienes citas agendadas aún.</td>
                </tr>
            `;
            return;
        }

        // Si tiene citas, las dibujamos en la tabla
        misCitas.forEach(cita => {
            let colorEstado = "bg-warning text-dark"; // Pendiente
            if (cita.estado === "Confirmada") colorEstado = "bg-primary";
            if (cita.estado === "Atendida") colorEstado = "bg-success";
            if (cita.estado === "Cancelada") colorEstado = "bg-danger";

            let botonAccion = "";
            if (cita.estado === "Pendiente" || cita.estado === "Confirmada") {
                botonAccion = `<button class="btn btn-sm btn-outline-danger" onclick="cancelarCita(${cita.id})">Cancelar</button>`;
            } else {
                botonAccion = `<span class="text-muted">Sin acciones</span>`;
            }

            tablaCitas.innerHTML += `
                <tr>
                    <td>${cita.fecha}</td>
                    <td>${cita.hora}</td>
                    <td>${cita.especialidad}</td>
                    <td><span class="badge ${colorEstado}">${cita.estado}</span></td>
                    <td>${botonAccion}</td>
                </tr>
            `;
        });
    }

    // --- 5. CRUD: ACTUALIZAR (CANCELAR CITA) ---
    window.cancelarCita = function(idCita) {
        if (confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
            let citasHospital = JSON.parse(localStorage.getItem("citas_hospital")) || [];

            citasHospital.forEach(cita => {
                if (cita.id === idCita) {
                    cita.estado = "Cancelada";
                }
            });

            localStorage.setItem("citas_hospital", JSON.stringify(citasHospital));
            pintarTabla();
        }
    };

    // --- 6. INICIALIZACIÓN ---
    pintarTabla();
}