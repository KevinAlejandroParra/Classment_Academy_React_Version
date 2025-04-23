const { User, Course, CourseTeacher, Class, Enrollment, Attendance, sequelize } = require('../models');

// Obtener cursos asignados al profesor
exports.getCourses = async (req, res) => {
  try {
    const teacherId = req.user.user_id;
    console.log("Teacher ID:", teacherId);
    
    // Verificar si hay asignaciones en CourseTeacher para este profesor
    const teacherAssignments = await CourseTeacher.findAll({
      where: { teacher_id: teacherId },
      raw: true
    });
    
    console.log("Teacher assignments found:", teacherAssignments);
    
    if (teacherAssignments.length === 0) {
      console.log("No assignments found for this teacher in the CourseTeacher table");
    }
    
    // Original query
    const courseTeacherRelations = await CourseTeacher.findAll({
      where: { teacher_id: teacherId },
      include: [{
        model: Course,
        as: 'course',
        attributes: ['course_id', 'course_name', 'course_description']
      }]
    });
    
    console.log("Relations found:", JSON.stringify(courseTeacherRelations, null, 2));
    
    const courses = courseTeacherRelations.map(relation => relation.course);
    
    console.log("Courses found:", courses);
    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Error al obtener cursos del profesor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los cursos',
      error: error.message
    });
  }
};
// Obtener estudiantes inscritos en un curso
exports.getStudentsInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.user_id;

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

    const students = await User.findAll({
      attributes: ['user_id', 'user_name', 'user_lastname', 'user_image'],
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
};

// Obtener clases de un curso específico
exports.getClassesInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.user_id;

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

    const classes = await Class.findAll({
      where: { course_id: courseId },
      attributes: ['class_id', 'class_title', 'class_date', 'class_description', 'duration'],
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
};

// Obtener registro de asistencia para una clase específica
exports.getAttendanceForClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.user.user_id;

    const classInfo = await Class.findOne({
      where: { class_id: classId, teacher_id: teacherId }
    });

    if (!classInfo) {
      return res.status(403).json({
        success: false,
        message: 'No tienes acceso a esta clase o no existe'
      });
    }

    const attendance = await Attendance.findAll({
      where: { class_id: classId },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['user_id', 'user_name', 'user_lastname', 'user_image']
        }
      ],
      attributes: ['attendance_id', 'status', 'notes']
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
};

// Registrar asistencia de un estudiante
exports.registerAttendance = async (req, res) => {
  try {
    const { class_id, user_id, status, notes } = req.body;
    const teacherId = req.user.user_id;

    const classInfo = await Class.findOne({
      where: { class_id, teacher_id: teacherId }
    });

    if (!classInfo) {
      return res.status(403).json({
        success: false,
        message: 'No tienes acceso a esta clase o no existe'
      });
    }

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
};

// Crear una nueva clase
exports.createClass = async (req, res) => {
  try {
    const { course_id, class_date, class_title, class_description, duration } = req.body;
    const teacherId = req.user.user_id;

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
};
