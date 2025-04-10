const { School, Course, User, UserSchool } = require('../models');
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
  try {
    const { school_name, school_description, school_phone, school_address, school_image, school_email } = req.body;
    const coordinator_id = req.user.user_id; // Obtenido del token de autenticación

    // Verificar que el usuario es un coordinador
    const coordinator = await User.findByPk(coordinator_id);
    if (!coordinator || coordinator.role_id !== 4) { // 4 es el ID del rol de coordinador
      return res.status(403).json({
        success: false,
        message: "Solo los coordinadores pueden crear escuelas"
      });
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

    // Crear la relación entre el coordinador y la escuela
    await UserSchool.create({
      user_id: coordinator_id,
      school_id: school.school_id,
      is_owner: true
    });

    return res.status(201).json({
      success: true,
      data: school,
      message: "Escuela creada exitosamente"
    });
  } catch (error) {
    console.error("Error al crear escuela:", error);
    return res.status(500).json({
      success: false,
      message: "Error al crear la escuela",
      error: error.message
    });
  }
});

// Actualizar una escuela existente
exports.updateSchool = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const coordinator_id = req.user.user_id;
    const updateData = req.body;

    // Verificar que el usuario es el coordinador de la escuela
    const userSchool = await UserSchool.findOne({
      where: {
        school_id: id,
        user_id: coordinator_id,
        is_owner: true
      }
    });

    if (!userSchool) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para modificar esta escuela"
      });
    }

    const school = await School.findByPk(id);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "Escuela no encontrada"
      });
    }

    await school.update(updateData);

    return res.status(200).json({
      success: true,
      data: school,
      message: "Escuela actualizada correctamente"
    });
  } catch (error) {
    console.error("Error al actualizar escuela:", error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la escuela",
      error: error.message
    });
  }
});

// Eliminar una escuela
exports.deleteSchool = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const coordinator_id = req.user.user_id;

    // Verificar que el usuario es el coordinador de la escuela
    const userSchool = await UserSchool.findOne({
      where: {
        school_id: id,
        user_id: coordinator_id,
        is_owner: true
      }
    });

    if (!userSchool) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para eliminar esta escuela"
      });
    }

    const school = await School.findByPk(id);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "Escuela no encontrada"
      });
    }

    await school.destroy();

    return res.status(200).json({
      success: true,
      message: "Escuela eliminada correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar escuela:", error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar la escuela",
      error: error.message
    });
  }
});

// Obtener escuelas del coordinador
exports.getCoordinatorSchools = asyncHandler(async (req, res) => {
  try {
    const coordinator_id = req.user.user_id;

    const schools = await School.findAll({
      include: [
        {
          model: User,
          as: "coordinators",
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
  } catch (error) {
    console.error("Error al obtener escuelas del coordinador:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener las escuelas del coordinador",
      error: error.message
    });
  }
});