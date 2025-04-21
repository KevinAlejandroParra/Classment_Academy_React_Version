const express = require('express');
const router = express.Router();
const PasswordController = require('../controllers/passwordController');

// Ruta para solicitar restablecimiento de contraseña
router.post('/forgot', PasswordController.forgotPassword);

// Ruta para restablecer la contraseña
router.post('/reset', PasswordController.resetPassword);

module.exports = router; 