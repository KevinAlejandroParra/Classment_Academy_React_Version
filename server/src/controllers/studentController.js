const { User, School, UserSchool } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');

// Inscribir estudiante a una escuela
exports.enrollStudent = asyncHandler(async (req, res) => {
    const { schoolId } = req.params;
    const studentId = req.user.user_id;

    // Verificar que el usuario sea un estudiante
    const student = await User.findByPk(studentId);
    if (!student || student.role_id !== 1) {
        const error = new Error('Solo los estudiantes pueden inscribirse a escuelas');
        error.statusCode = 403;
        throw error;
    }

    // Verificar que la escuela existe
    const school = await School.findByPk(schoolId);
    if (!school) {
        const error = new Error('Escuela no encontrada');
        error.statusCode = 404;
        throw error;
    }

    // Verificar si el estudiante ya está inscrito en la escuela
    const existingEnrollment = await UserSchool.findOne({
        where: {
            user_id: studentId,
            school_id: schoolId
        }
    });

    if (existingEnrollment) {
        const error = new Error('Ya estás inscrito en esta escuela');
        error.statusCode = 400;
        throw error;
    }

    // Crear la inscripción
    await UserSchool.create({
        user_id: studentId,
        school_id: schoolId,
        is_student: true,
        enrollment_date: new Date()
    });

    return res.status(201).json({
        success: true,
        message: 'Inscripción exitosa',
        data: {
            school_id: schoolId,
            school_name: school.school_name
        }
    });
});

// Obtener las escuelas en las que está inscrito un estudiante
exports.getStudentSchools = asyncHandler(async (req, res) => {
    const studentId = req.user.user_id;

    const schools = await School.findAll({
        include: [{
            model: UserSchool,
            where: {
                user_id: studentId,
                is_student: true
            },
            attributes: ['enrollment_date']
        }]
    });

    return res.status(200).json({
        success: true,
        data: schools
    });
});

// Obtener los detalles de una escuela específica para un estudiante
exports.getStudentSchoolDetails = asyncHandler(async (req, res) => {
    const { schoolId } = req.params;
    const studentId = req.user.user_id;

    // Verificar que el estudiante está inscrito en la escuela
    const enrollment = await UserSchool.findOne({
        where: {
            user_id: studentId,
            school_id: schoolId,
            is_student: true
        }
    });

    if (!enrollment) {
        const error = new Error('No estás inscrito en esta escuela');
        error.statusCode = 403;
        throw error;
    }

    const school = await School.findByPk(schoolId, {
        include: [{
            model: User,
            as: 'coordinators',
            attributes: ['user_id', 'user_name', 'user_lastname', 'user_email']
        }]
    });

    return res.status(200).json({
        success: true,
        data: school
    });
}); 