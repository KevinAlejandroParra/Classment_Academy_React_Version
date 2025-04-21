const { Router } = require("express");
const UserController = require("../controllers/userController");
const { verifyToken, checkRole } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = path.join(__dirname, "..", "..", "public", "images", "users");
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = `user-${req.params.id}-${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const isValid = allowed.test(file.mimetype);
  isValid ? cb(null, true) : cb(new Error("Tipo de archivo no permitido"), false);
};

const upload = multer({ storage, fileFilter });

// Rutas autenticación
/**
 * @swagger
 * /user/login:
 *   post:
 *     description: Inicia sesión de un usuario
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales incorrectas
 */
router.post("/login", UserController.login);

/**
 * @swagger
 * /user/forgot-password:
 *   post:
 *     description: Solicita un restablecimiento de contraseña
 *     responses:
 *       200:
 *         description: Correo de restablecimiento enviado
 *       404:
 *         description: Usuario no encontrado
 */
router.post("/forgot-password", UserController.forgotPassword);

/**
 * @swagger
 * /user/reset-password:
 *   post:
 *     description: Restablece la contraseña del usuario
 *     responses:
 *       200:
 *         description: Contraseña restablecida con éxito
 *       400:
 *         description: Datos inválidos
 */
router.post("/reset-password", UserController.resetPassword);

/**
 * @swagger
 * /user/auth/me:
 *   get:
 *     description: Verifica el token y devuelve los detalles del usuario autenticado
 *     responses:
 *       200:
 *         description: Información del usuario autenticado
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get("/auth/me", UserController.validateToken);

// Rutas protegidas
router.use(verifyToken);

/**
 * @swagger
 * /user/users:
 *   get:
 *     description: Obtiene todos los usuarios (solo administradores, coordinadores)
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       403:
 *         description: No autorizado
 */
router.get("/users", checkRole([2, 3, 4]), UserController.getUsers);

/**
 * @swagger
 * /user/users/{id}:
 *   get:
 *     description: Obtiene los detalles de un usuario por ID (solo administradores, coordinadores)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del usuario a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/users/:id", checkRole([2, 3, 4]), UserController.getUser);

/**
 * @swagger
 * /user/users:
 *   post:
 *     description: Crea un nuevo usuario (solo administradores y coordinadores)
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 *       403:
 *         description: No autorizado para crear usuarios
 */
router.post("/users", checkRole([2, 4]), UserController.createUser);

/**
 * @swagger
 * /user/users/{id}:
 *   delete:
 *     description: Elimina un usuario por su ID (solo administradores y coordinadores)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del usuario a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/users/:id", checkRole([2, 4]), UserController.deleteUser);

// Rutas específicas

/**
 * @swagger
 * /user/my-courses:
 *   get:
 *     description: Obtiene los cursos del usuario autenticado
 *     responses:
 *       200:
 *         description: Lista de cursos del usuario
 *       401:
 *         description: Usuario no autenticado
 */
router.get("/my-courses", UserController.getUserCourses);

/**
 * @swagger
 * /user/my-schools:
 *   get:
 *     description: Obtiene las escuelas del usuario autenticado
 *     responses:
 *       200:
 *         description: Lista de escuelas del usuario
 *       401:
 *         description: Usuario no autenticado
 */
router.get("/my-schools", UserController.getUserSchools);

/**
 * @swagger
 * /user/coordinators:
 *   get:
 *     description: Obtiene todos los coordinadores (solo administradores)
 *     responses:
 *       200:
 *         description: Lista de coordinadores
 *       403:
 *         description: No autorizado
 */
router.get('/coordinators', checkRole([2]), UserController.getCoordinators);

/**
 * @swagger
 * /user/coordinators/{id}:
 *   get:
 *     description: Obtiene detalles de un coordinador por ID (solo administradores)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del coordinador a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del coordinador
 *       404:
 *         description: Coordinador no encontrado
 */
router.get('/coordinators/:id', checkRole([2]), UserController.getCoordinatorById);

/**
 * @swagger
 * /user/coordinators/{id}/toggle-state:
 *   put:
 *     description: Cambia el estado de un coordinador (solo administradores)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del coordinador a actualizar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estado de coordinador actualizado con éxito
 *       404:
 *         description: Coordinador no encontrado
 */
router.put('/coordinators/:id/toggle-state', checkRole([2]), UserController.toggleUserState);

/**
 * @swagger
 * /user/enroll/{schoolId}:
 *   post:
 *     description: Inscribe un estudiante en una escuela (solo estudiantes)
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         description: El ID de la escuela a la que el estudiante se inscribirá
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estudiante inscrito en la escuela
 *       400:
 *         description: Inscripción fallida
 */
router.post("/enroll/:schoolId", checkRole([1]), UserController.enrollInSchool);

module.exports = router;
