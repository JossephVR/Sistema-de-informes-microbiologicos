const express = require('express');
const pool = require('../config/db'); // Importa el pool de la base de datos configurado
const { formatToCustomScientificNotation } = require('../utils/formatter'); // Importa la función de formato

// Crea un nuevo router de Express
const router = express.Router();

// Middleware para asegurar que las requests con JSON sean parseadas correctamente.
// Se aplica específicamente a este router.
router.use(express.json({ type: '*/*' }));
router.use(express.urlencoded({ extended: true }));



// Endpoint POST para manejar el inicio de sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body; // Extrae credenciales del cuerpo de la solicitud

  try {
      // Consulta a la BD para verificar si el usuario y contraseña coinciden
      const userQuery = 'SELECT * FROM usuario WHERE nombre_usuario = $1 AND contraseña = $2';
      const result = await pool.query(userQuery, [username, password]);

      if (result.rows.length > 0) {
          // Si se encuentra una fila, las credenciales son válidas
          res.json({ message: 'Credenciales válidas' });
      } else {
          // Si no hay filas, las credenciales son inválidas
          res.status(401).json({ error: 'Credenciales inválidas' });
      }
  } catch (error) {
      // Manejo de errores de base de datos o del servidor
      console.error('Error al autenticar:', error);
      res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Endpoint POST para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  // Extrae la información del nuevo usuario del cuerpo de la solicitud
  const { usuario, contrasena, nombre_completo } = req.body;

  try {
      // Inserta el nuevo usuario en la tabla 'usuario'
      const insertQuery = 'INSERT INTO usuario (nombre_usuario, contraseña, nombre_completo) VALUES ($1, $2, $3)';
      await pool.query(insertQuery, [usuario, contrasena, nombre_completo]);

      // Responde con éxito si la inserción fue correcta
      res.status(201).json({ message: 'Cuenta creada exitosamente' });
  } catch (error) {
      // Manejo de errores (ej. usuario duplicado, error de BD)
      console.error('Error al crear cuenta:', error);
      res.status(500).json({ error: 'Error al crear la cuenta' });
  }
});



router.post('/saveData', async (req, res) => {
  try {
    const { r1, r2, r3, hongo } = req.body;

    // Realizar la suma de R1, R2 y R3
    const total = parseInt(r1) + parseInt(r2) + parseInt(r3);

    // Inserta el total y el nombre en la tabla 'reporte'
    const insertQuery = 'INSERT INTO reporte (resul, name) VALUES ($1, $2)';
    await pool.query(insertQuery, [total, hongo]);

    res.json({ message: 'Datos guardados en la base de datos' });
  } catch (error) {
    console.error('Error al insertar en la base de datos (reporte):', error);
    res.status(500).json({ error: 'Error en el servidor al guardar en reporte' });
  }
});

// Endpoint POST para guardar los datos completos de un análisis microbiológico
router.post('/submit', async (req, res) => {
  // Extrae todos los datos del análisis del cuerpo de la solicitud
  const {
    fecha,
    identificadorMuestra,
    nombreMuestra,
    descripcion,
    grupo,
    microorganismo,
    factorConversion,
    dilucionEmpleada,
    r1,
    r2,
    r3,
    nombre_usuario // Nombre completo del usuario que realiza el análisis
  } = req.body;

  try {
    // 1. Buscar el ID del usuario basado en su nombre completo
    const userIdQuery = 'SELECT id FROM usuario WHERE nombre_completo = $1';
    const userIdResult = await pool.query(userIdQuery, [nombre_usuario]);

    if (userIdResult.rows.length > 0) {
      const userId = userIdResult.rows[0].id; // Obtiene el ID del usuario

      // 2. Convertir y validar datos antes de la inserción
      const formattedFecha = new Date(fecha); // Asegura que la fecha sea un objeto Date
      const formattedFactorConversion = parseInt(factorConversion);
      const formattedDilucionEmpleada = parseInt(dilucionEmpleada);

      // Validar que las conversiones numéricas sean válidas
      if (isNaN(formattedFactorConversion) || isNaN(formattedDilucionEmpleada) || isNaN(parseInt(r1)) || isNaN(parseInt(r2)) || isNaN(parseInt(r3))) {
         return res.status(400).json({ error: 'Valores numéricos inválidos (r1, r2, r3, factor, dilución).' });
      }

      // 3. Calcular UFC (Unidades Formadoras de Colonias)
      const promedio = (parseInt(r1) + parseInt(r2) + parseInt(r3)) / 3;
      const UFC = promedio * formattedFactorConversion * formattedDilucionEmpleada;
      const UFCentero = Math.round(UFC); // Redondear al entero más cercano

      // 4. Construir la consulta SQL para insertar el análisis
      const insertQuery = `
        INSERT INTO analisis_microbiolgico
        (fecha, identificador_muestra, nombre_muestra, descripcion_muestra, usuario_id, grupo, microorganismo, factor_conversion, dilucion_empleada, ufc)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;

      // 5. Ejecutar la consulta con los datos preparados
      await pool.query(insertQuery, [
        formattedFecha,
        identificadorMuestra,
        nombreMuestra,
        descripcion,
        userId, // Usar el ID encontrado
        grupo,
        microorganismo,
        formattedFactorConversion,
        formattedDilucionEmpleada,
        UFCentero // Usar el valor calculado de UFC
      ]);

      // 6. Responder con éxito
      res.status(201).json({ message: 'Datos del análisis guardados en la base de datos' });
    } else {
      // Si no se encuentra el usuario por nombre completo
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    // Manejo de errores generales (BD, cálculo, etc.)
    console.error('Error al guardar datos del análisis en la base de datos:', error);
    res.status(500).json({ error: 'Error al guardar datos del análisis' });
  }
});

// Endpoint GET para obtener un resumen de los análisis realizados
router.get('/obtenerAnalisis', async (req, res) => {
  try {
    // Consulta para obtener una fila por cada identificador_muestra único,
    // mostrando la fecha más reciente y el nombre del usuario asociado.
    const query = `
      SELECT DISTINCT ON (identificador_muestra) 
             identificador_muestra,
             TO_CHAR(am.fecha, 'DD-MM-YYYY') as fecha, -- Formatea la fecha
             u.nombre_completo
      FROM analisis_microbiolgico AS am
      LEFT JOIN usuario AS u ON am.usuario_id = u.id -- LEFT JOIN para incluir análisis sin usuario (si es posible)
      WHERE am.fecha IS NOT NULL -- Asegura que solo se muestren análisis con fecha
      ORDER BY identificador_muestra, am.fecha DESC; -- Ordena para que DISTINCT ON tome el más reciente
    `;
    const result = await pool.query(query);
    res.json(result.rows); // Devuelve los resultados como JSON
  } catch (error) {
    console.error('Error al obtener los análisis:', error);
    res.status(500).json({ error: 'Error al obtener los análisis' });
  }
});

// Endpoint GET para obtener los detalles completos de un análisis específico por su ID (identificador_muestra)
router.get('/obtenerAnalisisDetalle', async (req, res) => {
  const analysisId = req.query.id; // Obtiene el ID del análisis de los parámetros de la URL

  if (!analysisId) {
    return res.status(400).json({ error: 'Falta el parámetro ID del análisis' });
  }

  try {
      // Consulta para obtener todos los datos de los registros asociados a un identificador_muestra
      const query = `
        SELECT TO_CHAR(am.fecha, 'DD-MM-YYYY') as fecha, -- Formatea fecha
               identificador_muestra, nombre_muestra, descripcion_muestra,
               u.nombre_completo, -- Obtiene nombre del usuario desde la tabla usuario
               grupo, microorganismo, factor_conversion, dilucion_empleada, ufc
        FROM analisis_microbiolgico AS am
        LEFT JOIN usuario AS u ON am.usuario_id = u.id -- Une con la tabla usuario
        WHERE am.identificador_muestra = $1 -- Filtra por el ID proporcionado
        ORDER BY grupo, microorganismo; -- Ordena los resultados
      `;
      const result = await pool.query(query, [analysisId]);

      if (result.rows.length > 0) {
          // Formatea el valor de UFC a notación científica personalizada para cada fila
          const rowsWithCustomScientificNotation = result.rows.map(row => {
            return {
              ...row, // Mantiene los demás campos igual
              // Aplica el formato solo si ufc no es null o undefined
              ufc: row.ufc != null ? formatToCustomScientificNotation(parseFloat(row.ufc)) : 'N/A'
            };
          });
          res.json(rowsWithCustomScientificNotation); // Devuelve los detalles formateados
      } else {
          // Si no se encuentran registros para ese ID
          res.status(404).json({ error: 'Informes no encontrados para el ID proporcionado' });
      }
  } catch (error) {
    console.error('Error al obtener detalles del informe:', error);
    res.status(500).json({ error: 'Error al obtener detalles del informe' });
  }
});

// Endpoint DELETE para eliminar todos los registros de análisis asociados a un identificador_muestra
router.delete('/eliminarAnalisis', async (req, res) => {
  const analysisId = req.query.id; // Obtiene el ID de la muestra a eliminar

  if (!analysisId) {
    return res.status(400).json({ error: 'Falta el parámetro ID del análisis a eliminar' });
  }

  try {
      // Ejecuta la consulta DELETE para eliminar por identificador_muestra
      const deleteQuery = 'DELETE FROM analisis_microbiolgico WHERE identificador_muestra = $1';
      const result = await pool.query(deleteQuery, [analysisId]);

      // Verifica si se eliminó alguna fila
      if (result.rowCount > 0) {
          res.status(200).json({ message: `Informe(s) con ID ${analysisId} eliminado(s) exitosamente` });
      } else {
          // Si no se encontró el ID para eliminar
          res.status(404).json({ message: `No se encontraron informes con ID ${analysisId} para eliminar` });
      }
  } catch (error) {
    console.error('Error al eliminar el informe:', error);
    res.status(500).json({ error: 'Error al eliminar el informe' });
  }
});



// Endpoint GET para obtener la lista de microorganismos según el grupo seleccionado
router.get('/getMicroorganisms', async (req, res) => {
  const group = req.query.group; // Obtiene el grupo de los parámetros de la URL

  if (!group) {
    return res.status(400).json({ error: 'Falta el parámetro "group"' });
  }

  let tableName;
 
  switch (group.toLowerCase()) { // Convertir a minúsculas para comparación robusta
      case 'hongos':
          tableName = 'hongos';
          break;
      case 'pseudo-hongos':
          tableName = 'pseudo_hongos';
          break;
      case 'levaduras':
          tableName = 'levaduras';
          break;
      case 'bacterias anaerobicas': 
          tableName = 'bacterias_anerobicas'; 
          break;
      case 'bacterias aerobicas':   
          tableName = 'bacterias_aerobicas';
          break;
      case 'actinomycetes': 
          tableName = 'Actinomycetes';
          break;
      default:
          res.status(400).json({ error: 'Grupo no válido proporcionado' });
          return;
  }

  try {
     
      const query = `SELECT nombre FROM ${tableName} ORDER BY nombre`; 
      const result = await pool.query(query);
      // Devuelve solo la lista de nombres
      res.json(result.rows);
  } catch (error) {
      console.error(`Error al obtener microorganismos del grupo ${group} (tabla ${tableName}):`, error);
      // Puede ser que la tabla no exista o haya otro error de BD
      res.status(500).json({ error: `Error al obtener microorganismos para el grupo ${group}` });
  }
});

// Endpoint POST para agregar un nuevo microorganismo a un grupo específico
router.post('/addMicroorganismo', async (req, res) => {
  const { grupo, nombreMicroorganismo } = req.body; // Obtiene grupo y nombre del cuerpo

  if (!grupo || !nombreMicroorganismo) {
    return res.status(400).json({ error: 'Faltan datos: grupo o nombreMicroorganismo' });
  }

  try {
    
      const tableName = grupo.toLowerCase().replace(/ /g, '_').replace(/-/g, '_'); // Más robusto

      // Consulta para insertar el nuevo nombre en la tabla correspondiente
      const insertQuery = `INSERT INTO ${tableName} (nombre) VALUES ($1)`;
      await pool.query(insertQuery, [nombreMicroorganismo]);

      res.status(201).json({ message: `Microorganismo "${nombreMicroorganismo}" agregado exitosamente al grupo "${grupo}"` });
  } catch (error) {
      console.error(`Error al agregar microorganismo al grupo ${grupo}:`, error);
      
      if (error.code === '23505') { // Código de error PostgreSQL para violación de unicidad
        res.status(409).json({ error: `El microorganismo "${nombreMicroorganismo}" ya existe en el grupo "${grupo}".` });
      } else if (error.code === '42P01') { // Código de error PostgreSQL para tabla no encontrada
        res.status(400).json({ error: `El grupo "${grupo}" no es válido o la tabla no existe.` });
      } else {
        res.status(500).json({ error: 'Error al agregar microorganismo' });
      }
  }
});

// Endpoint DELETE para eliminar un microorganismo específico de un grupo
router.delete('/eliminarMicroorganismo', async (req, res) => {
    // Obtiene grupo y nombre del *cuerpo* de la solicitud DELETE
    const { grupo, microorganismo } = req.body;

    if (!grupo || !microorganismo) {
      return res.status(400).json({ error: 'Faltan datos: grupo o microorganismo' });
    }

    try {
        // Convierte nombre de grupo a nombre de tabla
        const tableName = grupo.toLowerCase().replace(/ /g, '_').replace(/-/g, '_');

        // Consulta DELETE para eliminar por nombre dentro de la tabla del grupo
        const deleteQuery = `DELETE FROM ${tableName} WHERE nombre = $1`;
        const result = await pool.query(deleteQuery, [microorganismo]);

        // Verifica si se eliminó alguna fila
        if (result.rowCount > 0) {
            res.status(200).json({ message: `Microorganismo "${microorganismo}" eliminado con éxito del grupo "${grupo}"` });
        } else {
            // Si no se encontró el microorganismo en ese grupo
            res.status(404).json({ message: `Microorganismo "${microorganismo}" no encontrado en el grupo "${grupo}"` });
        }
    } catch (error) {
        console.error(`Error al eliminar microorganismo del grupo ${grupo}:`, error);
         if (error.code === '42P01') { // Código de error PostgreSQL para tabla no encontrada
            res.status(400).json({ error: `El grupo "${grupo}" no es válido o la tabla no existe.` });
         } else {
            res.status(500).json({ error: 'Error al eliminar microorganismo' });
         }
    }
});


// --- Endpoints de Utilidades y Estadísticas ---

// Endpoint GET para obtener la lista de usuarios (ID y Nombre completo)
router.get('/getUsers', async (req, res) => {
  try {
      // Consulta simple para obtener id y nombre_completo de todos los usuarios
      const query = 'SELECT id, nombre_completo FROM usuario ORDER BY nombre_completo'; // Ordenar alfabéticamente
      const result = await pool.query(query);
      res.json(result.rows); // Devuelve la lista de usuarios
  } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Endpoint GET para obtener estadísticas de análisis por mes dentro de un rango de fechas
router.get('/obtenerEstadisticasPorMesConAnio', async (req, res) => {
  try {
      // Obtiene las fechas de inicio y fin de los query parameters
      const { fechaInicio, fechaFin } = req.query;

      // Validación básica de fechas (podría ser más robusta)
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Se requieren fechaInicio y fechaFin' });
      }

      // Consulta para contar análisis agrupados por mes y año (formato 'Mon-YYYY')
      // dentro del rango de fechas proporcionado.
      const query = `
          SELECT TO_CHAR(fecha, 'Mon-YYYY') AS mes_anio, -- Formato Mes(abreviado)-Año
                 COUNT(DISTINCT identificador_muestra) AS cantidad -- Cuenta muestras únicas por mes/año
          FROM analisis_microbiolgico
          WHERE fecha IS NOT NULL AND fecha BETWEEN $1 AND $2 -- Filtra por rango de fechas
          GROUP BY TO_CHAR(fecha, 'Mon-YYYY'), TO_CHAR(fecha, 'YYYY-MM') -- Agrupa por mes/año
          ORDER BY TO_CHAR(fecha, 'YYYY-MM'); -- Ordena cronológicamente
      `;
      const result = await pool.query(query, [fechaInicio, fechaFin]);
      res.json(result.rows); // Devuelve los resultados
  } catch (error) {
      console.error('Error al obtener estadísticas por mes con año:', error);
      res.status(500).json({ error: 'Error al obtener estadísticas por mes con año' });
  }
});


// Exporta el router configurado con todas las rutas API
module.exports = router;