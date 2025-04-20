const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Rutas públicas
router.get('/', courseController.getAllCourses);
router.get('/school/:schoolId', courseController.getCoursesBySchoolId);
router.get('/:id', courseController.getCourseById);

// Rutas protegidas
router.use(verifyToken);

// Solo administradores y coordinadores pueden crear/actualizar/eliminar cursos
router.post('/', checkRole([3, 4]), courseController.createCourse);
router.put('/:id', checkRole([3, 4]), courseController.updateCourse);
router.delete('/:id', checkRole([3, 4]), courseController.deleteCourse);

module.exports = router;