const express = require('express');
const path = require('path');

// Crea un nuevo router de Express
const router = express.Router();

// Define la ruta base para servir el archivo index.html principal
router.get('/', (req, res) => {
  
  res.sendFile(path.join(__dirname, '../../frontend', 'index.html'));
});

// Ruta para la página de inicio después del login
router.get('/inicio', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend', 'inicio.html'));
});

// Ruta para la página de creación de nueva cuenta
router.get('/nuevaCuenta', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'nuevaCuenta.html'));
});

// Ruta para la página de informe dentro de inicio
router.get('/inicio/informe', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'informe.html'));
});

// Ruta para eliminar microorganismo
router.get('/inicio/microorganismo/eliminarMicroorganismo', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'eliminarMicroorganismo.html'));
});

// Ruta para la página de análisis
router.get('/inicio/analisis', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'analisis.html'));
});

// Ruta para agregar microorganismo
router.get('/inicio/microorganismo/agregarMicroorganismo', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'agregarMicroorganismo.html'));
});

// Ruta para la página de resultados del análisis
router.get('/inicio/analisis/resultado', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'resultado.html'));
});

// Ruta para el historial de informes
router.get('/inicio/informe/historial', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'historial.html'));
});

// Ruta para eliminar informes
router.get('/inicio/informe/eliminarInforme', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'eliminarInforme.html'));
});

// Ruta para la página de estadísticas
router.get('/inicio/estadisticas', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'estadisticas.html'));
});

// Ruta para la página de gestión de microorganismos
router.get('/inicio/microorganismos', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'microorganismos.html'));
});

// Ruta para una página de prueba (si existe)
router.get('/inicio/test', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'test.html'));
});

// Exporta el router configurado para ser usado en server.js
module.exports = router;