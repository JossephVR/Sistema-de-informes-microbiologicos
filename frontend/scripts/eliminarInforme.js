let contenidoDetalleHTML = '';

function cargarDetalle() {
    var identificadorSelect = document.getElementById("identificadorSelect");
    var selectedIndex = identificadorSelect.selectedIndex;

    if (selectedIndex !== -1) {
        var selectedIdentificador = identificadorSelect.options[selectedIndex].value;

        // Solicita el detalle del análisis para el identificador seleccionado
        fetch(`/obtenerAnalisisDetalle?id=${selectedIdentificador}`)
        .then(response => response.json())
        .then(data => {
            // Limpia las tablas antes de agregar nuevos datos
            document.getElementById("tablaInformacionGeneral").innerHTML = "";
            document.getElementById("tablaInformacionResultados").innerHTML = "";

            data.forEach((item, index) => {
                // Solo la primera fila contiene información general
                if (index === 0) {
                    var rowGeneral = document.getElementById("tablaInformacionGeneral").insertRow(-1);
                    rowGeneral.insertCell(0).innerText = item.fecha;
                    rowGeneral.insertCell(1).innerText = item.identificador_muestra;
                    rowGeneral.insertCell(2).innerText = item.nombre_muestra;
                    rowGeneral.insertCell(3).innerText = item.descripcion_muestra;
                    rowGeneral.insertCell(4).innerText = item.nombre_completo;
                }

                // Agrega resultados por cada microorganismo
                var rowResultados = document.getElementById("tablaInformacionResultados").insertRow(-1);
                rowResultados.insertCell(0).innerText = item.grupo;
                rowResultados.insertCell(1).innerText = item.microorganismo;
                rowResultados.insertCell(2).innerText = item.factor_conversion;
                rowResultados.insertCell(3).innerText = item.dilucion_empleada;
                rowResultados.insertCell(4).innerText = item.ufc;
            });
        })
        .catch(error => console.error('Error al cargar el detalle:', error));
    }

    // Solicita las tablas asociadas al análisis
    fetch(`/obtenerTablasAsociadas?id=${selectedIdentificador}`)
        .then(response => response.json())
        .then(tablasData => {
            mostrarTablas(tablasData);
            capturarYDescargarPantalla(); // Captura visual para descarga
        })
        .catch(error => console.error('Error al obtener las tablas asociadas:', error));
}

function mostrarTablas(tablasData) {
    var tablasContainer = document.getElementById("tablasContainer");
    tablasContainer.innerHTML = "";

    tablasData.forEach(tabla => {
        // Crea una nueva tabla HTML para cada conjunto de datos
        var table = document.createElement("table");
        table.innerHTML = `<caption>${tabla.nombre}</caption>`;

        // Genera la fila de encabezados
        var headerRow = table.insertRow(0);
        Object.keys(tabla.columnas).forEach(columna => {
            var th = document.createElement("th");
            th.textContent = columna;
            headerRow.appendChild(th);
        });

        // Llena la tabla con los datos
        tabla.datos.forEach(fila => {
            var row = table.insertRow(-1);
            Object.values(fila).forEach(valor => {
                var cell = row.insertCell(-1);
                cell.textContent = valor;
            });
        });

        tablasContainer.appendChild(table);
    });
}

// Al cargar la página, se llena el select con los identificadores disponibles
document.addEventListener("DOMContentLoaded", function () {
    var identificadorSelect = document.getElementById("identificadorSelect");

    fetch('/obtenerAnalisis')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                var option = document.createElement("option");
                option.value = item.identificador_muestra;
                option.text = `Identificador: ${item.identificador_muestra}   ||   Fecha: ${item.fecha}   ||   Usuario: ${item.nombre_completo}`;
                identificadorSelect.add(option);
            });
        })
        .catch(error => console.error('Error al cargar los identificadores:', error));
});

// Función para eliminar un análisis seleccionado
function eliminarInformacion() {
    var identificadorSelect = document.getElementById("identificadorSelect");
    var selectedIndex = identificadorSelect.selectedIndex;

    if (selectedIndex !== -1) {
        var selectedIdentificador = identificadorSelect.options[selectedIndex].value;

        // Envía solicitud DELETE al servidor
        fetch(`/eliminarAnalisis?id=${selectedIdentificador}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                location.reload(); // Recarga la página tras la eliminación
            } else {
                alert('Error al eliminar el informe');
            }
        })
        .catch(error => console.error('Error al eliminar el informe:', error));
    }
}
