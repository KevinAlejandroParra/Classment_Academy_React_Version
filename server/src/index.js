require('dotenv').config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes.js");
const schoolRoutes = require("./routes/school.routes.js");
const courseRoutes = require("./routes/course.routes.js");
const teacherRoutes = require("./routes/teacher.js")
const classRoutes = require("./routes/classRoutes.js")
const attendanceRoutes = require("./routes/attendanceRoutes.js")
const paymentRoutes = require("./routes/paymentRoutes.js")
const errorHandler = require("./middleware/errorHandler.js");
const path = require('path');
const enrollmentRoutes = require('./routes/enrollment.routes');
const courseTeacherRoutes = require('./routes/courseTeacher.routes');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Configuración de CORS
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:8081", "exp://localhost:8081"],
        credentials: true,
    })
);
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Archivos estáticos
app.use("/images", express.static(path.join(__dirname, "..", "public", "images")));

// Rutas públicas
app.use('/api/schools', schoolRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/class', classRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', userRoutes);


// Rutas que pueden requerir autenticación
app.use("/api/auth", userRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/courseteacher', courseTeacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/teacher', teacherRoutes);


// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Ruta no encontrada",
    });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar el servidor
app.listen(5000, () => {
    console.log(`Servidor corriendo en puerto 5000`);
    console.log(`http://localhost:5000/api-docs`);
});