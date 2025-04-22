const asyncHandler = require('express-async-handler');
const { Class, Course, User, Enrollment } = require('../models');

// Crear una nueva clase
exports.createClass = asyncHandler(async (req, res) => {
  const { course_id, class_date, class_title, class_description, duration } = req.body;
  const teacher_id = req.user.user_id;

  const course = await Course.findByPk(course_id);
  if (!course) {
    res.status(404);
    throw new Error('Curso no encontrado');
  }

  // Verificar que el usuario es profesor del curso
  const isTeacher = await course.hasTeachers(teacher_id);
  if (!isTeacher) {
    res.status(403);
    throw new Error('No eres profesor de este curso');
  }

  const newClass = await Class.create({
    course_id,
    teacher_id,
    class_date,
    class_title,
    class_description,
    duration
  });

  res.status(201).json(newClass);
});

// Obtener clases de un curso
exports.getClassesByCourse = asyncHandler(async (req, res) => {
  const { course_id } = req.params;

  const classes = await Class.findAll({
    where: { course_id },
    include: [
      { model: User, as: 'teacher', attributes: ['user_id', 'user_name', 'user_lastname'] },
      { model: Course, as: 'course', attributes: ['course_id', 'course_name'] }
    ],
    order: [['class_date', 'ASC']]
  });

  res.json(classes);
});

// Actualizar una clase
exports.updateClass = asyncHandler(async (req, res) => {
  const { class_id } = req.params;
  const teacher_id = req.user.user_id;
  const updates = req.body;

  const classToUpdate = await Class.findByPk(class_id);
  if (!classToUpdate) {
    res.status(404);
    throw new Error('Clase no encontrada');
  }

  if (classToUpdate.teacher_id !== teacher_id) {
    res.status(403);
    throw new Error('No tienes permiso para editar esta clase');
  }

  await classToUpdate.update(updates);
  res.json(classToUpdate);
});

// Eliminar una clase
exports.deleteClass = asyncHandler(async (req, res) => {
  const { class_id } = req.params;
  const teacher_id = req.user.user_id;

  const classToDelete = await Class.findByPk(class_id);
  if (!classToDelete) {
    res.status(404);
    throw new Error('Clase no encontrada');
  }

  if (classToDelete.teacher_id !== teacher_id) {
    res.status(403);
    throw new Error('No tienes permiso para eliminar esta clase');
  }

  await classToDelete.destroy();
  res.json({ message: 'Clase eliminada exitosamente' });
});
