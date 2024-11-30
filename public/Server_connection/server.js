// importar librerias
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

//creamos la instancia de express para el servidor
const app = express()
const PORT = 3000
app.use(cors());
//creamos la conexion
const DB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "classment-academy",
});

DB.connect((err) => {
    if (err) {
        throw err;
    } 
    console.log("Base de datos conectada");
    
});

//Creamos una ruta para la peticion get
app.get("/api/cursos", (req, res) => {
    const SQL_QUERY = "SELECT c.curso_id, c.curso_nombre, c.curso_descripcion, c.curso_imagen_url, c.curso_precio, e.escuela_nombre, e.escuela_id FROM cursos c INNER JOIN escuelas e ON c.escuela_id = e.escuela_id WHERE c.curso_estado = 'activo'";
    
    DB.query(SQL_QUERY, (err, result) => {
        if (err) {
            console.error("Error en la consulta:", err);
            return res.status(500).json({ error: "Error al obtener los cursos" });
        }
        res.json(result);
    });
});

//consumimos el servidor en el puerto 3306
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
