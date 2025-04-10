const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { authenticateToken } = require('../middleware/auth');

// Rutas protegidas que requieren autenticación
router.use(authenticateToken);

// Obtener todas las escuelas
router.get('/', schoolController.getSchools);

// Obtener escuelas del coordinador
router.get('/coordinator', schoolController.getCoordinatorSchools);

// Obtener una escuela específica
router.get('/:id', schoolController.getSchool);

// Crear una nueva escuela (solo coordinadores)
router.post('/', schoolController.createSchool);

// Actualizar una escuela (solo el coordinador propietario)
router.put('/:id', schoolController.updateSchool);

// Eliminar una escuela (solo el coordinador propietario)
router.delete('/:id', schoolController.deleteSchool);

module.exports = router;