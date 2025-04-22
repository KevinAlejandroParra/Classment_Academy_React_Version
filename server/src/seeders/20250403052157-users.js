"use strict";
const { users, roles } = require("./data.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            // Primero los roles
            await queryInterface.bulkInsert("Roles", roles, {});
            
            // Luego los usuarios
            await queryInterface.bulkInsert("Users", users, {});
        } catch (error) {
            console.error('Error en el seeding de usuarios y roles:', error);
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         */
        await queryInterface.bulkDelete("Users", null, {});
        await queryInterface.bulkDelete("Roles", null, {});
    },
};
