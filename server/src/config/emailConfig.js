const nodemailer = require('nodemailer');

// Crear el transporter para Gmail
const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true para puerto 465, false para otros puertos
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Plantilla para el correo de recuperación de contraseña
const createPasswordResetEmail = (email, resetUrl) => {
    return {
        from: `"Classment Academy" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Recuperación de Contraseña - Classment Academy',
        text: `Por favor, haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333; text-align: center;">Recuperación de Contraseña</h1>
                <p style="color: #666;">Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #FFD700; 
                              color: #000; 
                              padding: 12px 24px; 
                              text-decoration: none; 
                              border-radius: 5px; 
                              display: inline-block;">
                        Restablecer Contraseña
                    </a>
                </div>
                <p style="color: #666;">Este enlace expirará en 1 hora por razones de seguridad.</p>
                <p style="color: #999; font-size: 12px;">Si no solicitaste restablecer tu contraseña, puedes ignorar este correo.</p>
            </div>
        `
    };
};

module.exports = {
    createTransporter,
    createPasswordResetEmail
}; 