let contenidoDetalleHTML = '';

function cargarDetalle() {
    var identificadorSelect = document.getElementById("identificadorSelect");
    var selectedIndex = identificadorSelect.selectedIndex;

    if (selectedIndex !== -1) {
        var selectedIdentificador = identificadorSelect.options[selectedIndex].value;

        // Solicita los detalles del análisis para el identificador seleccionado
        fetch(`/obtenerAnalisisDetalle?id=${selectedIdentificador}`)
            .then(response => response.json())
            .then(data => {
                // Limpia el contenido anterior
                document.getElementById("tablaInformacionGeneral").innerHTML = "";
                document.getElementById("tablaInformacionResultados").innerHTML = "";

                data.forEach((item, index) => {
                    if (index === 0) {
                        // Muestra la información general (una sola vez)
                        var rowGeneral = document.getElementById("tablaInformacionGeneral").insertRow(-1);
                        rowGeneral.insertCell(0).innerText = item.fecha;
                        rowGeneral.insertCell(1).innerText = item.identificador_muestra;
                        rowGeneral.insertCell(2).innerText = item.nombre_muestra;
                        rowGeneral.insertCell(3).innerText = item.descripcion_muestra;
                        rowGeneral.insertCell(4).innerText = item.nombre_completo;
                    }

                    // Agrega cada resultado microbiológico en la tabla de resultados
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

    // Carga las tablas asociadas al análisis seleccionado
    fetch(`/obtenerTablasAsociadas?id=${selectedIdentificador}`)
        .then(response => response.json())
        .then(tablasData => {
            mostrarTablas(tablasData); // Muestra tablas adicionales
            capturarYDescargarPantalla(); // Captura y descarga visual del contenido
        })
        .catch(error => console.error('Error al obtener las tablas asociadas:', error));
}

function mostrarTablas(tablasData) {
    var tablasContainer = document.getElementById("tablasContainer");
    tablasContainer.innerHTML = "";

    tablasData.forEach(tabla => {
        var table = document.createElement("table");
        table.innerHTML = `<caption>${tabla.nombre}</caption>`;

        // Encabezados de columna
        var headerRow = table.insertRow(0);
        Object.keys(tabla.columnas).forEach(columna => {
            var th = document.createElement("th");
            th.textContent = columna;
            headerRow.appendChild(th);
        });

        // Filas con datos
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

// Al cargar la página, llena el select con los análisis disponibles
document.addEventListener("DOMContentLoaded", function () {
    var identificadorSelect = document.getElementById("identificadorSelect");

    fetch('/obtenerAnalisis')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                var option = document.createElement("option");
                option.value = item.identificador_muestra;
                option.text = `Identificador: ${item.identificador_muestra}   ||   Fecha: ${item.fecha}   ||   Usuario: ${item.nombre_completo}`;
                identificadorSelect.add(option); // Agrega opción al selector
            });
        })
        .catch(error => console.error('Error al cargar los identificadores:', error));
});

// Elimina el análisis seleccionado y recarga la página
function eliminarInformacion() {
    var identificadorSelect = document.getElementById("identificadorSelect");
    var selectedIndex = identificadorSelect.selectedIndex;

    if (selectedIndex !== -1) {
        var selectedIdentificador = identificadorSelect.options[selectedIndex].value;

        fetch(`/eliminarAnalisis?id=${selectedIdentificador}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Muestra mensaje de éxito
                location.reload();   // Recarga la página
            } else {
                alert('Error al eliminar el informe');
            }
        })
        .catch(error => console.error('Error al eliminar el informe:', error));
    }
}
