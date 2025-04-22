
// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const attendanceController = require('../controllers/attendanceController');

// Registrar asistencia (solo profesores - role_id 2)
router.post('/', verifyToken, checkRole([2]), attendanceController.recordAttendance);

// Obtener asistencia de clase (solo profesores - role_id 2)
router.get('/class/:class_id', verifyToken, checkRole([2]), attendanceController.getClassAttendance);

// Obtener historial de estudiante (solo profesores - role_id 2)
router.get('/student/:course_id/:user_id', verifyToken, checkRole([2]), attendanceController.getStudentAttendance);

module.exports = router;