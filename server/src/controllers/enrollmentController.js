const { Enrollment, Course, User, School } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');
const { v4: uuidv4 } = require('uuid');

class EnrollmentController {
    static async enrollStudentInCourse(req, res) {
        try {
            const { courseId } = req.params;
            const studentId = req.user.user_id;

            // 1. Verificar que el curso existe
            const course = await Course.findByPk(courseId, {
                include: [{
                    model: School,
                    as: 'school',
                    attributes: ['school_id', 'school_name']
                }]
            });

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Curso no encontrado'
                });
            }

            // 2. Verificar que el usuario es estudiante
            const student = await User.findByPk(studentId);
            if (!student || student.role_id !== 1) {
                return res.status(403).json({
                    success: false,
                    message: 'Solo los estudiantes pueden inscribirse en cursos'
                });
            }

            // 3. Verificar cupos disponibles
            const enrolledCount = await Enrollment.count({
                where: { 
                    course_id: courseId,
                    status: 'active'
                }
            });

            if (enrolledCount >= course.course_places) {
                return res.status(400).json({
                    success: false,
                    message: 'No hay cupos disponibles en este curso'
                });
            }

            // 4. Verificar edad mínima
            const studentAge = new Date().getFullYear() - new Date(student.user_birth).getFullYear();
            if (studentAge < course.course_age) {
                return res.status(400).json({
                    success: false,
                    message: `No cumples con la edad mínima requerida (${course.course_age} años)`
                });
            }

            // 5. Verificar si ya está inscrito
            const existingEnrollment = await Enrollment.findOne({
                where: {
                    user_id: studentId,
                    course_id: courseId,
                    status: 'active'
                }
            });

            if (existingEnrollment) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya estás inscrito en este curso'
                });
            }

            // 6. Crear la matrícula
            const enrollment = await Enrollment.create({
                enrollment_id: uuidv4(),
                user_id: studentId,
                course_id: courseId,
                course_price: course.course_price,
                status: 'active',
                progress: 0
            });

            // 7. Responder con datos relevantes
            return res.status(201).json({
                success: true,
                data: {
                    enrollment_id: enrollment.enrollment_id,
                    course: {
                        course_id: course.course_id,
                        course_name: course.course_name,
                        school: {
                            school_id: course.school.school_id,
                            school_name: course.school.school_name 
                        }
                    },
                    course_price: enrollment.course_price,
                },
                message: 'Inscripción al curso exitosa'
            });

        } catch (error) {
            console.error('Error en enrollStudentInCourse:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al inscribirse en el curso',
                error: error.message
            });
        }
    }

    

    // Método para obtener matrículas por usuario
    static getEnrollmentsByUser = asyncHandler(async (req, res) => {
        try {
            const { userId } = req.params;
            
            console.log(`Buscando matrículas para el usuario ID: ${userId}`);
            
            // Validación de parámetros
            if (!userId) {
                console.error('ID de usuario no proporcionado');
                return res.status(400).json({ 
                    success: false, 
                    message: 'Se requiere el ID del usuario' 
                });
            }

            // Verificamos que el usuario exista primero
            const user = await User.findByPk(userId);
            if (!user) {
                console.error(`Usuario con ID ${userId} no encontrado`);
                return res.status(404).json({ 
                    success: false, 
                    message: 'Usuario no encontrado' 
                });
            }

            // Buscar todas las matrículas del usuario con información de curso
            const enrollments = await Enrollment.findAll({
                where: { user_id: userId },
                attributes: ['enrollment_id', 'status', 'progress', 'course_price'],
                include: [
                    {
                        model: Course,
                        as: 'course',
                        attributes: ['course_id', 'course_name', 'course_description', 'course_image'],
                    }
                ],
                order: [
                    ['status', 'ASC'],  // Primero los activos
                    ['createdAt', 'DESC']  // Los más recientes primero
                ]
            });
            
            console.log(`Se encontraron ${enrollments.length} matrículas para el usuario ${userId}`);
            
            // Respuesta exitosa
            return res.status(200).json({ 
                success: true, 
                count: enrollments.length,
                data: enrollments 
            });
            
        } catch (error) {
            console.error('Error al obtener matrículas del usuario:', error);
            return res.status(500).json({
                success: false,
                message: 'para acceder a este recurso, primero inscribete a un curso',
                error: error.message
            });
        }
    });

    // Nuevo método para inscribirse en un curso de una escuela específica
    static async enrollStudentInSchoolCourse(req, res) {
        try {
            const { schoolId, courseId } = req.params;
            const studentId = req.user.user_id;

            // 1. Verificar que el curso pertenece a la escuela
            const course = await Course.findOne({
                where: {
                    course_id: courseId,
                    school_id: schoolId
                },
                include: [{
                    model: School,
                    as: 'school',
                    attributes: ['school_id', 'school_name']
                }]
            });

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Curso no encontrado o no pertenece a la escuela especificada'
                });
            }

            // 2. Verificar que el usuario es estudiante
            const student = await User.findByPk(studentId);
            if (!student || student.role_id !== 1) {
                return res.status(403).json({
                    success: false,
                    message: 'Solo los estudiantes pueden inscribirse en cursos'
                });
            }

            // 3. Verificar si ya está inscrito
            const existingEnrollment = await Enrollment.findOne({
                where: {
                    user_id: studentId,
                    course_id: courseId,
                    status: 'active'
                }
            });

            if (existingEnrollment) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya estás inscrito en este curso'
                });
            }

            // 4. Crear la matrícula
            const enrollment = await Enrollment.create({
                enrollment_id: uuidv4(),
                user_id: studentId,
                course_id: courseId,
                start_date: new Date(),
                status: 'active',
                progress: 0
            });

            // 5. Responder con datos relevantes
            return res.status(201).json({
                success: true,
                data: {
                    enrollment_id: enrollment.enrollment_id,
                    course: {
                        course_id: course.course_id,
                        course_name: course.course_name,
                        school: {
                            school_id: course.school.school_id,
                            school_name: course.school.school_name 
                        }
                    },
                },
                message: 'Inscripción al curso exitosa'
            });

        } catch (error) {
            console.error('Error en enrollStudentInSchoolCourse:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al inscribirse en el curso',
                error: error.message
            });
        }
    }
}

module.exports = EnrollmentController;