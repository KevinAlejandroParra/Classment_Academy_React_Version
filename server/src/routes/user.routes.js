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
router.post("/login", UserController.login);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/reset-password", UserController.resetPassword);
router.get("/auth/me", UserController.validateToken);

// Rutas protegidas
router.use(verifyToken);

// Rutas CRUD básicas
router.get("/users", checkRole([2, 3, 4]), UserController.getUsers); // Solo admins pueden listar usuarios
router.get("/users/:id", checkRole([2, 3, 4]), UserController.getUser);
router.post("/users", checkRole([2, 4]), UserController.createUser); // Solo admins/coordinadores pueden crear usuarios
router.delete("/users/:id", checkRole([2, 4]), UserController.deleteUser);

// Rutas específicas
router.get("/my-courses", UserController.getUserCourses); // Cursos del usuario autenticado
router.get("/my-schools", UserController.getUserSchools); // Escuelas del usuario autenticado

// Gestión de coordinadores (solo para administradores)
router.get('/coordinators', checkRole([2]), UserController.getCoordinators);
router.get('/coordinators/:id', checkRole([2]), UserController.getCoordinatorById);
router.put('/coordinators/:id/toggle-state', checkRole([2]), UserController.toggleUserState);

// Inscripción en escuela
router.post("/enroll/:schoolId", checkRole([1]), UserController.enrollInSchool);

module.exports = router;