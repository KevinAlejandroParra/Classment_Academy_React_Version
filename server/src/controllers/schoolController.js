const { School, Course } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');

// Obtener todas las escuelas
exports.getAllSchools = asyncHandler(async (req, res) => {
  const schools = await School.findAll();
  
  return res.status(200).json({
    success: true,
    data: schools
  });
});

// Obtener una escuela por ID con sus cursos
exports.getSchoolById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const school = await School.findByPk(id, {
    include: [{ 
      model: Course, 
      as: 'courses' // Usando el alias definido en las asociaciones
    }]
  });
  
  if (!school) {
    const error = new Error('Escuela no encontrada');
    error.statusCode = 404;
    throw error;
  }
  
  return res.status(200).json({
    success: true,
    data: school
  });
});

// Crear una nueva escuela
exports.createSchool = asyncHandler(async (req, res) => {
  const {
    teacher_id,
    school_name,
    school_description,
    school_phone,
    school_address,
    school_image,
    school_email
  } = req.body;
  
  // Validar campos requeridos
  if (!teacher_id || !school_name || !school_description || !school_phone || 
      !school_address || !school_image || !school_email) {
    const error = new Error('Todos los campos son requeridos');
    error.statusCode = 400;
    throw error;
  }
  
  const newSchool = await School.create({
    teacher_id,
    school_name,
    school_description,
    school_phone,
    school_address,
    school_image,
    school_email
  });
  
  return res.status(201).json({
    success: true,
    message: 'Escuela creada exitosamente',
    data: newSchool
  });
});

// Actualizar una escuela existente
exports.updateSchool = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    teacher_id,
    school_name,
    school_description,
    school_phone,
    school_address,
    school_image,
    school_email
  } = req.body;
  
  const school = await School.findByPk(id);
  
  if (!school) {
    const error = new Error('Escuela no encontrada');
    error.statusCode = 404;
    throw error;
  }
  
  await school.update({
    teacher_id,
    school_name,
    school_description,
    school_phone,
    school_address,
    school_image,
    school_email
  });
  
  return res.status(200).json({
    success: true,
    message: 'Escuela actualizada exitosamente',
    data: school
  });
});

// Eliminar una escuela
exports.deleteSchool = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const school = await School.findByPk(id);
  
  if (!school) {
    const error = new Error('Escuela no encontrada');
    error.statusCode = 404;
    throw error;
  }
  
  // Verificar si hay cursos asociados a esta escuela
  const associatedCourses = await Course.findAll({
    where: { school_id: id }
  });
  
  if (associatedCourses.length > 0) {
    const error = new Error('No se puede eliminar la escuela porque tiene cursos asociados');
    error.statusCode = 400;
    throw error;
  }
  
  await school.destroy();
  
  return res.status(200).json({
    success: true,
    message: 'Escuela eliminada exitosamente'
  });
});