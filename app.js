document.getElementById('formulario-cliente').addEventListener('submit', function(evento) {
    // 1. Evita que la página se recargue automáticamente al hacer clic en enviar
    evento.preventDefault(); 

    // 2. Capturar los elementos del formulario
    const inputNombre = document.getElementById('nombre');
    const inputEmail = document.getElementById('email');
    const errorNombre = document.getElementById('error-nombre');
    const errorEmail = document.getElementById('error-email');
    const mensajeExito = document.getElementById('mensaje-exito');

    // 3. Reiniciar los mensajes de error en cada intento
    errorNombre.textContent = '';
    errorEmail.textContent = '';
    errorNombre.classList.add('oculto');
    errorEmail.classList.add('oculto');
    mensajeExito.classList.add('oculto');

    let formularioValido = true;

    // 4. Validación del Nombre (Obligatorio)
    if (inputNombre.value.trim() === '') {
        errorNombre.textContent = 'Error: El nombre es un campo obligatorio.';
        errorNombre.classList.remove('oculto');
        formularioValido = false;
    }

    // 5. Validación del Correo (Obligatorio y formato correcto)
    const valorEmail = inputEmail.value.trim();
    if (valorEmail === '') {
        errorEmail.textContent = 'Error: El correo electrónico es obligatorio.';
        errorEmail.classList.remove('oculto');
        formularioValido = false;
    } else if (!valorEmail.includes('@') || !valorEmail.includes('.')) {
        // Mensaje de sugerencia exigido por la rúbrica
        errorEmail.textContent = 'Sugerencia: Revisa el formato de tu correo. Debe contener un "@" y un dominio (ejemplo: usuario@mail.com).';
        errorEmail.classList.remove('oculto');
        formularioValido = false;
    }

    // 6. Acción final si todo está correcto
    if (formularioValido) {
        // Muestra el mensaje de éxito
        mensajeExito.classList.remove('oculto');
        
        // Limpia las casillas del formulario
        this.reset(); 
    }
});