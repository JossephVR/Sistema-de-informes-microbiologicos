# Sistema-de-informes-microbiologicos

## Descripción:
Este proyecto es una aplicación web para la gestión y análisis de datos microbiológicos en un laboratorio. Permite a los usuarios registrar y visualizar los resultados de análisis microbiológicos, 
gestionar microorganismos y obtener estadísticas de los análisis realizados. 
El sistema está diseñado para ser utilizado por profesionales de laboratorio que necesitan realizar y almacenar análisis de muestras microbiológicas.

## Características:
- Autenticación de usuarios (login y registro).
- Inserción de resultados microbiológicos, incluyendo cálculo de UFC.
- Conversión de datos numéricos a notación científica personalizada.
- Manejo de rutas HTML para diferentes vistas frontend.
- Obtención de microorganismos filtrados por grupo (hongos, bacterias, etc.).
- Visualización de estadísticas mensuales agrupadas por fecha.
- Gestión de microorganismos (agregar y eliminar).
- Eliminación de análisis por identificador.
- Consultas con JOIN entre tablas (por ejemplo, para obtener el nombre del usuario que realizó un análisis).

## Tecnologías usadas:
- **Node.js:** Entorno de ejecución de JavaScript.

- **Express.js:** Framework para crear el servidor y manejar rutas.

- **PostgreSQL:** Base de datos relacional utilizada para almacenar usuarios, microorganismos y análisis.

- **pg:** Cliente de Node.js para conectarse y hacer consultas a PostgreSQL.

- **CORS:** Middleware para permitir solicitudes desde diferentes orígenes.

- **HTML estático:** Servido desde la carpeta frontend con múltiples vistas HTML.

## Configuración del proyecto:

1. Ir al directorio backend:
```bash
cd backend 
```

2. Instalar las dependencias:
```bash
npm install
```

3. Ejecutar server.js:
```bash
node server.js
```

4. Acceder a la ruta http://localhost:3000

## Créditos:
### Autores:

- Josseph Valverde Robles
- Cristian Gerardo Corella Reyes
- Fredrik Jared Aburto Jimenez
