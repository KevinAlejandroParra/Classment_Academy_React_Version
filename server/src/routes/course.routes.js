const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, checkRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para cursos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = path.join(__dirname, "..", "..", "public", "images", "cursos");
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = `curso-${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const isValid = allowed.test(file.mimetype);
  isValid ? cb(null, true) : cb(new Error("Tipo de archivo no permitido"), false);
};

const upload = multer({ storage, fileFilter });

/**
 * @swagger
 * /courses:
 *   get:
 *     description: Obtiene todos los cursos
 *     responses:
 *       200:
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/', courseController.getAllCourses);

/**
 * @swagger
 * /courses/school/{schoolId}:
 *   get:
 *     description: Obtiene todos los cursos de una escuela por su ID
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         description: El ID de la escuela
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de cursos de la escuela
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/school/:schoolId', courseController.getCoursesBySchoolId);

/**
 * @swagger
 * /courses/with-teachers:
 *   get:
 *     description: Obtiene todos los cursos con sus profesores encargados
 *     responses:
 *       200:
 *         description: Lista de cursos con profesores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseWithTeachers'
 */
router.get('/with-teachers', courseController.getCoursesWithTeachers);
/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     description: Obtiene un curso por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del curso
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del curso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 */
router.get('/:id', courseController.getCourseById);

// Obtener estudiantes inscritos en un curso
router.get('/:courseId/students', courseController.getStudentsByCourseId);

// Rutas protegidas
router.use(verifyToken);

/**
 * @swagger
 * /courses:
 *   post:
 *     description: Crea un nuevo curso (solo administradores y coordinadores)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Curso creado con éxito
 *       403:
 *         description: No autorizado para crear un curso
 */
router.post('/', checkRole([3, 4]), upload.single('imagen'), courseController.createCourse);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     description: Actualiza un curso por su ID (solo administradores y coordinadores)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del curso a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Curso actualizado con éxito
 *       403:
 *         description: No autorizado para actualizar el curso
 */
router.put('/:id', checkRole([3, 4]), upload.single('imagen'), courseController.updateCourse);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     description: Elimina un curso por su ID (solo administradores y coordinadores)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del curso a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Curso eliminado con éxito
 *       403:
 *         description: No autorizado para eliminar el curso
 */
router.delete('/:id', checkRole([3, 4]), courseController.deleteCourse);

/**
 * @swagger
 * /courses/{id}/toggle-state:
 *   put:
 *     description: Activa o desactiva un curso (solo profesores y administradores)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del curso a activar/desactivar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado del curso actualizado con éxito
 *       403:
 *         description: No autorizado para cambiar el estado del curso
 */
router.put('/:id/toggle-state', checkRole([2, 3]), courseController.toggleCourseState);

module.exports = router;
