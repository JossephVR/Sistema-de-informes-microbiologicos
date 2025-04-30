let contenidoDetalleHTML = '';

function cargarDetalle() {
    var identificadorSelect = document.getElementById("identificadorSelect");
    var selectedIndex = identificadorSelect.selectedIndex;

    if (selectedIndex !== -1) {
        var selectedIdentificador = identificadorSelect.options[selectedIndex].value;

        // Solicita al backend el detalle del análisis microbiológico
        fetch(`/obtenerAnalisisDetalle?id=${selectedIdentificador}`)
            .then(response => response.json())
            .then(data => {
                // Limpia las tablas antes de mostrar nueva información
                document.getElementById("tablaInformacionGeneral").innerHTML = "";
                document.getElementById("tablaInformacionResultados").innerHTML = "";

                data.forEach((item, index) => {
                    if (index === 0) {
                        // Muestra la información general del análisis solo una vez
                        var rowGeneral = document.getElementById("tablaInformacionGeneral").insertRow(-1);
                        rowGeneral.insertCell(0).innerText = item.fecha;
                        rowGeneral.insertCell(1).innerText = item.identificador_muestra;
                        rowGeneral.insertCell(2).innerText = item.nombre_muestra;
                        rowGeneral.insertCell(3).innerText = item.descripcion_muestra;
                        rowGeneral.insertCell(4).innerText = item.nombre_completo;
                    }

                    // Agrega cada resultado microbiológico en su tabla correspondiente
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

    // Obtiene las tablas adicionales asociadas al análisis y las muestra
    fetch(`/obtenerTablasAsociadas?id=${selectedIdentificador}`)
        .then(response => response.json())
        .then(tablasData => {
            mostrarTablas(tablasData); // Inserta dinámicamente las tablas
            capturarYDescargarPantalla(); // Genera imagen automática del contenido mostrado
        })
        .catch(error => console.error('Error al obtener las tablas asociadas:', error));
}

function mostrarTablas(tablasData) {
    var tablasContainer = document.getElementById("tablasContainer");
    tablasContainer.innerHTML = "";

    tablasData.forEach(tabla => {
        var table = document.createElement("table");
        table.innerHTML = `<caption>${tabla.nombre}</caption>`;

        // Inserta los encabezados de columna
        var headerRow = table.insertRow(0);
        Object.keys(tabla.columnas).forEach(columna => {
            var th = document.createElement("th");
            th.textContent = columna;
            headerRow.appendChild(th);
        });

        // Inserta las filas con los datos de la tabla
        tabla.datos.forEach(fila => {
            var row = table.insertRow(-1);
            Object.values(fila).forEach(valor => {
                var cell = row.insertCell(-1);
                cell.textContent = valor;
            });
        });

        tablasContainer.appendChild(table); // Agrega la tabla al contenedor
    });
}

// Carga inicial de los identificadores de análisis disponibles en el selector
document.addEventListener("DOMContentLoaded", function () {
    var identificadorSelect = document.getElementById("identificadorSelect");

    fetch('/obtenerAnalisis')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                var option = document.createElement("option");
                option.value = item.identificador_muestra;
                option.text = `Identificador: ${item.identificador_muestra}   ||   Fecha: ${item.fecha}   ||   Usuario: ${item.nombre_completo}`;
                identificadorSelect.add(option); // Agrega al <select>
            });
        })
        .catch(error => console.error('Error al cargar los identificadores:', error));
});

// Captura visualmente el contenido mostrado y lo descarga como imagen PNG
function descargarInformacion() {
    var contenidoCapturable = document.getElementById("contenidoCapturable");

    html2canvas(contenidoCapturable).then(function(canvas) {
        var link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'informacion_microbiologica.png';
        link.click(); // Dispara la descarga de la imagen
    });
}

// Redirige al usuario de vuelta al menú principal
function volverAlMenu() {
    window.location.href = "/inicio";
}
