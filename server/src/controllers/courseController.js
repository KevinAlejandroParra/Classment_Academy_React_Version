const { Course, School, Enrollment, User, Attendance, Class } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');
const { createTransporter } = require('../config/emailConfig');

// Obtener todos los cursos
exports.getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
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

// Obtener un curso por ID
exports.getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const course = await Course.findByPk(id, {
    include: [
      { model: School, as: "school" },
      { model: User, as: "teachers", through: { attributes: [] } }, 
      { model: User, as: "students", through: { model: Enrollment, attributes: ['status', 'progress', 'course_price', 'createdAt', 'updatedAt'] } } 
    ]
  })  
  
  if (!course) {
    const error = new Error(`Curso con ID ${id} no encontrado`);
    error.statusCode = 404;
    error.details = {
      requestedId: id,
      availableCourses: await Course.findAll({ attributes: ['course_id'], raw: true })
    };
    throw error;
  }
  
  return res.status(200).json({
    success: true,
    data: course
  });
});

// Obtener todos los cursos con sus profesores
exports.getCoursesWithTeachers = asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: [
      { 
        model: School, 
        as: 'school',
        attributes: ['school_id', 'school_name']
      },
      {
        model: User,
        as: 'teachers',
        through: { attributes: [] },
        attributes: ['user_id', 'user_name', 'user_lastname', 'user_image', 'user_phone'],
        where: { role_id: 2 } 
      }
    ],
    attributes: [
      'course_id', 
      'course_name', 
      'course_description', 
      'course_price', 
      'course_image',
      'course_places',
      'course_age'
    ]
  });
  
  const formattedCourses = courses.map(course => {
    const courseJson = course.toJSON();
    return {
      ...courseJson,
      profesor_encargado: courseJson.teachers.length > 0 ? courseJson.teachers[0] : null,
      teachers: undefined
    };
  });

  return res.status(200).json({
    success: true,
    data: formattedCourses
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
    course_name,
    course_description,
    course_price,
    course_places,
    course_age,
    school_id
  } = req.body;
  
  // Validar campos requeridos
  if (!school_id || !course_name || !course_description || !course_price || 
      !course_places || !course_age) {
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

  // Procesar la imagen si se subió una
  let course_image = null;
  if (req.file) {
    course_image = `/images/cursos/${req.file.filename}`;
  } else {
    const error = new Error('La imagen del curso es requerida');
    error.statusCode = 400;
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
    course_name,
    course_description,
    course_price,
    course_places,
    course_age,
    school_id
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

  // Procesar la imagen si se subió una nueva
  let course_image = course.course_image;
  if (req.file) {
    course_image = `/images/cursos/${req.file.filename}`;
  }
  
  await course.update({
    school_id: school_id || course.school_id,
    course_name: course_name || course.course_name,
    course_description: course_description || course.course_description,
    course_price: course_price || course.course_price,
    course_places: course_places || course.course_places,
    course_age: course_age || course.course_age,
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

// Obtener estudiantes inscritos en un curso
exports.getStudentsByCourseId = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  // Verificar si el curso existe
  const course = await Course.findByPk(courseId, {
    include: [
      {
        model: User,
        as: 'students',
        through: {
          model: Enrollment,
          attributes: ['status', 'progress', 'course_price', 'createdAt', 'updatedAt'] 
        },
        attributes: ['user_id', 'user_name', 'user_lastname', 'user_image']
      }
    ]
  });

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Curso no encontrado'
    });
  }

  return res.status(200).json({
    success: true,
    data: course.students // Devuelve la lista de estudiantes
  });
});

// Activar o desactivar un curso y notificar a los estudiantes
exports.toggleCourseState = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.user_id;

  // Verificar si el curso existe
  const course = await Course.findByPk(id, {
    include: [
      { model: School, as: 'school' },
      { 
        model: User, 
        as: 'students',
        through: { 
          model: Enrollment,
          attributes: ['enrollment_id', 'status', 'progress', 'course_price', 'createdAt', 'updatedAt']
        }
      }
    ]
  });

  if (!course) {
    const error = new Error('Curso no encontrado');
    error.statusCode = 404;
    throw error;
  }

  // Verificar si el usuario es profesor o administrador del curso
  const isTeacher = await course.hasTeachers(userId);
  const isAdmin = await course.school.hasUser(userId, { through: { role_id: 3 } });

  if (!isTeacher && !isAdmin) {
    const error = new Error('No tienes permiso para cambiar el estado de este curso');
    error.statusCode = 403;
    throw error;
  }

  // Cambiar el estado del curso
  const newState = course.course_state === 'active' ? 'inactive' : 'active';
  await course.update({ course_state: newState });

  // Si el curso se está desactivando, notificar a los estudiantes
  if (newState === 'inactive') {
    const transporter = createTransporter();

    for (const student of course.students) {
      const enrollment = student.Enrollment;
      
      // Obtener el historial de asistencia del estudiante
      const attendance = await Attendance.findAll({
        include: [
          {
            model: Class,
            as: 'class',
            where: { course_id: id },
            attributes: ['class_id', 'class_date', 'class_title']
          }
        ],
        where: { user_id: student.user_id },
        order: [[{ model: Class, as: 'class' }, 'class_date', 'ASC']]
      });

      // Calcular estadísticas de asistencia
      const totalClasses = attendance.length;
      const presentClasses = attendance.filter(a => a.status === 'present').length;
      const lateClasses = attendance.filter(a => a.status === 'late').length;
      const absentClasses = attendance.filter(a => a.status === 'absent').length;
      const progress = Math.round((presentClasses / totalClasses) * 100) || 0;

      // Actualizar el estado de la matrícula a 'completed'
      if (enrollment && enrollment.enrollment_id) {
        await Enrollment.update(
          { 
            status: 'completed',
            progress
          },
          {
            where: {
              enrollment_id: enrollment.enrollment_id
            }
          }
        );
      }

      const emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color:rgb(84, 84, 84);
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .logo {
              max-width: 150px;
              margin-bottom: 15px;
            }
            .content {
              background-color: #ffffff;
              padding: 20px;
              border: 1px solid #e0e0e0;
              border-radius: 0 0 5px 5px;
            }
            .stats {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .progress-bar {
              background-color: #e9ecef;
              border-radius: 10px;
              height: 20px;
              margin: 10px 0;
            }
            .progress {
              background-color:rgb(250, 212, 0);
              height: 100%;
              border-radius: 10px;
              text-align: center;
              color: white;
              line-height: 20px;
              font-size: 12px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://static.vecteezy.com/system/resources/previews/007/995/319/non_2x/lion-shield-logo-design-vector.jpg" alt="Classment Academy Logo" class="logo">
              <h1>¡Curso Finalizado!</h1>
            </div>
            <div class="content">
              <h2>¡Felicitaciones ${student.user_name}!</h2>
              <p>Has completado el curso <strong>${course.course_name}</strong> en ${course.school.school_name}.</p>
              
              <div class="stats">
                <h3>Tu Progreso</h3>
                <div class="progress-bar">
                  <div class="progress" style="width: ${progress}%">${progress}%</div>
                </div>
                
                <h3>Estadísticas de Asistencia</h3>
                <ul>
                  <li>Clases Totales: ${totalClasses}</li>
                  <li>Asistencias: ${presentClasses}</li>
                  <li>Tardanzas: ${lateClasses}</li>
                  <li>Ausencias: ${absentClasses}</li>
                </ul>
              </div>

              <p>Hemos desactivado el curso ${course.course_name} porque ya no está disponible, pero hay un monton de cursos nuevos que te pueden interesar.</p>
              
              <p>¡Gracias por ser parte de nuestra comunidad educativa!</p>
              <p>Te esperamos por acá cuando decidas seguir creciendo🦁</p>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no responda a este mensaje.</p>
              <p>© 2024 Classment Academy. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Enviar el correo
      try {
        await transporter.sendMail({
          from: `"Classment Academy" <${process.env.EMAIL_USER}>`,
          to: student.user_email,
          subject: `¡Curso Finalizado: ${course.course_name}!`,
          html: emailContent
        });
      } catch (error) {
        console.error(`Error enviando correo a ${student.user_email}:`, error);
        // Continuar con el siguiente estudiante si hay error en el correo
      }
    }
  }

  return res.status(200).json({
    success: true,
    message: `Curso ${newState === 'active' ? 'activado' : 'desactivado'} exitosamente`,
    data: {
      course_id: course.course_id,
      course_name: course.course_name,
      course_state: newState
    }
  });
});