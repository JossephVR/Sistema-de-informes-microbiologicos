// Agrega un listener al formulario para manejar el envío personalizado
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita el comportamiento por defecto del formulario (recargar la página)
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Envía una solicitud POST al backend con las credenciales
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }) // Convierte los datos a JSON
        });

        const data = await response.json();

        if (response.ok) {
            // Si el login fue exitoso, redirige al usuario a la página de inicio
            window.location.href = "/inicio"; 
        } else {
            // Si hubo un error en el login, muestra un mensaje al usuario
            alert(data.error); 
        }
    } catch (error) {
        // Captura errores de red u otros imprevistos
        console.error('Error:', error);
    }
});
