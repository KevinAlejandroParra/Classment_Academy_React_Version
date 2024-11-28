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
    const SQL_QUERY = "SELECT * FROM cursos"
    DB.query(SQL_QUERY, (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

//consumimos el servidor en el puerto 3306
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
