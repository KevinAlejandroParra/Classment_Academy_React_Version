const { School, Course, User, UserSchoolRole } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');

// Obtener todas las escuelas
exports.getAllSchools = (async (req, res) => {
  let schools;

  try {
    schools = await School.findAll({
      include: [{
        model: User,
        as: 'users',
        through: {
          attributes: ['role_id'] 
        },
        attributes: ['user_id', 'user_name', 'user_lastname', 'user_email']
      }]
    });

    console.log('Schools found:', schools.length);
    
    return res.status(200).json({
      success: true,
      data: schools
    });
  } catch (error) {
    console.error('Error in getAllSchools:', error);
    throw error;
  }
});

// Obtener una escuela por ID con sus cursos
exports.getSchoolById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const school = await School.findByPk(id, {
    include: [
      { 
        model: Course, 
        as: 'courses',
        attributes: ['course_id', 'course_name', 'course_description'],
        include: [{
          model: User,
          as: 'teachers',
          attributes: ['user_id', 'user_name', 'user_lastname', 'user_email']
        }]
      },
      {
        model: User,
        as: 'users',
        through: {
          where: { role_id: 4 }, // Solo coordinadores
          attributes: ['role_id']
        },
        attributes: ['user_id', 'user_name', 'user_lastname', 'user_email']
      }
    ]
  });
  
  if (!school) {
    const error = new Error('Escuela no encontrada');
    error.statusCode = 404;
    throw error;
  }

  // Formatear la respuesta para incluir coordinadores
  const formattedSchool = {
    ...school.toJSON(),
    coordinators: school.users || [],
  };
  delete formattedSchool.users;
  
  return res.status(200).json({
    success: true,
    data: formattedSchool
  });
});

// Crear una nueva escuela
exports.createSchool = asyncHandler(async (req, res) => {
  const { school_name, school_description, school_phone, school_address, school_image, school_email } = req.body;
  const user_id = req.user.user_id;
  const role_id = req.user.role_id;

  // Verificar que el usuario es un admin o coordinador
  if (![3, 4].includes(role_id)) {
    const error = new Error('Solo los administradores y coordinadores pueden crear escuelas');
    error.statusCode = 403;
    throw error;
  }

  // Crear la escuela
  const school = await School.create({
    school_name,
    school_description,
    school_phone,
    school_address,
    school_image,
    school_email
  });

  // Si es coordinador, crear la relación en user_school_roles
  if (role_id === 4) {
    await UserSchoolRole.create({
      user_id: user_id,
      school_id: school.school_id,
      role_id: role_id
    });
  }

  return res.status(201).json({
    success: true,
    data: school,
    message: "Escuela creada exitosamente"
  });
});

// Actualizar una escuela existente
exports.updateSchool = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.user_id;
  const role_id = req.user.role_id;
  const updateData = req.body;

  // Si no es admin, verificar que sea el coordinador de la escuela
  if (role_id !== 3) {
    const userSchool = await UserSchoolRole.findOne({
      where: {
        school_id: id,
        user_id: user_id,
        role_id: 4
      }
    });

    if (!userSchool) {
      const error = new Error('No tienes permisos para modificar esta escuela');
      error.statusCode = 403;
      throw error;
    }
  }

  const school = await School.findByPk(id);
  if (!school) {
    const error = new Error('Escuela no encontrada');
    error.statusCode = 404;
    throw error;
  }

  await school.update(updateData);

  return res.status(200).json({
    success: true,
    data: school,
    message: "Escuela actualizada correctamente"
  });
});

// Eliminar una escuela
exports.deleteSchool = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.user_id;
  const role_id = req.user.role_id;

  // Solo el admin puede eliminar escuelas
  if (role_id !== 3) {
    const error = new Error('Solo los administradores pueden eliminar escuelas');
    error.statusCode = 403;
    throw error;
  }

  const school = await School.findByPk(id);
  if (!school) {
    const error = new Error('Escuela no encontrada');
    error.statusCode = 404;
    throw error;
  }

  await school.destroy();

  return res.status(200).json({
    success: true,
    message: "Escuela eliminada correctamente"
  });
});

// Obtener escuelas del admin
exports.getCoordinatorSchools = asyncHandler(async (req, res) => {
  const coordinator_id = req.user.user_id;

  const schools = await School.findAll({
    include: [
      {
        model: User,
        as: "users",
        where: { user_id: coordinator_id },
        attributes: ["user_id", "user_name", "user_lastname", "user_email"]
      }
    ]
  });

  return res.status(200).json({
    success: true,
    data: schools,
    message: "Escuelas del coordinador obtenidas correctamente"
  });
});