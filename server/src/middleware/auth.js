const jwt = require('jsonwebtoken');

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
    // Obtenemos el token del header de autorización
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token no proporcionado"
        });
    }
    
    try {
        // Verificamos el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Agregamos la información del usuario al request
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Token inválido o expirado"
        });
    }
};

// Middleware para verificar roles
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "No autenticado"
            });
        }
        
        if (roles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para realizar esta acción"
            });
        }
    };
};

module.exports = { verifyToken, checkRole };