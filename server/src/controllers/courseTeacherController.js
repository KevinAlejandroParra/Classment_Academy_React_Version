const { CourseTeacher, UserSchoolRole,Course, User } = require("../models");

class CourseTeacherController {
  // Asociar un profesor a un curso
  static async assignTeacherToCourse(req, res) {
    try {
  
      const { course_id, teacher_id } = req.body;
      const admin_id = req.user.user_id;
  
      if (req.user.role_id !== 3) {
        return res.status(403).json({ message: "Solo los administradores pueden asignar profesores." });
      }
  
      const course = await Course.findByPk(course_id);
      if (!course) return res.status(404).json({ message: "Curso no encontrado." });
  
      const userAdminOfSchool = await UserSchoolRole.findOne({
        where: {
          user_id: admin_id,
          school_id: course.school_id,
          role_id: 3
        }
      });
  
      if (!userAdminOfSchool) {
        return res.status(403).json({ message: "No puedes asignar profesores a cursos que no administras." });
      }
  
      const teacher = await User.findByPk(teacher_id);
      if (!teacher || teacher.role_id !== 2) {
        return res.status(400).json({ message: "El usuario asignado no es un profesor válido." });
      }
  
      const alreadyAssigned = await CourseTeacher.findOne({ where: { course_id, teacher_id } });
      if (alreadyAssigned) {
        return res.status(400).json({ message: "El profesor ya está asignado a este curso." });
      }
  
      const assignment = await CourseTeacher.create({ course_id, teacher_id });
      return res.status(201).json({ success: true, message: "Profesor asignado con éxito", data: assignment });
  
    } catch (error) {
      console.error("Error al asignar profesor:", error);
      return res.status(500).json({ message: "Error interno", error: error.message });
    }
  }
  
  // Quitar profesor de un curso
  static async removeTeacherFromCourse(req, res) {
    try {
      console.log(" req.user en removeTeacherFromCourse:", req.user);
  
      const { course_id, teacher_id } = req.body;
      const admin_id = req.user.user_id;
  
      if (req.user.role_id !== 3) {
        return res.status(403).json({ message: "Solo los administradores pueden quitar profesores." });
      }
  
      const course = await Course.findByPk(course_id);
      if (!course) return res.status(404).json({ message: "Curso no encontrado." });
  
      // Validar que el admin está relacionado a la escuela de este curso
      const isAdminOfSchool = await UserSchoolRole.findOne({
        where: {
          user_id: admin_id,
          school_id: course.school_id,
          role_id: 3
        }
      });
  
      if (!isAdminOfSchool) {
        return res.status(403).json({ message: "No puedes modificar cursos que no administras." });
      }
  
      const deleted = await CourseTeacher.destroy({
        where: { course_id, teacher_id }
      });
  
      if (deleted === 0) {
        return res.status(404).json({ message: "No se encontró la asignación para eliminar." });
      }
  
      return res.status(200).json({ success: true, message: "Profesor removido del curso con éxito." });
  
    } catch (error) {
      console.error("Error al remover profesor:", error);
      return res.status(500).json({ message: "Error interno", error: error.message });
    }
  }
  
}  

module.exports = CourseTeacherController;

