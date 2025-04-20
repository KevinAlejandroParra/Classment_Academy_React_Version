const { Course, School, Enrollment, User } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');

// Obtener todos los cursos
exports.getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: [{ 
      model: School, 
      as: 'school' // Usando el alias definido en las asociaciones
    }]
  });
  
  return res.status(200).json({
    success: true,
    data: courses
  });
});

// Obtener un curso por ID
exports.getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const course = await Course.findByPk(id, {
    include: [
      { 
        model: School, 
        as: 'school' 
      },
      {
        model: User,
        as: 'teachers',
        through: { attributes: [] } // No incluir atributos de la tabla intermedia
      },
      {
        model: User,
        as: 'students',
        through: {
          model: Enrollment,
          attributes: ['plan_type', 'status', 'start_date', 'end_date', 'progress']
        }
      }
    ]
  });
  
  if (!course) {
    const error = new Error('Curso no encontrado');
    error.statusCode = 404;
    throw error;
  }
  
  return res.status(200).json({
    success: true,
    data: course
  });
});

// Obtener cursos por escuela
exports.getCoursesBySchoolId = asyncHandler(async (req, res) => {
  const { schoolId } = req.params;
  
  // Verificar si la escuela existe
  const school = await School.findByPk(schoolId);
  
  if (!school) {
    const error = new Error('Escuela no encontrada');
    error.statusCode = 404;
    throw error;
  }
  
  const courses = await Course.findAll({
    where: { school_id: schoolId },
    include: [{ 
      model: School, 
      as: 'school' 
    }]
  });
  
  return res.status(200).json({
    success: true,
    data: courses
  });
});

// Crear un nuevo curso
exports.createCourse = asyncHandler(async (req, res) => {
  const {
    school_id,
    course_name,
    course_description,
    course_price,
    course_places,
    course_age,
    course_image
  } = req.body;
  
  // Validar campos requeridos
  if (!school_id || !course_name || !course_description || !course_price || 
      !course_places || !course_age || !course_image) {
    const error = new Error('Todos los campos son requeridos');
    error.statusCode = 400;
    throw error;
  }
  
  // Verificar si la escuela existe
  const school = await School.findByPk(school_id);
  
  if (!school) {
    const error = new Error('Escuela no encontrada');
    error.statusCode = 404;
    throw error;
  }
  
  const newCourse = await Course.create({
    school_id,
    course_name,
    course_description,
    course_price,
    course_places,
    course_age,
    course_image
  });
  
  return res.status(201).json({
    success: true,
    message: 'Curso creado exitosamente',
    data: newCourse
  });
});

// Actualizar un curso existente
exports.updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    school_id,
    course_name,
    course_description,
    course_price,
    course_places,
    course_age,
    course_image
  } = req.body;
  
  const course = await Course.findByPk(id);
  
  if (!course) {
    const error = new Error('Curso no encontrado');
    error.statusCode = 404;
    throw error;
  }
  
  // Si se cambia la escuela, verificar que la nueva escuela exista
  if (school_id && school_id !== course.school_id) {
    const school = await School.findByPk(school_id);
    
    if (!school) {
      const error = new Error('Escuela no encontrada');
      error.statusCode = 404;
      throw error;
    }
  }
  
  await course.update({
    school_id,
    course_name,
    course_description,
    course_price,
    course_places,
    course_age,
    course_image
  });
  
  return res.status(200).json({
    success: true,
    message: 'Curso actualizado exitosamente',
    data: course
  });
});

// Eliminar un curso
exports.deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const course = await Course.findByPk(id);
  
  if (!course) {
    const error = new Error('Curso no encontrado');
    error.statusCode = 404;
    throw error;
  }
  
  // Verificar si hay usuarios inscritos usando Enrollment
  const enrollments = await Enrollment.count({
    where: { course_id: id }
  });
  
  if (enrollments > 0) {
    const error = new Error('No se puede eliminar el curso porque tiene usuarios inscritos');
    error.statusCode = 400;
    throw error;
  }
  
  await course.destroy();
  
  return res.status(200).json({
    success: true,
    message: 'Curso eliminado exitosamente'
  });
});