// Configuración inicial del gráfico
const ctx = document.getElementById('estadisticasChart').getContext('2d');
let estadisticasChart;

// Función para obtener datos desde la base de datos y procesarlos
async function obtenerEstadisticasPorMesConAnio(fechaInicio, fechaFin) {
    try {
        const url = `/obtenerEstadisticasPorMesConAnio?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
        const response = await fetch(url);
        const datosPorMesConAnio = await response.json();

        // Actualizar el gráfico existente o crear uno nuevo
        if (estadisticasChart) {
            estadisticasChart.data.labels = datosPorMesConAnio.map(data => data.mes_anio);
            estadisticasChart.data.datasets[0].data = datosPorMesConAnio.map(data => data.cantidad);
            estadisticasChart.update(); // Actualizar el gráfico existente
        } else {
            estadisticasChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: datosPorMesConAnio.map(data => data.mes_anio),
                    datasets: [{
                        label: 'Cantidad de Informes por Mes con Año (Los meses que no aparezcan, son meses en los que no se hicieron informes)',
                        data: datosPorMesConAnio.map(data => data.cantidad),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fontSize: 16 // Tamaño de la letra del conjunto de datos
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function (value, index, values) {
                                    return value;
                                },
                                font: {
                                    size: 16 // Tamaño de las letras en el eje Y
                                }
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    size: 16 // Tamaño de las letras en el eje X
                                }
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error al obtener estadísticas por mes con año:', error);
    }
}

// Función para obtener estadísticas por intervalo
function obtenerEstadisticasPorIntervalo() {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    obtenerEstadisticasPorMesConAnio(fechaInicio, fechaFin);
}

// Función para descargar el gráfico como imagen
function descargarGrafico() {
    html2canvas(document.getElementById('estadisticasChart'), {
        backgroundColor: 'white' // Fondo blanco
    }).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'estadisticas.png';
        link.click();
    });
}

// Llamar a la función para cargar el gráfico con todas las estadísticas
obtenerEstadisticasPorMesConAnio();