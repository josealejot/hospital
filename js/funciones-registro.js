/* =======================================================
   LÓGICA DE REGISTRO DE PACIENTES - HOSPITAL CESDE
   ======================================================= */

// 1. Capturamos los elementos del DOM
const formularioRegistro = document.getElementById("formulario-registro");
const nombreInput = document.getElementById("nombre-registro");
const emailInput = document.getElementById("email-registro");
const passwordInput = document.getElementById("password-registro");

// 2. Escuchamos el evento de enviar el formulario
formularioRegistro.addEventListener("submit", function(evento) {
    // IMPORTANTE: Prevenir que la página se recargue y borre todo
    evento.preventDefault();

    // 3. Capturamos los valores que escribió el usuario
    const nombre = nombreInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    // 4. Traemos la lista actual de usuarios (o creamos una vacía si es el primero)
    let usuariosHospital = JSON.parse(localStorage.getItem("usuarios_hospital")) || [];

    // --- Validación Extra ---
    // Verificamos que el correo no esté registrado previamente
    const usuarioExistente = usuariosHospital.find(user => user.email === email);
    if (usuarioExistente) {
        alert("⚠️ Este correo ya está registrado. Por favor, inicia sesión.");
        return; // Detenemos la ejecución
    }

    // 5. Creamos el objeto del nuevo usuario
    // Le asignamos el rol "Paciente" por defecto, cumpliendo las reglas del proyecto
    const nuevoPaciente = {
        nombre: nombre,
        email: email,
        password: password,
        rol: "Paciente"
    };

    // 6. Agregamos el nuevo paciente a nuestra lista (Array)
    usuariosHospital.push(nuevoPaciente);

    // 7. Guardamos la lista actualizada en el Local Storage convirtiéndola a Texto
    localStorage.setItem("usuarios_hospital", JSON.stringify(usuariosHospital));

    // 8. Limpiamos el formulario y avisamos del éxito
    formularioRegistro.reset();
    alert("✅ ¡Registro exitoso! Ya puedes iniciar sesión en el sistema hospitalario.");
    
    // Redirigimos automáticamente al Login
    window.location.href = "index.html";
});