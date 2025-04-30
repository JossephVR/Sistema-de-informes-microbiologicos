const { Pool } = require('pg');

// Configuración de la conexión a la base de datos PostgreSQL

const pool = new Pool({
  user: 'user', //agregar usuario       
  host: 'host', // agregar host  
  database: 'database', // agregar nombre de la base de datos
  password: 'password', // agregar contraseña
  port: 5432,                
});

// Exporta el pool de conexiones para que pueda ser utilizado en otros módulos (ej. apiRoutes.js)
module.exports = pool;