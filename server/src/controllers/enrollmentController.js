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
                plan_type: req.body.plan_type || 'mensual',
                start_date: req.body.start_date ? new Date(req.body.start_date) : new Date(),
                end_date: req.body.end_date ? new Date(req.body.end_date) : EnrollmentController.calculateEndDate(req.body.plan_type),
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
                    plan_type: enrollment.plan_type,
                    start_date: enrollment.start_date,
                    end_date: enrollment.end_date
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

    static calculateEndDate(planType) {
        const endDate = new Date();
        switch(planType) {
            case 'anual':
                endDate.setFullYear(endDate.getFullYear() + 1);
                break;
            case 'semestral':
                endDate.setMonth(endDate.getMonth() + 6);
                break;
            case 'trimestral':
                endDate.setMonth(endDate.getMonth() + 3);
                break;
            default: // mensual
                endDate.setMonth(endDate.getMonth() + 1);
        }
        return endDate;
    }
}

module.exports = EnrollmentController;