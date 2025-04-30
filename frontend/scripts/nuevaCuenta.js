document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el envío predeterminado del formulario
    
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const nombre_completo = document.getElementById('nombre_completo').value;


    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, contrasena, nombre_completo})
        });

        if (response.ok) {
            alert('Cuenta creada exitosamente');
            window.location.href = "/"; // Redirigir a la página de inicio de sesión
        } else {
            const data = await response.json();
            alert(data.error); // Mostrar mensaje de error si hay algún problema en la creación de la cuenta
        }
    } catch (error) {
        console.error('Error:', error);
    }
});