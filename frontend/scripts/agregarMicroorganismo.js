function agregarMicroorganismo() {
    // Obtiene los valores ingresados por el usuario desde el formulario
    const grupo = document.getElementById('grupo').value;
    const nombreMicroorganismo = document.getElementById('nombreMicroorganismo').value;

    // Verifica que el nombre del microorganismo no esté vacío o solo con espacios
    if (nombreMicroorganismo.trim() !== "") {
        // Envía los datos al backend mediante una solicitud POST
        fetch('/addMicroorganismo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ grupo, nombreMicroorganismo }),
        })
            .then(response => response.json())
            .then(data => {
                // Muestra el mensaje recibido del servidor
                alert(data.message);
            })
            .catch((error) => {
                // Manejo de errores si falla la solicitud
                console.error('Error al agregar microorganismo:', error);
                alert('Error al agregar microorganismo');
            });
    } else {
        // Mensaje si el nombre ingresado no es válido
        alert('Ingrese un nombre de microorganismo válido.');
    }
}
