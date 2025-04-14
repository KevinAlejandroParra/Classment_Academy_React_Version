const { Router } = require("express");
const UserController = require("../controllers/userController.js");
const { verifyToken } = require("../middleware/auth.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const userRoutes = Router();
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
// CRUD
userRoutes.get("/users", UserController.getUsers);
userRoutes.get("/users/:id", UserController.getUser);
userRoutes.put("/users/:id", upload.single("imagen"), UserController.updateUser);
userRoutes.post("/users", UserController.createUser);
userRoutes.delete("/users/:id", UserController.deleteUser);
userRoutes.post("/login", UserController.login);
userRoutes.post("/forgot-password", UserController.forgotPassword);
userRoutes.post("/reset-password", UserController.resetPassword);
userRoutes.get("/auth/me", verifyToken, UserController.validateToken);
userRoutes.get("/users/:id/courses", UserController.getUserCourses);
userRoutes.get("/users/:id/schools", UserController.getUserSchools);

module.exports = userRoutes;
