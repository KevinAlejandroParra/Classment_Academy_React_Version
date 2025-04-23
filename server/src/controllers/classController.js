// controllers/classController.js
const asyncHandler = require('express-async-handler');
const { Class, Course, User } = require('../models');
const { Op } = require('sequelize');

// Crear una nueva clase
exports.createClass = asyncHandler(async (req, res) => {
  const { course_id, class_date, class_title, class_description, duration } = req.body;

  if (!course_id || !class_date || !class_title || !class_description || !duration) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
  }

  const teacher_id = req.user.user_id;
  const course = await Course.findByPk(course_id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Curso no encontrado' });
  }

  const isTeacher = await course.hasTeachers(teacher_id);
  if (!isTeacher) {
    return res.status(403).json({ success: false, message: 'No eres profesor de este curso' });
  }

  const newClass = await Class.create({ course_id, teacher_id, class_date, class_title, class_description, duration });
  return res.status(201).json({ success: true, message: 'Clase creada exitosamente', data: newClass });
});

// Obtener todas las clases de un curso
exports.getClassesByCourse = asyncHandler(async (req, res) => {
  const { course_id } = req.params;
  const classes = await Class.findAll({
    where: { course_id },
    include: [
      { model: User, as: 'teacher', attributes: ['user_id', 'user_name', 'user_lastname'] }
    ],
    order: [['class_date', 'ASC']]
  });

  return res.json({ success: true, data: classes, message: 'Clases obtenidas exitosamente' });
});

// Obtener próximas clases de un curso (público, ordenadas de la más cercana a la más lejana)
exports.getUpcomingClassesByCourse = asyncHandler(async (req, res) => {
  const { course_id } = req.params;
  const now = new Date();

  // Mostrar en consola para depuración si hace falta
  console.log('getUpcomingClassesByCourse - course_id:', course_id);

  // Verificar que el curso existe
  // Usamos findOne para asegurarnos de que coincida el campo
  const course = await Course.findOne({ where: { course_id } });
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  const upcomingClasses = await Class.findAll({
    where: {
      course_id,
      class_date: { [Op.gte]: now }
    },
    include: [
      { model: User, as: 'teacher', attributes: ['user_id', 'user_name', 'user_lastname'] }
    ],
    order: [['class_date', 'ASC']]
  });

  return res.json({ success: true, data: upcomingClasses, message: 'Upcoming classes retrieved successfully' });
});

// Actualizar una clase
exports.updateClass = asyncHandler(async (req, res) => {
  const { class_id } = req.params;
  const teacher_id = req.user.user_id;
  const updates = req.body;

  const classToUpdate = await Class.findByPk(class_id);
  if (!classToUpdate) {
    return res.status(404).json({ success: false, message: 'Clase no encontrada' });
  }

  if (classToUpdate.teacher_id !== teacher_id) {
    return res.status(403).json({ success: false, message: 'No tienes permiso para editar esta clase' });
  }

  await classToUpdate.update(updates);
  return res.json({ success: true, message: 'Clase actualizada exitosamente', data: classToUpdate });
});

// Eliminar una clase
exports.deleteClass = asyncHandler(async (req, res) => {
  const { class_id } = req.params;
  const teacher_id = req.user.user_id;

  const classToDelete = await Class.findByPk(class_id);
  if (!classToDelete) {
    return res.status(404).json({ success: false, message: 'Clase no encontrada' });
  }

  if (classToDelete.teacher_id !== teacher_id) {
    return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar esta clase' });
  }

  await classToDelete.destroy();
  return res.json({ success: true, message: 'Clase eliminada exitosamente' });
});
