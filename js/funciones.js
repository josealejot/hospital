

// 1. Capturamos los elementos del HTML (DOM)
const formularioLogin = document.getElementById("formulario-login");
const emailInput = document.getElementById("email-login");
const passwordInput = document.getElementById("password-login");

// 2. Agregamos el evento al formulario
formularioLogin.addEventListener("submit", function(evento) {
    // IMPORTANTE: Prevenir que la página se recargue y borre la consola
    evento.preventDefault();

    // 3. Capturamos los valores (.value) que escribió el usuario
    const email = emailInput.value;
    const password = passwordInput.value;

    // 4. Traemos la lista de usuarios del Local Storage
    // Usamos JSON.parse() para convertir el texto guardado de vuelta a un Array. 
    // Si no hay nada, el operador || [] crea un array vacío para que no dé error.
    const usuariosHospital = JSON.parse(localStorage.getItem("usuarios_hospital")) || [];

    // --- TRUCO DE DESARROLLO ---
    // Como el proyecto pide un Administrador, dejamos uno "quemado" (hardcoded) 
    // por defecto para poder hacer pruebas sin tener que registrarnos.
    if (email === "admin@hospital.com" && password === "admin123") {
        alert("¡Acceso concedido! Bienvenido, Administrador.");
        // Más adelante activaremos esta redirección:
        // window.location.href = "admin_dashboard.html";
        return; // Detenemos la ejecución aquí
    }

    // 5. Buscamos si el usuario existe en nuestra base de datos local
    const usuarioEncontrado = usuariosHospital.find(user => user.email === email && user.password === password);

    if (usuarioEncontrado) {
        alert(`¡Acceso concedido! Iniciando sesión como: ${usuarioEncontrado.rol}`);
        // Aquí luego pondremos un switch para redirigir a doctor.html o paciente.html
    } else {
        alert("❌ Correo o contraseña incorrectos. Si eres un paciente nuevo, por favor regístrate.");
    }
});