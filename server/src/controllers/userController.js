const { User, School, Course, Enrollment, UserSchoolRole, CourseTeacher } = require("../models");
const jwt = require("jsonwebtoken"); 
const bcrypt = require("bcrypt"); 
const nodemailer = require("nodemailer");
const path = require("path");
const asyncHandler = require("../middleware/asyncHandler");
const { v4: uuidv4 } = require('uuid');
const emailConfig = require('../config/emailConfig');
const { createTransporter } = require('../config/emailConfig');

// Configurar el transporter de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
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
            const userJSON = req.body;

            // Si intenta registrarse como admin, lo dejamos como estudiante y pendiente
            if (parseInt(userJSON.role_id) === 3) {
                userJSON.role_id = 1; // estudiante
                userJSON.pending_admin = true;
            }

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
            const validRoles = [1, 2, 3, 4]; // 1: estudiante, 2: profesor, 3: administrador, 4: coordinador
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

            // Si es profesor (role_id: 2) y tiene school_id en el request
            if (userJSON.role_id === 2 && userJSON.school_id) {
                await user.addSchool(userJSON.school_id, { 
                    through: { 
                        role_id: 2, // rol de profesor
                    }
                });
            }
            // Si es regulador (role_id: 4) 
            if (userJSON.role_id === 4 && userJSON.school_id) {
                await user.addSchool(userJSON.school_id, {
                    through: {
                        role_id: 4, // rol de coordinador
                    }
                });
            }

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

            // Si el usuario tiene pending_admin inicia sesion como estudiante
            if (foundUser.pending_admin && foundUser.role_id === 3) {
                return res.status(401).json({
                    success: false,
                    message: "Tu solicitud para ser administrador está pendiente de aprobación",
                });
            }
            // token JWT
            const token = jwt.sign(
                {
                    user_id: foundUser.user_id,
                    email: foundUser.user_email,
                    role_id: foundUser.role_id,
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
                    role_id: user.role_id,
                    name: user.user_name,
                    lastname: user.user_lastname,
                    image: user.user_image,
                    state: user.user_state,
                    pending_admin: user.pending_admin
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

    static async getUserCourses(req, res) {
        try {
            const userId = req.user?.user_id;
            const user = await User.findByPk(userId, {
                attributes: ["user_id", "role_id"],
            });
    
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado",
                });
            }
    
            let coursesData = [];
    
            // Lógica para estudiantes (rol 1)
            if (user.role_id === 1) {
                const enrollments = await Enrollment.findAll({
                    where: { user_id: userId },
                    include: [{
                        model: Course,
                        as: 'course',
                        include: [{
                            model: School,
                            as: 'school'
                        }]
                    }],
                    attributes: ['enrollment_id', 'status', 'progress']
                });
    
                coursesData = enrollments.map(enrollment => {
                    const e = enrollment.get({ plain: true });
                    const course = e.course || {};
                    const school = course.school || {};
    
                    return {
                        enrollment_id: e.enrollment_id,
                        status: e.status,
                        progress: e.progress,
                        course_id: course.course_id,
                        course_name: course.course_name,
                        course_description: course.course_description,
                        course_image: course.course_image,
                        school: {
                            school_id: school.school_id,
                            school_name: school.school_name,
                            school_image: school.school_image,
                            school_email: school.school_email
                        },
                        access_type: 'student' 
                    };
                });
            }
            // Lógica para profesores y administradores (roles 2 y 3)
            else if ([2, 3].includes(user.role_id)) {
                // 1. Obtener todas las escuelas donde el usuario tiene otro rol que no sea estudiante
                const userSchoolRoles = await UserSchoolRole.findAll({
                    where: { user_id: userId },
                    include: [{
                        model: School,
                        as: "school",
                        include: [{
                            model: Course,
                            as: "courses",
                            include: [{
                                model: School,
                                as: 'school'
                            }]
                        }]
                    }]
                });
    
                // 2. Recopilar todos los cursos de esas escuelas
                userSchoolRoles.forEach(usr => {
                    const school = usr.school.get({ plain: true });
                    if (school.courses && school.courses.length > 0) {
                        school.courses.forEach(course => {
                            coursesData.push({
                                course_id: course.course_id,
                                course_name: course.course_name,
                                course_description: course.course_description,
                                course_image: course.course_image,
                                school: {
                                    school_id: school.school_id,
                                    school_name: school.school_name,
                                    school_image: school.school_image,
                                    school_email: school.school_email
                                },
                                access_type: usr.role_id === 2 ? 'teacher' : 'admin', 
                                user_role_id: usr.role_id, 
                                school_role: usr.role_id 
                            });
                        });
                    }
                });
    
                // 3. Opcional: Si es profesor, también podríamos buscar cursos específicamente asignados
                if (user.role_id === 2) {
                    const teacherCourses = await CourseTeacher.findAll({
                        where: { teacher_id: userId },
                        include: [{
                            model: Course,
                            as: 'course',
                            include: [{
                                model: School,
                                as: 'school'
                            }]
                        }]
                    });
    
                    teacherCourses.forEach(tc => {
                        const course = tc.course.get({ plain: true });
                        const school = course.school || {};
                        
                        // Evitar duplicados
                        if (!coursesData.some(c => c.course_id === course.course_id)) {
                            coursesData.push({
                                course_id: course.course_id,
                                course_name: course.course_name,
                                course_description: course.course_description,
                                course_image: course.course_image,
                                school: {
                                    school_id: school.school_id,
                                    school_name: school.school_name,
                                    school_image: school.school_image,
                                    school_email: school.school_email
                                },
                                access_type: 'teacher',
                                user_role_id: 2,

                            });
                        }
                    });
                }
            }
    
            return res.status(200).json({
                success: true,
                data: coursesData,
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
            const userId = req.user.user_id;

            // 1. Verificar que el usuario existe
            const user = await User.findByPk(userId, {
                attributes: ["user_id", "role_id"],
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado para obtener escuelas",
                });
            }

            let schools = [];

            // obtener escuelas a través de cursos matriculados
            if (user.role_id === 1) {
                const enrollmentRecords = await Enrollment.findAll({
                    where: {
                        user_id: userId,
                        status: "active",
                    },
                    include: [
                        {
                            model: Course,
                            as: "course",
                            attributes: ["course_id", "course_name"],
                            include: [
                                {
                                    model: School,
                                    as: "school", 
                                    attributes: [
                                        "school_id",
                                        "school_name",
                                        "school_description",
                                        "school_phone",
                                        "school_image",
                                        "school_email",
                                    ],
                                },
                            ],
                        },
                    ],
                });

                // Mapear escuelas únicas
                const schoolsMap = new Map();

                enrollmentRecords.forEach((enrollment) => {
                    const course = enrollment.course;
                    if (course && course.school) {
                        const school = course.school;
                        if (!schoolsMap.has(school.school_id)) {
                            const plainSchool = school.get ? school.get({ plain: true }) : school;
                          
                            schoolsMap.set(school.school_id, {
                              ...plainSchool,
                              enrollments: []
                            });
                          }
                          

                        schoolsMap.get(school.school_id).enrollments.push({
                            enrollment_id: enrollment.enrollment_id,
                            course_id: course.course_id,
                            course_name: course.course_name,
                            start_date: enrollment.start_date,
                            end_date: enrollment.end_date,
                        });
                    }
                });

                schools = Array.from(schoolsMap.values()).map((school) => {
                    const plainSchool = school.get ? school.get({ plain: true }) : school;
                    return {
                      ...plainSchool,
                      enrollments: school.enrollments || []
                    };
                  });
                  
            }
            // Lógica para profesores, coordinadores y administradores
            else if ([2, 3 ].includes(user.role_id)) {
                // 2: profesor, 3: administrador,
                const userSchoolRoles = await UserSchoolRole.findAll({
                    where: { user_id: userId },
                    include: [
                        {
                            model: School,
                            as: "school",
                            attributes: [
                                "school_id",
                                "school_name",
                                "school_image",
                                "school_email",
                                "school_phone",
                                "school_description"
                                
                            ],
                            include: [
                                {
                                    model: Course,
                                    as: "courses",
                                    attributes: ["course_id", "course_name"],
                                    required: false,
                                },
                            ],
                        },
                    ],
                    attributes: ["role_id"],
                });

                schools = userSchoolRoles.map((usr) => {
                    const school = usr.school.get({ plain: true });
                    school.user_role_id = usr.role_id; // Rol específico en esta escuela
                    return school;
                });
            }

            // 4. Ordenar escuelas alfabéticamente
            schools.sort((a, b) => a.school_name.localeCompare(b.school_name));

            // Convertir a objetos puros (sin dataValues, etc.)
            return res.status(200).json({
                success: true,
                data: schools.map(school => {
                  const plainSchool = school.get ? school.get({ plain: true }) : school;
                  if (plainSchool.enrollments && Array.isArray(plainSchool.enrollments)) {
                    plainSchool.enrollments = plainSchool.enrollments.map(enr => ({ ...enr }));
                  }
                  return plainSchool;
                }),
                message: "Escuelas del usuario obtenidas correctamente"
              });
              
        } catch (error) {
            console.error("Error en getUserSchools:", error);
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
                    as: 'schools',
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

    static async enrollInSchool(req, res) {
        try {
            const { schoolId } = req.params;
            const userId = req.user.user_id;

            // 1. Verificar que la escuela existe
            const school = await School.findByPk(schoolId);
            if (!school) {
                return res.status(404).json({
                    success: false,
                    message: 'Escuela no encontrada'
                });
            }

            // 2. Verificar que el usuario es un estudiante
            const user = await User.findByPk(userId);
            if (!user || user.role_id !== 1) {
                return res.status(403).json({
                    success: false,
                    message: 'Solo los estudiantes pueden inscribirse en escuelas'
                });
            }

            // 3. Verificar si ya está inscrito en la escuela
            const existingRole = await UserSchoolRole.findOne({
                where: {
                    user_id: userId,
                    school_id: schoolId
                }
            });

            if (existingRole) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya estás inscrito en esta escuela'
                });
            }

            // 4. Crear la relación usuario-escuela
            await UserSchoolRole.create({
                user_id: userId,
                school_id: schoolId,
                role_id: 1 // Rol de estudiante
            });

            return res.status(201).json({
                success: true,
                message: 'Inscripción exitosa en la escuela'
            });

        } catch (error) {
            console.error('Error en enrollInSchool:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al inscribirse en la escuela',
                error: error.message
            });
        }
    }

    // Obtener todos los administradores
    static async getAdministrators(req, res) {
        try {
            const administrators = await User.findAll({
                where: { role_id: 3 },
                include: [{
                    model: School,
                    as: 'schools',
                    attributes: ['school_id', 'school_name', 'school_description', 'school_email', 'school_phone', 'school_address'],
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
                data: administrators
            });
        } catch (error) {
            console.error("Error al obtener administradores:", error);
            return res.status(500).json({
                success: false,
                message: "Error al obtener los administradores",
                error: error.message
            });
        }
    }

    // Cambiar estado de un administrador
    static async toggleAdminState(req, res) {
        try {
            const { id } = req.params;
            console.log('toggleAdminState - ID recibido:', id);
            const user = await User.findByPk(id);
            console.log('toggleAdminState - Usuario encontrado:', user ? user.toJSON() : null);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Administrador no encontrado'
                });
            }

            // Solo permitir cambiar estado de administradores o ex-admins
            if (![1, 3].includes(user.role_id)) {
                console.log('toggleAdminState - El usuario no es admin ni ex-admin, role_id:', user.role_id);
                return res.status(403).json({
                    success: false,
                    message: 'Solo se puede cambiar el estado de administradores o ex-administradores'
                });
            }

            let newState, newRole;
            if (user.user_state === 'activo') {
                newState = 'inactivo';
                newRole = 1; // estudiante
            } else {
                newState = 'activo';
                newRole = 3; // admin
            }

            console.log('toggleAdminState - Actualizando a:', { user_state: newState, role_id: newRole });
            await user.update({ user_state: newState, role_id: newRole });

            return res.status(200).json({
                success: true,
                message: `Estado del administrador actualizado a ${newState}`,
                data: {
                    user_id: user.user_id,
                    user_state: newState,
                    role_id: newRole
                }
            });
        } catch (error) {
            console.error("Error al cambiar el estado del administrador:", error);
            return res.status(500).json({
                success: false,
                message: "Error al cambiar el estado del administrador",
                error: error.message,
                stack: error.stack // Para depuración
            });
        }
    }

    // Listar usuarios pendientes de admin
    static async getPendingAdmins(req, res) {
        try {
            const pendingAdmins = await User.findAll({
                where: { pending_admin: true },
                attributes: { exclude: ["user_password"] }
            });
            res.status(200).json({
                success: true,
                data: pendingAdmins,
                message: "Usuarios pendientes de ser administradores obtenidos correctamente"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al obtener usuarios pendientes de admin",
                error: error.message
            });
        }
    }

    // Aprobar solicitud de admin
    static async approveAdmin(req, res) {
        try {
            const { userId } = req.params;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: "Usuario no encontrado" });
            }
            user.role_id = 3; // admin
            user.pending_admin = false;
            await user.save();

            // Enviar correo de notificación
            try {
                const transporter = createTransporter();
                await transporter.sendMail({
                    from: `"Classment Academy" <${process.env.EMAIL_USER}>`,
                    to: user.user_email,
                    subject: "¡Has sido aprobado como Administrador!",
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h1 style="color: #333; text-align: center;">¡Felicidades!</h1>
                            <p style="color: #666;">Tu solicitud para ser administrador ha sido <b>aprobada</b>.</p>
                            <p style="color: #666;">Ya puedes ingresar al sistema con permisos de administrador.</p>
                            <p style="color: #999; font-size: 12px;">Si tienes dudas, contacta al equipo de soporte.</p>
                        </div>
                    `
                });
            } catch (err) {
                console.error("Error enviando correo de aprobación de admin:", err);
                // No interrumpir el flujo si falla el correo
            }

            res.status(200).json({ success: true, message: "Usuario aprobado como administrador" });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al aprobar administrador",
                error: error.message
            });
        }
    }

    // Rechazar solicitud de admin
    static async rejectAdmin(req, res) {
        try {
            const { userId } = req.params;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: "Usuario no encontrado" });
            }
            user.role_id = 1; // estudiante
            user.pending_admin = false;
            await user.save();
            res.status(200).json({ success: true, message: "Solicitud de administrador rechazada" });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al rechazar administrador",
                error: error.message
            });
        }
    }
}

module.exports = UserController;