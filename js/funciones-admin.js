/* =======================================================
   LÓGICA DEL PANEL DE ADMINISTRADOR - HOSPITAL CESDE
   ======================================================= */

// --- 1. PROTECCIÓN DE RUTA Y SESIÓN ---
const usuarioActivo = JSON.parse(localStorage.getItem("usuario_activo"));

// Si no hay sesión o el rol no es Administrador, lo enviamos al Login
if (!usuarioActivo || usuarioActivo.rol !== "Administrador") {
    alert("⛔ Acceso denegado. Se requieren permisos de Administrador.");
    window.location.href = "index.html";
} else {
    // Se ejecuta únicamente si es Administrador

    // Saludo en el Navbar
    const elementoBienvenida = document.getElementById("bienvenida-admin");
    if (elementoBienvenida) {
        elementoBienvenida.textContent = `Admin: ${usuarioActivo.nombre || 'Administrador'}`;
    }

    // Botón de Cerrar Sesión
    const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", function() {
            localStorage.removeItem("usuario_activo");
            window.location.href = "index.html";
        });
    }

    // --- 2. CAPTURA DE ELEMENTOS DEL DOM ---
    const tablaUsuarios = document.getElementById("tabla-usuarios");
    const tablaTodasCitas = document.getElementById("tabla-todas-citas");


    // --- 3. GESTIÓN DE USUARIOS Y ASIGNACIÓN DE ROLES ---
    function pintarUsuarios() {
        if (!tablaUsuarios) return;

        // Cargamos los usuarios guardados
        const usuariosHospital = JSON.parse(localStorage.getItem("usuarios_hospital")) || [];
        tablaUsuarios.innerHTML = "";

        if (usuariosHospital.length === 0) {
            tablaUsuarios.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted py-3">No hay usuarios registrados aún.</td>
                </tr>
            `;
            return;
        }

        usuariosHospital.forEach((usuario, indice) => {
            // Badges de colores según rol
            let colorRol = "bg-info text-dark"; // Paciente
            if (usuario.rol === "Doctor") colorRol = "bg-warning text-dark";
            if (usuario.rol === "Administrador") colorRol = "bg-danger text-white";

            tablaUsuarios.innerHTML += `
                <tr>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.email}</td>
                    <td><span class="badge ${colorRol}">${usuario.rol}</span></td>
                    <td>
                        <select class="form-select form-select-sm d-inline-block w-auto me-2" id="select-rol-${indice}">
                            <option value="Paciente" ${usuario.rol === 'Paciente' ? 'selected' : ''}>Paciente</option>
                            <option value="Doctor" ${usuario.rol === 'Doctor' ? 'selected' : ''}>Doctor</option>
                            <option value="Administrador" ${usuario.rol === 'Administrador' ? 'selected' : ''}>Administrador</option>
                        </select>
                        <button class="btn btn-sm btn-primary" onclick="cambiarRol('${usuario.email}', ${indice})">Guardar</button>
                    </td>
                </tr>
            `;
        });
    }

    // Función para cambiar y guardar el rol en Local Storage
    window.cambiarRol = function(emailUsuario, indice) {
        const selectRol = document.getElementById(`select-rol-${indice}`);
        const nuevoRol = selectRol.value;

        let usuariosHospital = JSON.parse(localStorage.getItem("usuarios_hospital")) || [];

        usuariosHospital.forEach(user => {
            if (user.email === emailUsuario) {
                user.rol = nuevoRol;
            }
        });

        localStorage.setItem("usuarios_hospital", JSON.stringify(usuariosHospital));
        alert(`✅ Rol de ${emailUsuario} actualizado a: ${nuevoRol}`);
        pintarUsuarios(); // Repintamos la tabla
    };


    // --- 4. CONTROL GENERAL DE TODAS LAS CITAS ---
    function pintarTodasLasCitas() {
        if (!tablaTodasCitas) return;

        const citasHospital = JSON.parse(localStorage.getItem("citas_hospital")) || [];
        tablaTodasCitas.innerHTML = "";

        if (citasHospital.length === 0) {
            tablaTodasCitas.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-3">No hay citas registradas en el sistema.</td>
                </tr>
            `;
            return;
        }

        citasHospital.forEach(cita => {
            let colorEstado = "bg-warning text-dark"; // Pendiente
            if (cita.estado === "Confirmada") colorEstado = "bg-primary";
            if (cita.estado === "Atendida") colorEstado = "bg-success";
            if (cita.estado === "Cancelada") colorEstado = "bg-danger";

            tablaTodasCitas.innerHTML += `
                <tr>
                    <td>${cita.nombrePaciente} <br><small class="text-muted">${cita.emailPaciente}</small></td>
                    <td>${cita.fecha} - ${cita.hora}</td>
                    <td>${cita.especialidad}</td>
                    <td><span class="badge ${colorEstado}">${cita.estado}</span></td>
                    <td>
                        <select class="form-select form-select-sm d-inline-block w-auto" onchange="cambiarEstadoCita(${cita.id}, this.value)">
                            <option value="Pendiente" ${cita.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="Confirmada" ${cita.estado === 'Confirmada' ? 'selected' : ''}>Confirmada</option>
                            <option value="Atendida" ${cita.estado === 'Atendida' ? 'selected' : ''}>Atendida</option>
                            <option value="Cancelada" ${cita.estado === 'Cancelada' ? 'selected' : ''}>Cancelada</option>
                        </select>
                    </td>
                </tr>
            `;
        });
    }

    // Función para cambiar el estado de cualquier cita
    window.cambiarEstadoCita = function(idCita, nuevoEstado) {
        let citasHospital = JSON.parse(localStorage.getItem("citas_hospital")) || [];

        citasHospital.forEach(cita => {
            if (cita.id === idCita) {
                cita.estado = nuevoEstado;
            }
        });

        localStorage.setItem("citas_hospital", JSON.stringify(citasHospital));
        pintarTodasLasCitas();
    };


    // --- 5. INICIALIZACIÓN ---
    pintarUsuarios();
    pintarTodasLasCitas();
}