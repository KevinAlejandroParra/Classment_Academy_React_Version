const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Rutas públicas
router.get('/', schoolController.getAllSchools);
router.get('/:id', schoolController.getSchoolById);

// Rutas protegidas
router.use(verifyToken);

// Solo coordinadores y administradores pueden gestionar escuelas
router.post('/', checkRole([2, 4]), schoolController.createSchool);
router.put('/:id', checkRole([2, 4]), schoolController.updateSchool);
router.delete('/:id', checkRole([2, 4]), schoolController.deleteSchool);

// Obtener escuelas del coordinador
router.get('/coordinator/schools', checkRole([4]), schoolController.getCoordinatorSchools);

module.exports = router;