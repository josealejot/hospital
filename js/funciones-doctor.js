/* =======================================================
   LÓGICA DEL PANEL DE DOCTOR - HOSPITAL CESDE
   ======================================================= */

// --- 1. PROTECCIÓN DE RUTA Y SESIÓN ---
const usuarioActivo = JSON.parse(localStorage.getItem("usuario_activo"));

if (!usuarioActivo || usuarioActivo.rol !== "Doctor") {
    alert("⛔ Acceso denegado. Se requieren permisos de Doctor.");
    window.location.href = "index.html";
} else {
    // Mostrar nombre del doctor
    const elementoBienvenida = document.getElementById("bienvenida-doctor");
    if (elementoBienvenida) {
        elementoBienvenida.textContent = `Dr/a. ${usuarioActivo.nombre}`;
    }

    // Botón de Cerrar Sesión
    document.getElementById("btn-cerrar-sesion").addEventListener("click", function() {
        localStorage.removeItem("usuario_activo");
        window.location.href = "index.html";
    });

    // --- 2. GESTIÓN DE DISPONIBILIDAD (CRUD) ---
    const formularioDisponibilidad = document.getElementById("formulario-disponibilidad");
    const listaHorarios = document.getElementById("lista-horarios");

    if (formularioDisponibilidad) {
        formularioDisponibilidad.addEventListener("submit", function(evento) {
            evento.preventDefault();

            const fecha = document.getElementById("fecha-disponible").value;
            const turno = document.getElementById("turno-disponible").value;

            let disponibilidadHospital = JSON.parse(localStorage.getItem("disponibilidad_hospital")) || [];

            const nuevoHorario = {
                id: Date.now(),
                emailDoctor: usuarioActivo.email,
                fecha: fecha,
                turno: turno
            };

            disponibilidadHospital.push(nuevoHorario);
            localStorage.setItem("disponibilidad_hospital", JSON.stringify(disponibilidadHospital));

            alert("✅ Horario de disponibilidad registrado.");
            formularioDisponibilidad.reset();
            pintarHorarios();
        });
    }

    function pintarHorarios() {
        if (!listaHorarios) return;

        const disponibilidadHospital = JSON.parse(localStorage.getItem("disponibilidad_hospital")) || [];
        // Filtramos solo los horarios de ESTE doctor
        const misHorarios = disponibilidadHospital.filter(horario => horario.emailDoctor === usuarioActivo.email);

        listaHorarios.innerHTML = "";

        if (misHorarios.length === 0) {
            listaHorarios.innerHTML = `<li class="list-group-item text-muted text-center">Sin horarios registrados</li>`;
            return;
        }

        misHorarios.forEach(horario => {
            listaHorarios.innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${horario.fecha}</strong> <br> <small>${horario.turno}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="borrarHorario(${horario.id})">X</button>
                </li>
            `;
        });
    }

    window.borrarHorario = function(idHorario) {
        let disponibilidadHospital = JSON.parse(localStorage.getItem("disponibilidad_hospital")) || [];
        disponibilidadHospital = disponibilidadHospital.filter(horario => horario.id !== idHorario);
        localStorage.setItem("disponibilidad_hospital", JSON.stringify(disponibilidadHospital));
        pintarHorarios();
    };

    // --- 3. VER Y GESTIONAR CITAS ---
    const tablaCitas = document.getElementById("tabla-citas-doctor");

    function pintarCitasDoctor() {
        if (!tablaCitas) return;

        const citasHospital = JSON.parse(localStorage.getItem("citas_hospital")) || [];
        
        // Para simplificar, el doctor verá las citas Confirmadas o Pendientes 
        // En un sistema real, el Admin le asignaría la cita a su correo directamente.
        tablaCitas.innerHTML = "";

        if (citasHospital.length === 0) {
            tablaCitas.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">No hay citas en el sistema.</td></tr>`;
            return;
        }

        citasHospital.forEach(cita => {
            let colorEstado = "bg-warning text-dark"; 
            if (cita.estado === "Confirmada") colorEstado = "bg-primary";
            if (cita.estado === "Atendida") colorEstado = "bg-success";
            if (cita.estado === "Cancelada") colorEstado = "bg-danger";

            // Botón para marcar como atendida (solo si no está cancelada o ya atendida)
            let botonAccion = `<span class="text-muted">Sin acciones</span>`;
            if (cita.estado === "Confirmada" || cita.estado === "Pendiente") {
                botonAccion = `<button class="btn btn-sm btn-success" onclick="marcarComoAtendida(${cita.id})">✔ Marcar Atendida</button>`;
            }

            tablaCitas.innerHTML += `
                <tr>
                    <td>${cita.nombrePaciente}</td>
                    <td>${cita.fecha} - ${cita.hora} <br><small class="text-muted">${cita.especialidad}</small></td>
                    <td><span class="badge ${colorEstado}">${cita.estado}</span></td>
                    <td>${botonAccion}</td>
                </tr>
            `;
        });
    }

    window.marcarComoAtendida = function(idCita) {
        if(confirm("¿Confirmas que ya atendiste a este paciente?")) {
            let citasHospital = JSON.parse(localStorage.getItem("citas_hospital")) || [];
            
            citasHospital.forEach(cita => {
                if (cita.id === idCita) {
                    cita.estado = "Atendida";
                }
            });

            localStorage.setItem("citas_hospital", JSON.stringify(citasHospital));
            pintarCitasDoctor();
        }
    };

    // --- 4. INICIALIZACIÓN ---
    pintarHorarios();
    pintarCitasDoctor();
}