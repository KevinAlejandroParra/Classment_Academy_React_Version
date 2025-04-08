const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Obtener el token del header de autorización
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Añadir la información del usuario decodificada a la solicitud
    req.user = decoded;
    
    // Continuar con la siguiente función en la cadena
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
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