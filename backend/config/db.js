require('dotenv').config();
const { Pool } = require('pg');

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Exporta el pool de conexiones para que pueda ser utilizado en otros módulos (ej. apiRoutes.js)
module.exports = pool;