const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken } = require('../middleware/auth');

// Proteger todas las rutas con el middleware de autenticación
router.use(verifyToken);

// Inscribir estudiante a una escuela
router.post('/enroll/:schoolId', studentController.enrollStudent);

// Obtener las escuelas en las que está inscrito un estudiante
router.get('/schools', studentController.getStudentSchools);

// Obtener los detalles de una escuela específica para un estudiante
router.get('/schools/:schoolId', studentController.getStudentSchoolDetails);

module.exports = router; 