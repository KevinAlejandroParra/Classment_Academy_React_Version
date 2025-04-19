const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes.js");
const schoolRoutes = require("./routes/school.routes.js");
const courseRoutes = require("./routes/course.routes.js");
const errorHandler = require("./middleware/errorHandler.js");
const path = require('path');
const studentRoutes = require('./routes/student.routes');


const app = express();

// Configuración de CORS
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:8081", "exp://localhost:8081"],
        credentials: true,
    })
);
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "..", "public", "images")));

// Rutas existentes
app.use("/api", userRoutes);

// Nuevas rutas para escuelas y cursos
app.use('/api/schools', schoolRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Ruta no encontrada",
    });
});

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
