"use strict";
const { courses, schools, user_school_roles, enrollments, classes, attendances , course_teachers} = require("./data.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            // Primero las escuelas
            await queryInterface.bulkInsert("Schools", schools, {});
            
            // Luego los cursos
            await queryInterface.bulkInsert("Courses", courses, {});
            
            // Después las relaciones usuario-escuela-rol
            await queryInterface.bulkInsert("user_school_roles", user_school_roles, {});
            
            // Luego las matrículas
            await queryInterface.bulkInsert("Enrollments", enrollments, {});
            
            // Después las clases
            await queryInterface.bulkInsert("Classes", classes, {});
            
            // Finalmente las asistencias
            await queryInterface.bulkInsert("Attendances", attendances, {});
        } catch (error) {
            console.error('Error en el seeding:', error);
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        // Eliminar en orden inverso
        await queryInterface.bulkDelete("Attendances", null, {});
        await queryInterface.bulkDelete("Classes", null, {});
        await queryInterface.bulkDelete("Enrollments", null, {});
        await queryInterface.bulkDelete("user_school_roles", null, {});
        await queryInterface.bulkDelete("Courses", null, {});
        await queryInterface.bulkDelete("Schools", null, {});
    },
};
