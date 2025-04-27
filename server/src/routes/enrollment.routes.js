const express = require('express');
const router = express.Router();
const EnrollmentController = require('../controllers/enrollmentController');
const { verifyToken, checkRole } = require('../middleware/auth');

// autenticación
router.use(verifyToken);

/**
 * @swagger
 * /enrollment/schools/{schoolId}/courses/{courseId}/enroll:
 *   post:
 *     description: Inscribe a un estudiante en un curso específico de una escuela (solo estudiantes)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         description: El ID de la escuela
 *         schema:
 *           type: string
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: El ID del curso
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estudiante inscrito con éxito en el curso
 *       403:
 *         description: No autorizado para inscribir a un estudiante (solo estudiantes)
 *       400:
 *         description: Datos inválidos o curso no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/schools/:schoolId/courses/:courseId/enroll', checkRole([1]), EnrollmentController.enrollStudentInSchoolCourse);

/**
 * @swagger
 * /enrollment/courses/{courseId}/enroll:
 *   post:
 *     description: Inscribe a un estudiante en un curso (solo estudiantes)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: El ID del curso al que se va a inscribir el estudiante
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estudiante inscrito con éxito en el curso
 *       403:
 *         description: No autorizado para inscribir a un estudiante (solo estudiantes)
 *       400:
 *         description: Datos inválidos o curso no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/courses/:courseId/enroll', checkRole([1]), EnrollmentController.enrollStudentInCourse);
router.get('/user/:userId', checkRole([1]), EnrollmentController.getEnrollmentsByUser);

module.exports = router;
