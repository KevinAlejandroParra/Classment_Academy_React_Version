const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { verifyToken, checkRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para escuelas
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = path.join(__dirname, "..", "..", "public", "images", "schools");
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = `school-${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const isValid = allowed.test(file.mimetype);
  isValid ? cb(null, true) : cb(new Error("Tipo de archivo no permitido"), false);
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

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

router.get('/get-school/', verifyToken, schoolController.getAdminSchool);

router.get('/:id', verifyToken, schoolController.getSchoolById);

/**
 * @swagger
 * /school:
 *   post:
 *     description: Crea una nueva escuela (solo coordinadores y administradores)
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: school_image
 *         type: file
 *         description: Imagen de la escuela
 *       - in: formData
 *         name: school_name
 *         type: string
 *         required: true
 *       - in: formData
 *         name: school_description
 *         type: string
 *         required: true
 *       - in: formData
 *         name: school_phone
 *         type: string
 *         required: true
 *       - in: formData
 *         name: school_address
 *         type: string
 *         required: true
 *       - in: formData
 *         name: school_email
 *         type: string
 *         required: true
 *       - in: formData
 *         name: teacher_id
 *         type: string
 *         required: true
 *     responses:
 *       201:
 *         description: Escuela creada con éxito
 *       403:
 *         description: No autorizado para crear escuelas
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', verifyToken, checkRole([3, 4]), upload.single('school_image'), schoolController.createSchool);

/**
 * @swagger
 * /school/{id}:
 *   put:
 *     description: Actualiza una escuela (solo coordinadores y administradores)
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *       - in: formData
 *         name: school_image
 *         type: file
 *         description: Imagen de la escuela
 *       - in: formData
 *         name: school_name
 *         type: string
 *       - in: formData
 *         name: school_description
 *         type: string
 *       - in: formData
 *         name: school_phone
 *         type: string
 *       - in: formData
 *         name: school_address
 *         type: string
 *       - in: formData
 *         name: school_email
 *         type: string
 *     responses:
 *       200:
 *         description: Escuela actualizada con éxito
 *       403:
 *         description: No autorizado para actualizar escuelas
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', verifyToken, checkRole([3, 4]), upload.single('school_image'), schoolController.updateSchool);

/**
 * @swagger
 * /school/{id}:
 *   delete:
 *     description: Elimina una escuela (solo administradores)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Escuela eliminada con éxito
 *       403:
 *         description: No autorizado para eliminar escuelas
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', verifyToken, checkRole([3]), schoolController.deleteSchool);

router.get('/coordinator/schools', verifyToken, checkRole([4]), schoolController.getCoordinatorSchools);

module.exports = router;