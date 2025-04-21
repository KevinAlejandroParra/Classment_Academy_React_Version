const express = require('express');
const router = express.Router();
const PasswordController = require('../controllers/passwordController');

/**
 * @swagger
 * /password/forgot:
 *   post:
 *     description: Solicita un enlace para restablecer la contraseña de un usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: El correo electrónico del usuario que solicita el restablecimiento de la contraseña
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Enlace para restablecer la contraseña enviado con éxito
 *       400:
 *         description: El correo electrónico proporcionado no es válido o no está registrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/forgot', PasswordController.forgotPassword);

/**
 * @swagger
 * /password/reset:
 *   post:
 *     description: Restablece la contraseña de un usuario utilizando un token válido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: El token de restablecimiento de contraseña recibido por correo
 *                 example: abc123xyz
 *               newPassword:
 *                 type: string
 *                 description: La nueva contraseña del usuario
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Contraseña restablecida con éxito
 *       400:
 *         description: El token es inválido o ha expirado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/reset', PasswordController.resetPassword);

module.exports = router;
