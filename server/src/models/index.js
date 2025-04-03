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

const UserModel = require("./user.js");
const RoleModel = require("./role.js");
const CourseModel = require("./course.js");
const SchoolModel = require("./school.js");
const UserCourseModel = require("./usercourse.js");

const User = UserModel(connection, DataTypes);
const Role = RoleModel(connection, DataTypes);
const Course = CourseModel(connection, DataTypes);
const School = SchoolModel(connection, DataTypes);
const UserCourse = UserCourseModel(connection, DataTypes);

Role.hasMany(User, { as: "users", foreignKey: "role_id" });
User.belongsTo(Role, { as: "role", foreignKey: "role_id" });

School.hasMany(Course, { as: "courses", foreignKey: "school_id" });
Course.belongsTo(School, { as: "school", foreignKey: "school_id" });

Course.belongsToMany(User, { through: UserCourse, as: "students", foreignKey: "course_id" });
User.belongsToMany(Course, { through: UserCourse, as: "courses", foreignKey: "user_id" });

module.exports = {
    User,
    Role,
    Course,
    School,
    UserCourse,
    connection,
};
