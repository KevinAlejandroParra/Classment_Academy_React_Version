const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "classment_academy",
});

DB.connect((err) => {
    if (err) {
        console.error("Error conectando a la base de datos:", err);
        return;
    }
    console.log("Base de datos conectada");
});

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

app.get("/api/cursos/:id", (req, res) => {
    const courseId = req.params.id;

    // Consulta principal para los detalles del curso
    const SQL_QUERY = `
        SELECT c.*, e.escuela_nombre, e.escuela_direccion, e.escuela_telefono,
               u.usuario_nombre AS profesor_nombre, u.usuario_apellido AS profesor_apellido, u.usuario_imagen_url AS profesor_imagen,
               (SELECT COUNT(*) FROM matriculas WHERE curso_id = c.curso_id AND matricula_estado = 'activo') as estudiantes_matriculados
        FROM cursos c
        INNER JOIN escuelas e ON c.escuela_id = e.escuela_id
        LEFT JOIN profesores_cursos pc ON c.curso_id = pc.curso_id
        LEFT JOIN usuarios u ON pc.usuario_documento = u.usuario_documento
        WHERE c.curso_id = ?`;

    DB.query(SQL_QUERY, [courseId], (err, result) => {
        if (err) {
            console.error("Error en la consulta:", err);
            return res.status(500).json({ error: "Error al obtener los detalles del curso" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Curso no encontrado" });
        }

        const course = result[0];

        // Consulta adicional para los horarios
        const SCHEDULE_QUERY = "SELECT * FROM horarios WHERE curso_id = ?";
        DB.query(SCHEDULE_QUERY, [courseId], (err, schedules) => {
            if (err) {
                console.error("Error al obtener los horarios:", err);
                return res.status(500).json({ error: "Error al obtener los horarios del curso" });
            }

            // Agregar los horarios y devolver la respuesta completa
            course.horarios = schedules;
            res.json(course);
        });
    });
});

app.get("/api/escuelas", (req, res) => {
    const adminExcluir = 4;
    const SQL_QUERY_ESCUELAS = "SELECT escuela_id, escuela_nombre, escuela_imagen_url, escuela_descripcion, escuela_direccion, escuela_telefono, escuela_correo FROM escuelas WHERE escuela_id <> ? AND escuela_estado = ?";
    
    DB.query(SQL_QUERY_ESCUELAS, [adminExcluir, 'activo'], (err, result) => {
        if (err) {
            console.error("Error en la consulta:", err);
            return res.status(500).json({ error: "Error al obtener los datos de las escuelas" });
        }
        res.json(result);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
