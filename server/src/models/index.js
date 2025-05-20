const { Sequelize, DataTypes } = require("sequelize");
const { development: config } = require("../config/config.json");

const connection = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    dialectModule: require("mysql2"),
    logging: false,
});

(async () => {
    try {
        await connection.authenticate();
        console.log("Base de datos conectada exitosamente");
    } catch (error) {
        console.log("Error al conectar a la base de datos", error);
    }
})();

// Importar modelos
const UserModel = require("./user.js");
const RoleModel = require("./role.js");
const CourseModel = require("./course.js");
const SchoolModel = require("./school.js");
const ClassModel = require("./class.js");
const AttendanceModel = require("./attendance.js");
const PaymentModel = require("./payment.js");

const UserSchoolRoleModel = require("./userSchoolRole.js");
const CourseTeacherModel = require("./courseTeacher.js");
const EnrollmentModel = require("./enrollment.js");
const payment = require("./payment.js");

// Inicializar modelos
const User = UserModel(connection, DataTypes);
const Role = RoleModel(connection, DataTypes);
const Course = CourseModel(connection, DataTypes);
const School = SchoolModel(connection, DataTypes);
const Class = ClassModel(connection, DataTypes);
const Attendance = AttendanceModel(connection, DataTypes);
const Payment = PaymentModel(connection, DataTypes);
const UserSchoolRole = UserSchoolRoleModel(connection, DataTypes);
const CourseTeacher = CourseTeacherModel(connection, DataTypes);
const Enrollment = EnrollmentModel(connection, DataTypes);

// Asociaciones

// Roles
Role.hasMany(User, { as: "users", foreignKey: "role_id" });
User.belongsTo(Role, { as: "role", foreignKey: "role_id" });

// Escuelas y Cursos
School.hasMany(Course, { as: "courses", foreignKey: "school_id" });
Course.belongsTo(School, { as: "school", foreignKey: "school_id" });

// Relación muchos-a-muchos entre User y School a través de UserSchoolRole
User.belongsToMany(School, {
    through: UserSchoolRole,
    as: "schools", 
    foreignKey: "user_id",
    otherKey: "school_id"
});
School.belongsToMany(User, {
    through: UserSchoolRole,
    as: "users", 
    foreignKey: "school_id",
    otherKey: "user_id"
});

// Relación muchos-a-muchos entre Course y User (estudiantes) a través de Enrollment
Course.belongsToMany(User, {
    through: Enrollment,
    as: 'students', 
    foreignKey: 'course_id',
    otherKey: 'user_id'
});
  
User.belongsToMany(Course, {
    through: Enrollment,
    as: 'enrolledCourses', 
    foreignKey: 'user_id',
    otherKey: 'course_id'
});

// Relación muchos-a-muchos entre Course y User (profesores) a través de CourseTeacher
Course.belongsToMany(User, {
    through: CourseTeacher,
    as: "teachers", 
    foreignKey: "course_id",
    otherKey: "teacher_id"
});
User.belongsToMany(Course, {
    through: CourseTeacher,
    as: "teachingCourses", 
    foreignKey: "teacher_id",
    otherKey: "course_id"
});

// Relaciones para modelos de unión
CourseTeacher.belongsTo(Course, { foreignKey: "course_id", as: "course" });
CourseTeacher.belongsTo(User, { foreignKey: "teacher_id", as: "teacher" });

UserSchoolRole.belongsTo(User, { foreignKey: "user_id", as: "user" });
UserSchoolRole.belongsTo(School, { foreignKey: "school_id", as: "school" });
UserSchoolRole.belongsTo(Role, { foreignKey: "role_id", as: "role" });
Enrollment.belongsTo(Course, { foreignKey: "course_id", as: "course" });
Course.hasMany(Enrollment, { foreignKey: "course_id", as: "enrollments" });
Enrollment.belongsTo(User, { foreignKey: "user_id", as: "student" });
User.hasMany(Enrollment, { foreignKey: "user_id", as: "enrollments" });


// Class
Course.hasMany(Class, { as: "classes", foreignKey: "course_id" });
Class.belongsTo(Course, { as: "course", foreignKey: "course_id" });

User.hasMany(Class, { as: "taughtClasses", foreignKey: "teacher_id" });
Class.belongsTo(User, { as: "teacher", foreignKey: "teacher_id" });

// Attendance
Class.hasMany(Attendance, { as: "attendances", foreignKey: "class_id" });
Attendance.belongsTo(Class, { as: "class", foreignKey: "class_id" });

User.hasMany(Attendance, { as: "studentAttendances", foreignKey: "user_id" }); // Cambiado el alias para evitar conflicto
Attendance.belongsTo(User, { as: "student", foreignKey: "user_id" });

// Payment
User.hasMany(Payment, { foreignKey: "user_id", as: "payments" });
Payment.belongsTo(User, { foreignKey: "user_id", as: "user" });

Course.hasMany(Payment, { foreignKey: "course_id", as: "payments" });
Payment.belongsTo(Course, { foreignKey: "course_id", as: "course" });

module.exports = {
    User,
    Role,
    Course,
    School,
    UserSchoolRole,
    CourseTeacher,
    Enrollment,
    Class,
    Attendance,
    Payment,
    connection,
};