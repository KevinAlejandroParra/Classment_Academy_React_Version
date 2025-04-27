const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { 
  User, 
  Course, 
  CourseTeacher, 
  Class,
  Enrollment,
  Attendance,
  sequelize,
  School,
  UserSchoolRole
} = require('../models');
const { Op } = require('sequelize');
const teacherController = require('../controllers/teacherController');

/**
 * @route   GET /api/teacher/courses
 * @desc    Obtener cursos asignados al profesor
 * @access  Private (solo docentes)
 */


router.get('/courses', verifyToken, teacherController.getCourses);

/**
 * @route   GET /api/teacher/schools
 * @desc    Obtener escuelas donde el profesor está asignado
 * @access  Private (solo docentes)
 */
router.get('/schools', verifyToken, async (req, res) => {
  try {
    const teacherId = req.user.user_id;

    // Obtener las escuelas donde el profesor está asignado a través de UserSchoolRole
    const userSchoolRoles = await UserSchoolRole.findAll({
      where: { 
        user_id: teacherId,
        role_id: 2 // rol de profesor
      },
      include: [{
        model: School,
        as: 'school',
        include: [{
          model: Course,
          as: 'courses'
        }]
      }]
    });

    const schools = userSchoolRoles.map(usr => {
      const school = usr.school.get({ plain: true });
      return {
        ...school,
        user_role_id: usr.role_id
      };
    });

    res.json({
      success: true,
      data: schools
    });
  } catch (error) {
    console.error('Error al obtener escuelas del profesor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las escuelas',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/courses/:courseId/students
 * @desc    Obtener estudiantes inscritos en un curso
 * @access  Private (docentes y administradores)
 */
router.get('/courses/:courseId/students', verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.user_id;

    // Verificar que el profesor tenga acceso al curso
    const courseTeacher = await CourseTeacher.findOne({
      where: {
        course_id: courseId,
        teacher_id: teacherId
      }
    });

    if (!courseTeacher) {
      return res.status(403).json({
        success: false,
        message: 'No tienes acceso a este curso'
      });
    }

    // Obtener estudiantes del curso
    const students = await User.findAll({
      attributes: [
        'user_id', 
        'user_name', 
        'user_lastname', 
        'user_image'
      ],
      include: [
        {
          model: Course,
          as: 'enrolledCourses',
          where: { course_id: courseId },
          attributes: [],
          through: { attributes: [] }
        }
      ]
    });

    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error al obtener estudiantes del curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los estudiantes',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/classes/course/:courseId
 * @desc    Obtener clases de un curso específico
 * @access  Private (docentes y estudiantes del curso)
 */
router.get('/classes/course/:courseId', verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.user_id;

    // Verificar que el usuario tenga acceso al curso (como profesor o estudiante)
    const courseAccess = await Promise.all([
      CourseTeacher.findOne({ where: { course_id: courseId, teacher_id: userId } }),
      Enrollment.findOne({ where: { course_id: courseId, user_id: userId } })
    ]);

    if (!courseAccess[0] && !courseAccess[1]) {
      return res.status(403).json({
        success: false,
        message: 'No tienes acceso a este curso'
      });
    }

    // Obtener todas las clases del curso
    const classes = await Class.findAll({
      where: { course_id: courseId },
      attributes: [
        'class_id',
        'class_title',
        'class_date',
        'class_description',
        'course_id',
        'duration'
      ],
      order: [['class_date', 'ASC']]
    });

    res.json({
      success: true,
      data: classes
    });
  } catch (error) {
    console.error('Error al obtener clases del curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las clases',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/attendance/class/:classId
 * @desc    Obtener registro de asistencia para una clase específica
 * @access  Private (solo docentes)
 */
router.get('/attendance/class/:classId', verifyToken, async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.user.user_id;

    // Verificar que la clase exista y pertenezca al profesor
    const classInfo = await Class.findOne({
      where: { 
        class_id: classId,
        teacher_id: teacherId
      }
    });

    if (!classInfo) {
      return res.status(403).json({
        success: false,
        message: 'No tienes acceso a esta clase o no existe'
      });
    }

    // Obtener registros de asistencia para la clase
    const attendance = await Attendance.findAll({
      where: { class_id: classId },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['user_id', 'user_name', 'user_lastname', 'user_image']
        }
      ],
      attributes: [
        'attendance_id',
        'status',
        'notes'
      ]
    });

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error al obtener asistencia de la clase:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los registros de asistencia',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/attendance
 * @desc    Registrar asistencia de un estudiante
 * @access  Private (solo docentes)
 */
router.post('/attendance', verifyToken, async (req, res) => {
  try {
    const { class_id, user_id, status, notes } = req.body;
    const teacherId = req.user.user_id;

    // Verificar que la clase exista y pertenezca al profesor
    const classInfo = await Class.findOne({
      where: { 
        class_id,
        teacher_id: teacherId
      }
    });

    if (!classInfo) {
      return res.status(403).json({
        success: false,
        message: 'No tienes acceso a esta clase o no existe'
      });
    }

    // Verificar que el estudiante esté inscrito en el curso
    const enrollment = await Enrollment.findOne({
      where: {
        user_id,
        course_id: classInfo.course_id
      }
    });

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'El estudiante no está inscrito en este curso'
      });
    }

    // Buscar un registro de asistencia existente o crear uno nuevo
    const [attendance, created] = await Attendance.findOrCreate({
      where: {
        class_id,
        user_id
      },
      defaults: {
        status,
        notes: notes || null
      }
    });

    // Si ya existía, actualizar los valores
    if (!created) {
      await attendance.update({
        status,
        notes: notes || attendance.notes
      });
    }

    res.json({
      success: true,
      data: attendance,
      message: created ? 'Asistencia registrada' : 'Asistencia actualizada'
    });
  } catch (error) {
    console.error('Error al registrar asistencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar la asistencia',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/classes
 * @desc    Crear una nueva clase
 * @access  Private (solo docentes)
 */
router.post('/classes', verifyToken, async (req, res) => {
  try {
    const { course_id, class_date, class_title, class_description, duration } = req.body;
    const teacherId = req.user.user_id;

    // Verificar que el profesor tenga acceso al curso
    const courseTeacher = await CourseTeacher.findOne({
      where: {
        course_id,
        teacher_id: teacherId
      }
    });

    if (!courseTeacher) {
      return res.status(403).json({
        success: false,
        message: 'No tienes acceso a este curso'
      });
    }

    // Crear la nueva clase
    const newClass = await Class.create({
      course_id,
      teacher_id: teacherId,
      class_date,
      class_title,
      class_description,
      duration: duration || 60 // Duración por defecto: 60 minutos
    });

    res.status(201).json({
      success: true,
      data: newClass,
      message: 'Clase creada exitosamente'
    });
  } catch (error) {
    console.error('Error al crear clase:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la clase',
      error: error.message
    });
  }
});

module.exports = router;