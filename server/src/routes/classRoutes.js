const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const classController = require('../controllers/classController');

// Crear clase (solo profesores - role_id 2)
router.post('/', verifyToken, checkRole([2]), classController.createClass);

// Obtener clases de un curso (cualquier usuario autenticado)
router.get('/course/:course_id', verifyToken, classController.getClassesByCourse);

// Actualizar clase (solo profesor dueño - role_id 2)
router.put('/:class_id', verifyToken, checkRole([2]), classController.updateClass);

// Eliminar clase (solo profesor dueño - role_id 2)
router.delete('/:class_id', verifyToken, checkRole([2]), classController.deleteClass);

router.get('/upcoming', verifyToken, classController.getUpcomingClasses);

module.exports = router;
