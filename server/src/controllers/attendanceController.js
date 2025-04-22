const asyncHandler = require('express-async-handler');
const { Attendance, Class, User, Enrollment } = require('../models');

// Registrar o actualizar asistencia
exports.recordAttendance = asyncHandler(async (req, res) => {
  const { class_id, user_id, status, notes } = req.body;
  const teacher_id = req.user.user_id;

  const classRecord = await Class.findByPk(class_id);
  if (!classRecord) {
    res.status(404);
    throw new Error('Clase no encontrada');
  }

  if (classRecord.teacher_id !== teacher_id) {
    res.status(403);
    throw new Error('No eres el profesor de esta clase');
  }

  const enrollment = await Enrollment.findOne({
    where: {
      user_id,
      course_id: classRecord.course_id,
      status: 'active'
    }
  });

  if (!enrollment) {
    res.status(400);
    throw new Error('El estudiante no está matriculado en este curso o la matrícula no está activa');
  }

  const [attendance, created] = await Attendance.upsert({
    class_id,
    user_id,
    status,
    notes
  }, {
    returning: true
  });

  res.status(created ? 201 : 200).json(attendance);
});

// Obtener asistencia de una clase
exports.getClassAttendance = asyncHandler(async (req, res) => {
  const { class_id } = req.params;
  const teacher_id = req.user.user_id;

  const classRecord = await Class.findByPk(class_id);
  if (!classRecord) {
    res.status(404);
    throw new Error('Clase no encontrada');
  }

  if (classRecord.teacher_id !== teacher_id) {
    res.status(403);
    throw new Error('No eres el profesor de esta clase');
  }

  const attendance = await Attendance.findAll({
    where: { class_id },
    include: [
      { model: User, as: 'student', attributes: ['user_id', 'user_name', 'user_lastname'] }
    ]
  });

  res.json(attendance);
});

// Obtener historial de asistencia de un estudiante
exports.getStudentAttendance = asyncHandler(async (req, res) => {
  const { course_id, user_id } = req.params;
  const teacher_id = req.user.user_id;

  const course = await Course.findByPk(course_id);
  if (!course) {
    res.status(404);
    throw new Error('Curso no encontrado');
  }

  const isTeacher = await course.hasTeachers(teacher_id);
  if (!isTeacher) {
    res.status(403);
    throw new Error('No eres profesor de este curso');
  }

  const enrollment = await Enrollment.findOne({
    where: {
      user_id,
      course_id,
      status: 'active'
    }
  });

  if (!enrollment) {
    res.status(400);
    throw new Error('El estudiante no está matriculado en este curso o la matrícula no está activa');
  }

  const attendance = await Attendance.findAll({
    include: [
      {
        model: Class,
        as: 'class',
        where: { course_id },
        attributes: ['class_id', 'class_date', 'class_title']
      },
      {
        model: User,
        as: 'student',
        where: { user_id },
        attributes: ['user_id', 'user_name', 'user_lastname']
      }
    ],
    order: [[{ model: Class, as: 'class' }, 'class_date', 'ASC']]
  });

  res.json(attendance);
});