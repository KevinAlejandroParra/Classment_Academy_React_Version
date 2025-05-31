const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { verifyToken, checkRole } = require('../middleware/auth');



/**
 * @swagger
 * /school:
 *   get:
 *     description: Obtiene todas las escuelas (requiere autenticación)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las escuelas
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', schoolController.getAllSchools);
router.use(verifyToken);

router.get('/get-school/', schoolController.getAdminSchool);

router.get('/:id', verifyToken, schoolController.getSchoolById);


/**
 * @swagger
 * /school/{id}:
 *   get:
 *     description: Obtiene los detalles de una escuela por su ID (ruta pública)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID de la escuela a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la escuela
 *       404:
 *         description: Escuela no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.use(verifyToken);


/**
 * @swagger
 * /school:
 *   post:
 *     description: Crea una nueva escuela (solo coordinadores y administradores)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: El nombre de la escuela
 *               location:
 *                 type: string
 *                 description: La ubicación de la escuela
 *     responses:
 *       201:
 *         description: Escuela creada con éxito
 *       403:
 *         description: No autorizado para crear escuelas (solo coordinadores o administradores)
 *       500:
 *         description: Error interno del servidor
 */


router.post('/', checkRole([3, 4]), schoolController.createSchool);

/**
 * @swagger
 * /school/{id}:
 *   put:
 *     description: Actualiza los detalles de una escuela por su ID (solo coordinadores y administradores)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID de la escuela a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: El nuevo nombre de la escuela
 *               location:
 *                 type: string
 *                 description: La nueva ubicación de la escuela
 *     responses:
 *       200:
 *         description: Escuela actualizada con éxito
 *       403:
 *         description: No autorizado para actualizar escuelas (solo coordinadores o administradores)
 *       404:
 *         description: Escuela no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', checkRole([3, 4]), schoolController.updateSchool);

/**
 * @swagger
 * /school/{id}:
 *   delete:
 *     description: Elimina una escuela por su ID (solo administradores)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID de la escuela a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Escuela eliminada con éxito
 *       403:
 *         description: No autorizado para eliminar escuelas (solo coordinadores o administradores)
 *       404:
 *         description: Escuela no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', checkRole([3]), schoolController.deleteSchool);

/**
 * @swagger
 * /school/coordinator/schools:
 *   get:
 *     description: Obtiene todas las escuelas gestionadas por el coordinador (solo coordinadores)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de escuelas gestionadas por el coordinador
 *       403:
 *         description: No autorizado para ver escuelas del coordinador (solo coordinadores)
 *       500:
 *         description: Error interno del servidor
 */

router.get('/coordinator/schools', checkRole([4]), schoolController.getCoordinatorSchools);

module.exports = router;
