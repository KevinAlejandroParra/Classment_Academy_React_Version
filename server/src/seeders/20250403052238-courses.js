"use strict";
const { courses, schools, user_school_roles, enrollments, classes, attendances , course_teachers} = require("./data.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         */
        await queryInterface.bulkInsert("Courses", courses, {});
        await queryInterface.bulkInsert("Schools", schools, {});
        await queryInterface.bulkInsert("user_school_roles",user_school_roles , {});
        await queryInterface.bulkInsert("enrollments",enrollments , {});
        await queryInterface.bulkInsert("Classes",classes , {});
        await queryInterface.bulkInsert("Attendances",attendances , {});
        await queryInterface.bulkInsert("course_teachers",course_teachers , {});

    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         */
        await queryInterface.bulkDelete("Courses", null, {});
        await queryInterface.bulkDelete("Schools", null, {});
        await queryInterface.bulkDelete("UserSchoolRol", null, {});
        await queryInterface.bulkDelete("Enrollments", null, {});
        await queryInterface.bulkDelete("Classes", null, {});
        await queryInterface.bulkDelete("Attendances", null, {});
        await queryInterface.bulkDelete("course_teachers", null, {});
        
    },
};
