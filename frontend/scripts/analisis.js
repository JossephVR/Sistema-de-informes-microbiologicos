function fillMicroorganisms() {
    var group = document.getElementById("grupo").value;
    var microorganismoSelect = document.getElementById("microorganismo");

    // Clear previous options
    microorganismoSelect.innerHTML = "";

    // Fetch microorganisms based on the selected group from the server
    fetch(`/getMicroorganisms?group=${group}`)
        .then(response => response.json())
        .then(data => {
            // Add new options based on the fetched microorganisms
            data.forEach(microorganismo => {
                var option = document.createElement("option");
                option.text = microorganismo.nombre;
                microorganismoSelect.add(option);
            });
        })
        .catch(error => console.error('Error fetching microorganisms:', error));
     
}

function addOptionsToMicroorganismo(options) {
    var microorganismoSelect = document.getElementById("microorganismo");
    for (var i = 0; i < options.length; i++) {
        var option = document.createElement("option");
        option.text = options[i];
        microorganismoSelect.add(option);
    }
}

function fillUsers() {
    var userSelect = document.getElementById("nombre_usuario");

    // Limpiar opciones anteriores
    userSelect.innerHTML = "";

    // Obtener usuarios desde el servidor
    fetch(`/getUsers`)
        .then(response => response.json())
        .then(data => {
        // Agregar nuevas opciones basadas en los usuarios obtenidos
        data.forEach(user => {
            var option = document.createElement("option");
            option.text = user.nombre_completo;
            userSelect.add(option);
        });
        })
        .catch(error => console.error('Error fetching users:', error));
}

document.getElementById("microorganismForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita el envío del formulario para manejarlo con JavaScript

    // Obtener los valores del formulario
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Enviar los datos al servidor
    fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            // Si la respuesta es exitosa, mostrar la alerta de éxito
            alert("Agregado");
        } else {
            // Si la respuesta es un error, mostrar la alerta con el mensaje de error
            response.json().then(errorData => {
                alert(`Error al agregar: ${errorData.error}`);
            });
        }
    })
    .catch(error => {
        // Si hay un error en la conexión, mostrar un mensaje genérico de error
        console.error("Error al enviar los datos:", error);
        alert("Error al agregar. Por favor, inténtelo de nuevo.");
    });
});

document.getElementById("finishButton").addEventListener("click", function() {
    // Redirigir a la página "/inicio/informe/control"
    window.location.href = "/inicio/analisis/resultado";
});


fillUsers();