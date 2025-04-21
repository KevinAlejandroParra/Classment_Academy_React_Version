const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createTransporter, createPasswordResetEmail } = require('../config/emailConfig');

class PasswordController {
    static async forgotPassword(req, res) {
        const transporter = createTransporter();
        
        try {
            const { email } = req.body;
            
            // Buscar usuario por email
            const user = await User.findOne({ where: { user_email: email } });
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "No se encontró un usuario con ese correo electrónico"
                });
            }

            // Generar token de recuperación
            const resetToken = jwt.sign(
                { id: user.user_id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Crear URL de recuperación
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
            
            // Crear y enviar el correo
            const mailOptions = createPasswordResetEmail(email, resetUrl);
            
            await transporter.sendMail(mailOptions);

            res.status(200).json({
                success: true,
                message: "Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña"
            });
        } catch (error) {
            console.error("Error en forgotPassword:", error);
            res.status(500).json({
                success: false,
                message: "Error al procesar la solicitud de recuperación de contraseña"
            });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;

            // Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Buscar usuario
            const user = await User.findByPk(decoded.id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado"
                });
            }

            // Actualizar contraseña 
            user.user_password = newPassword;
            await user.save();

            res.status(200).json({
                success: true,
                message: "Contraseña actualizada exitosamente"
            });
        } catch (error) {
            console.error("Error en resetPassword:", error);
            res.status(500).json({
                success: false,
                message: "Error al restablecer la contraseña"
            });
        }
    }
}

module.exports = PasswordController; 