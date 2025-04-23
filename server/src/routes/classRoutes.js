// routes/class.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const classController = require('../controllers/classController');

// RUTA PÚBLICA: próximas clases de un curso, ordenadas de la más cercana a la más lejana
router.get(
  '/course/:course_id/upcoming',
  classController.getUpcomingClassesByCourse
);

// A partir de aquí, todas las siguientes rutas requieren token y rol
router.use(verifyToken);

// Crear clase (solo profesores - role_id 2)
router.post('/', checkRole([2]), classController.createClass);

// Obtener clases de un curso (cualquier usuario autenticado)
router.get('/course/:course_id', classController.getClassesByCourse);

// Actualizar clase (solo profesor dueño - role_id 2)
router.put('/:class_id', checkRole([2]), classController.updateClass);

// Eliminar clase (solo profesor dueño - role_id 2)
router.delete('/:class_id', checkRole([2]), classController.deleteClass);

module.exports = router;

