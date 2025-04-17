const { User } = require("../models");
const jwt = require("jsonwebtoken"); 
const bcrypt = require("bcrypt"); 
const nodemailer = require("nodemailer");
const { Course, School } = require("../models");
const path = require("path");
const asyncHandler = require("express-async-handler");

// Configurar el transporter de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

class UserController {
    static async getUsers(req, res) {
        try {
            const page = req.query.page || 1;
            const limit = 10;
            const offset = (page - 1) * limit;

            const { rows, count } = await User.findAndCountAll({
                limit,
                offset,
            });

            res.status(200).json({
                success: true,
                data: rows,
                total: count,
                message: "usuarios obtenidos correctamente",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: error.message,
                message: "Error al obtener los usuarios",
            });
        }
    }

    static async getUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado",
                });
            }

            res.status(200).json({
                success: true,
                data: user,
                message: "Usuario obtenido correctamente",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: error.message,
                message: "Error al obtener el usuario",
            });
        }
    }

    static async createUser(req, res) {
        try {
            const { user: userJSON } = req.body;

            // Validaciones adicionales
            if (!userJSON.user_name || !userJSON.user_lastname || !userJSON.user_email || 
                !userJSON.user_password || !userJSON.user_phone || !userJSON.user_birth || 
                !userJSON.user_document || !userJSON.user_document_type || !userJSON.role_id) {
                return res.status(400).json({
                    success: false,
                    message: "Todos los campos son requeridos"
                });
            }

            // Validación de nombre y apellido (solo letras y espacios)
            const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
            const names = userJSON.user_name.split(" ");
            const lastnames = userJSON.user_lastname.split(" ");
            if (names.some(name => !nameRegex.test(name)) || lastnames.some(lastname => !nameRegex.test(lastname))) {
                return res.status(400).json({
                    success: false,
                    message: "El nombre y apellido solo pueden contener letras y espacios"
                });
            }

            // Validación de teléfono (solo números)
            const phoneRegex = /^\d+$/;
            if (!phoneRegex.test(userJSON.user_phone)) {
                return res.status(400).json({
                    success: false,
                    message: "El teléfono solo puede contener números"
                });
            }

            // Validación de contraseña
            if (userJSON.user_password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: "La contraseña debe tener al menos 8 caracteres"
                });
            }

            // Validación de documento (solo números)
            if (!phoneRegex.test(userJSON.user_document)) {
                return res.status(400).json({
                    success: false,
                    message: "El documento solo puede contener números"
                });
            }

            // Validación de tipo de documento
            const validDocTypes = ["TI", "CC", "CE"];
            if (!validDocTypes.includes(userJSON.user_document_type)) {
                return res.status(400).json({
                    success: false,
                    message: "Tipo de documento no válido"
                });
            }

            // Validación de rol
            const validRoles = [1, 3, 4]; // 1: estudiante, 3: administrador, 4: coordinador
            if (!validRoles.includes(parseInt(userJSON.role_id))) {
                return res.status(400).json({
                    success: false,
                    message: "Rol no válido"
                });
            }

            // Verificar si el email ya existe
            const existingUser = await User.findOne({ where: { user_email: userJSON.user_email } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "El correo electrónico ya está registrado"
                });
            }

            // Verificar si el documento ya existe
            const existingDocument = await User.findOne({ 
                where: { 
                    user_document: userJSON.user_document,
                    user_document_type: userJSON.user_document_type
                } 
            });
            if (existingDocument) {
                return res.status(400).json({
                    success: false,
                    message: "Ya existe un usuario con este documento"
                });
            }

            const user = await User.create(userJSON);

            // Eliminar la contraseña de la respuesta
            const userResponse = user.toJSON();
            delete userResponse.user_password;

            res.status(201).json({
                success: true,
                data: userResponse,
                message: "Usuario creado correctamente"
            });
        } catch (error) {
            console.error("Error en createUser:", error);
            
            // Manejo específico para errores de validación de Sequelize
            if (error.name === "SequelizeValidationError") {
                const validationErrors = error.errors.map((err) => err.message);
                return res.status(400).json({
                    success: false,
                    data: validationErrors,
                    message: "Error de validación"
                });
            }

            res.status(500).json({
                success: false,
                message: "Error al crear el usuario",
                error: error.message
            });
        }
    }

    static async updateUser(req, res) {

        try {
            const userId = req.params.id;
            let userJSON;
            if (typeof req.body.user === "string") {
              userJSON = JSON.parse(req.body.user);
            } else if (typeof req.body.user === "object") {
              userJSON = req.body.user;
            } else {
              userJSON = req.body;
            }
            
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado",
                });
            }
    
            // Si hay imagen, actualizarla
            if (req.file) {
                const imagePath = path.join("images/users", req.file.filename).replace(/\\/g, "/");
                user.user_image = imagePath;
            }
    
            // Validación adicional para contraseña
            if (userJSON.user_password && userJSON.user_password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: "La contraseña debe tener al menos 8 caracteres",
                });
            }
    
            // Actualizar campos si llegan
            const campos = [
                "user_name",
                "user_lastname",
                "user_email",
                "user_phone",
                "user_birthdate",
                "user_document_type",
                "user_document",
                "user_state",
                "user_password"
            ];
    
            campos.forEach((campo) => {
                if (userJSON[campo]) {
                    user[campo] = userJSON[campo];
                }
            });
    
            await user.save();
    
            const userResponse = user.toJSON();
            delete userResponse.user_password;
    
            return res.status(200).json({
                success: true,
                user: userResponse,
                message: "Perfil actualizado correctamente",
            });
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            return res.status(500).json({
                success: false,
                message: "Error al actualizar el usuario",
                error: error.message,
                
            });
        }
    }
    

    static async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado",
                });
            }

            await user.destroy();

            res.status(200).json({
                success: true,
                message: "Usuario eliminado correctamente",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: error.message,
                message: "Error al eliminar el usuario",
            });
        }
    }

    static async login(req, res) {
        try {
            // Obtenemos los datos del usuario
            const { user } = req.body;

            if (!user || !user.user_email || !user.user_password) {
                return res.status(400).json({
                    success: false,
                    message: "Datos de login incompletos",
                });
            }

            console.log("Intentando login con email:", user.user_email);

            // Buscamos al usuario por email
            const foundUser = await User.findOne({ where: { user_email: user.user_email } });

            // Verificamos si el usuario existe
            if (!foundUser) {
                console.log("Usuario no encontrado");
                return res.status(401).json({
                    success: false,
                    message:
                        "Usuario no encontrado, Porfavor ingrese un usuario valido o cree su cuenta ",
                });
            }

            console.log("Usuario encontrado, verificando contraseña");

            const passwordMatch = await bcrypt.compare(user.user_password, foundUser.user_password);

            console.log("¿Contraseña coincide?:", passwordMatch);

            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Contraseña no coincide",
                });
            }

            if (foundUser.user_state == "inactivo") {
                return res.status(401).json({
                    success: false,
                    message: "Usuario inactivo, por favor contacte al administrador para mas información",
                });
            }
            // Si llegamos aquí, las credenciales son correctas
            // Creamos el token JWT
            const token = jwt.sign(
                {
                    user_id: foundUser.user_id,
                    email: foundUser.user_email,
                },
                process.env.JWT_SECRET || "fullsecret",
                { expiresIn: "24h" }
            );

            // Respuesta exitosa con token
            res.status(200).json({
                success: true,
                data: {
                    token,
                },
                message: "Login exitoso",
            });
        } catch (error) {
            console.error("Error en login:", error);
            res.status(500).json({
                success: false,
                data: error.message,
                message: "Error en el proceso de login",
            });
        }
    }

    static async validateToken(req, res) {
        try {
            console.log("Validando token...");
            
            // Verificar si el usuario existe en la base de datos
            const user = await User.findOne({
                where: {
                    user_id: req.user.user_id
                }
            });
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado"
                });
            }
            
            // Si el usuario existe, devolver información válida
            return res.status(200).json({
                success: true,
                valid: true,
                user: {
                    id: user.user_id,
                    email: user.user_email,
                    document: user.user_document,
                    phone: user.user_phone,
                    birthdate: user.user_birth,
                    role: user.role_id,
                    name: user.user_name,
                    lastname: user.user_lastname,
                    image: user.user_image,
                    state: user.user_state
                }
            });
        } catch (error) {
            console.error("Error al validar token:", error);
            return res.status(500).json({
                success: false,
                message: "Error al validar el token",
                error: error.message
            });
        }
    }

    static async forgotPassword(req, res) {
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

            // Enviar correo electrónico
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
            
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Recuperación de Contraseña',
                html: `
                    <h1>Recuperación de Contraseña</h1>
                    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                    <a href="${resetUrl}">Restablecer Contraseña</a>
                    <p>Este enlace expirará en 1 hora.</p>
                `
            });

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
            const salt = await bcrypt.genSalt(10);
            user.user_password = await bcrypt.hash(newPassword, salt);
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

    static async getUserCourses(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId, {
                include: [{
                    model: Course,
                    as: 'courses',
                    include: [{
                        model: School,
                        as: 'school'
                    }],
                    through: {
                        attributes: ['course_plan', 'course_state', 'course_start', 'course_end']
                    }
                }]
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado"
                });
            }

            return res.status(200).json({
                success: true,
                data: user.courses,
                message: "Cursos del usuario obtenidos correctamente"
            });
        } catch (error) {
            console.error("Error al obtener cursos del usuario:", error);
            return res.status(500).json({
                success: false,
                message: "Error al obtener los cursos del usuario",
                error: error.message
            });
        }
    }

    static async getUserSchools(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId, {
                include: [{
                    model: Course,
                    as: 'courses',
                    include: [{
                        model: School,
                        as: 'school'
                    }]
                }]
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado"
                });
            }

            // Obtener escuelas sin duplicados
            const schools = Array.from(
                new Map(
                  user.courses.map(course => [course.school.school_id, course.school])
                ).values()
              );

            return res.status(200).json({
                success: true,
                data: schools,
                message: "Escuelas del usuario obtenidas correctamente"
            });
        } catch (error) {
            console.error("Error al obtener escuelas del usuario:", error);
            return res.status(500).json({
                success: false,
                message: "Error al obtener las escuelas del usuario",
                error: error.message
            });
        }
    }

    // Obtener todos los coordinadores
    static async getCoordinators(req, res) {
        try {
            const coordinators = await User.findAll({
                where: { role_id: 4 },
                include: [{
                    model: School,
                    as: 'managedSchools',
                    attributes: ['school_id', 'school_name'],
                    through: {
                        attributes: []
                    }
                }],
                attributes: [
                    'user_id',
                    'user_name',
                    'user_lastname',
                    'user_email',
                    'user_phone',
                    'user_state'
                ]
            });

            return res.status(200).json({
                success: true,
                data: coordinators
            });
        } catch (error) {
            console.error("Error al obtener coordinadores:", error);
            return res.status(500).json({
                success: false,
                message: "Error al obtener los coordinadores",
                error: error.message
            });
        }
    }

    // Obtener coordinador por ID
    static async getCoordinatorById(req, res) {
        try {
            const { id } = req.params;
            console.log('Buscando coordinador con ID:', id);

            const coordinator = await User.findOne({
                where: { 
                    user_id: id,
                    role_id: 4
                },
                include: [{
                    model: School,
                    as: 'managedSchools',
                    through: {
                        attributes: ['is_owner']
                    }
                }],
                attributes: [
                    'user_id',
                    'user_name',
                    'user_lastname',
                    'user_email',
                    'user_phone',
                    'user_state',
                    'user_document',
                    'user_document_type',
                    'user_birth',
                    'user_image',
                    'role_id'
                ]
            });

            if (!coordinator) {
                console.log('Coordinador no encontrado');
                return res.status(404).json({
                    success: false,
                    message: "Coordinador no encontrado"
                });
            }

            console.log('Coordinador encontrado:', coordinator.user_name);
            return res.status(200).json({
                success: true,
                data: coordinator
            });
        } catch (error) {
            console.error("Error al obtener coordinador:", error);
            return res.status(500).json({
                success: false,
                message: "Error al obtener el coordinador",
                error: error.message
            });
        }
    }

    // Cambiar estado de un usuario
    static async toggleUserState(req, res) {
        try {
            const { id } = req.params;
            
            const user = await User.findByPk(id);
            if (!user) {
                const error = new Error('Usuario no encontrado');
                error.statusCode = 404;
                throw error;
            }

            // Solo permitir cambiar estado de coordinadores
            if (user.role_id !== 4) {
                const error = new Error('Solo se puede cambiar el estado de coordinadores');
                error.statusCode = 403;
                throw error;
            }

            const newState = user.user_state === 'activo' ? 'inactivo' : 'activo';
            await user.update({ user_state: newState });

            return res.status(200).json({
                success: true,
                message: `Estado del usuario actualizado a ${newState}`,
                data: {
                    user_id: user.user_id,
                    user_state: newState
                }
            });
        } catch (error) {
            console.error("Error al cambiar el estado del usuario:", error);
            return res.status(500).json({
                success: false,
                message: "Error al cambiar el estado del usuario",
                error: error.message
            });
        }
    }
}

module.exports = UserController;