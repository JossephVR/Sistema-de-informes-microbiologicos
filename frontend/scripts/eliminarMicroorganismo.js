function cargarMicroorganismos() {
    const grupoSeleccionado = document.getElementById('grupo').value;
    const microorganismoDropdown = document.getElementById('microorganismo');

    // Hacer una solicitud al servidor para obtener los microorganismos del grupo seleccionado
    fetch(`/getMicroorganisms?group=${grupoSeleccionado}`)
        .then(response => response.json())
        .then(data => {
            // Limpiar el dropdown actual
            microorganismoDropdown.innerHTML = '';

            // Llenar el dropdown con los nuevos microorganismos
            data.forEach(microorganismo => {
                const option = document.createElement('option');
                option.value = microorganismo.nombre;
                option.text = microorganismo.nombre;
                microorganismoDropdown.appendChild(option);
            });

            // Mostrar el microorganismo seleccionado
            mostrarMicroorganismoSeleccionado();
        })
        .catch(error => {
            console.error('Error al cargar microorganismos:', error);
        });
}

function mostrarMicroorganismoSeleccionado() {
    const microorganismoSeleccionado = document.getElementById('microorganismo').value;
    document.getElementById('nombreMicroorganismo').value = microorganismoSeleccionado;
}

// Añade esta función al script
function cargarMicroorganismos() {
    const grupo = document.getElementById('grupo').value;
    const microorganismoSelect = document.getElementById('microorganismo');

    // Limpia el combo box antes de cargar nuevos elementos
    microorganismoSelect.innerHTML = "";

    // Realiza una petición para obtener los microorganismos según el grupo seleccionado
    fetch(`/getMicroorganisms?group=${encodeURIComponent(grupo)}`)
        .then(response => response.json())
        .then(data => {
            // Agrega las opciones al combo box
            data.forEach(microorganismo => {
                const option = document.createElement('option');
                option.value = microorganismo.nombre;
                option.text = microorganismo.nombre;
                microorganismoSelect.add(option);
            });
        })
        .catch(error => console.error('Error al obtener microorganismos:', error));
}


function eliminarMicroorganismo() {
    const grupo = document.getElementById('grupo').value;
    const microorganismo = document.getElementById('microorganismo').value;

    if (microorganismo.trim() !== "") {
        fetch('/eliminarMicroorganismo', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ grupo, microorganismo }),
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
               
            })
            .catch((error) => {
                console.error('Error al eliminar microorganismo:', error);
                alert('Error al eliminar microorganismo');
            });
    } else {
        alert('Seleccione un microorganismo válido.');
    }
}