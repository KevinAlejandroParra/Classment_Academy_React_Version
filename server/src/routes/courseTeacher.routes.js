const express = require("express");
const router = express.Router();
const CourseTeacherController = require("../controllers/courseTeacherController");
const { verifyToken, checkRole } = require("../middleware/auth");

/**
 * @swagger
 * /course-teacher/assign:
 *   post:
 *     description: Asigna un profesor a un curso (solo administradores)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: integer
 *               teacherId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Profesor asignado con éxito al curso
 *       403:
 *         description: No autorizado para asignar un profesor (solo administradores)
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/assign", verifyToken, checkRole([3]), CourseTeacherController.assignTeacherToCourse);

/**
 * @swagger
 * /course-teacher/remove:
 *   delete:
 *     description: Elimina la asignación de un profesor de un curso (solo administradores)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: integer
 *               teacherId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Profesor eliminado de la asignación con éxito
 *       403:
 *         description: No autorizado para eliminar la asignación (solo administradores)
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/remove", verifyToken, checkRole([3]), CourseTeacherController.removeTeacherFromCourse);

module.exports = router;
