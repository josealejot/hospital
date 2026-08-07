/* =======================================================
   LÓGICA DE INICIO DE SESIÓN - HOSPITAL CESDE
   ======================================================= */

// 1. Capturamos los elementos del HTML (DOM)
const formularioLogin = document.getElementById("formulario-login");
const emailInput = document.getElementById("email-login");
const passwordInput = document.getElementById("password-login");

// 2. Agregamos el evento al formulario
formularioLogin.addEventListener("submit", function(evento) {
    // IMPORTANTE: Prevenir que la página se recargue
    evento.preventDefault();

    // 3. Capturamos los valores que escribió el usuario
    const email = emailInput.value;
    const password = passwordInput.value;

    // 4. Traemos la lista de usuarios del Local Storage
    const usuariosHospital = JSON.parse(localStorage.getItem("usuarios_hospital")) || [];

    // --- TRUCO DE DESARROLLO (ADMINISTRADOR) ---
    if (email === "admin@hospital.com" && password === "admin123") {
        alert("¡Acceso concedido! Bienvenido, Administrador.");
        
        const adminPrueba = {
            nombre: "Super Admin",
            email: "admin@hospital.com",
            rol: "Administrador"
        };
        localStorage.setItem("usuario_activo", JSON.stringify(adminPrueba));
        window.location.href = "admin.html";
        return; 
    }

    // 5. Buscamos si el usuario normal existe en nuestra base de datos local
    const usuarioEncontrado = usuariosHospital.find(user => user.email === email && user.password === password);

    if (usuarioEncontrado) {
        alert(`¡Acceso concedido! Iniciando sesión como: ${usuarioEncontrado.rol}`);
        
        // Guardamos la sesión del usuario activo en la memoria
        localStorage.setItem("usuario_activo", JSON.stringify(usuarioEncontrado));

        // Redirigimos según el rol correspondiente
        if (usuarioEncontrado.rol === "Paciente") {
            window.location.href = "paciente.html";
        } else if (usuarioEncontrado.rol === "Doctor") {
            window.location.href = "doctor.html";
        } else if (usuarioEncontrado.rol === "Administrador") {
            window.location.href = "admin.html";
        }

    } else {
        alert("❌ Correo o contraseña incorrectos. Si eres un paciente nuevo, por favor regístrate.");
    }
});