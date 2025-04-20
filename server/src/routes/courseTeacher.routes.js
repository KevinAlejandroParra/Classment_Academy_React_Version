const express = require("express");
const router = express.Router();
const CourseTeacherController = require("../controllers/courseTeacherController");
const { verifyToken, checkRole } = require("../middleware/auth");

// Rutas protegidas con token
router.post("/assign",verifyToken, checkRole([3]), CourseTeacherController.assignTeacherToCourse);
router.delete("/remove",verifyToken,checkRole([3]),CourseTeacherController.removeTeacherFromCourse);

module.exports = router;
