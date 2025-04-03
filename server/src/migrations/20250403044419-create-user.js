"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Users", {
            user_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            user_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            user_lastname: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            user_document_type: {
                type: Sequelize.ENUM("TI", "CC", "CE"),
                allowNull: false,
            },
            user_document: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            user_email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            user_phone: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            user_image: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            user_birth: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            user_role: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            role_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                onUpdate: Sequelize.NOW,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Users");
    },
};
