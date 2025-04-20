const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { verifyToken, checkRole } = require('../middleware/auth');

// autenticación
router.use(verifyToken);

// Inscribir estudiante en curso
router.post('/courses/:courseId/enroll', checkRole([1]), enrollmentController.enrollStudentInCourse);


module.exports = router;