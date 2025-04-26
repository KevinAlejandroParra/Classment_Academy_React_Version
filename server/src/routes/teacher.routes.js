const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Crear un nuevo profesor y asignarlo a una escuela
router.post('/', verifyToken, checkRole([3]), teacherController.createTeacher);

// Asignar un profesor a un curso
router.post('/assign-course', verifyToken, checkRole([3]), teacherController.assignTeacherToCourse);

// Obtener todos los profesores de una escuela
router.get('/school/:school_id', verifyToken, checkRole([3]), teacherController.getSchoolTeachers);

// Obtener cursos asignados al profesor
router.get('/courses', verifyToken, checkRole([2]), teacherController.getCourses);

// Obtener estudiantes de un curso
router.get('/courses/:courseId/students', verifyToken, checkRole([2]), teacherController.getStudentsInCourse);

module.exports = router; 