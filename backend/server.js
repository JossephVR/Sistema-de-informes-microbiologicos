const express = require('express'); // Framework web para Node.js
const path = require('path');       // Módulo para trabajar con rutas de archivos y directorios
const cors = require('cors');       // Middleware para habilitar Cross-Origin Resource Sharing

// --- Importar Rutas ---
const htmlRoutes = require('./routes/htmlRoutes'); // Rutas para servir archivos HTML
const apiRoutes = require('./routes/apiRoutes');   // Rutas para la lógica de la API y base de datos

const app = express();

app.use(cors());


app.use(express.json({ type: '*/*' }));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/styles', express.static(path.join(__dirname, '../frontend/styles')));



// Monta las rutas de la API. Cualquier petición a /login, /submit, /getUsers, etc., será manejada por apiRoutes.
app.use('/', apiRoutes); 

app.use('/', htmlRoutes);

// --- Definición del Puerto y Arranque del Servidor ---
const PORT = process.env.PORT || 3000; 

// Inicia el servidor y lo pone a escuchar en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error("Error no manejado:", err.stack);
  res.status(500).send('Algo salió mal en el servidor!');
});