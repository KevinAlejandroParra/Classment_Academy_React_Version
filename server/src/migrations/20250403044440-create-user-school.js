"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("UserSchools", {
            user_id: {
                type: Sequelize.UUID,
                allowNull: false
            },
            school_id: {
                type: Sequelize.UUID,
                allowNull: false
            },
            is_owner: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            is_teacher: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            is_coordinator: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
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
            }
        });

        await queryInterface.addConstraint('UserSchools', {
            fields: ['user_id'],
            type: 'foreign key',
            name: 'fk_userschool_user',
            references: {
                table: 'Users',
                field: 'user_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addConstraint('UserSchools', {
            fields: ['school_id'],
            type: 'foreign key',
            name: 'fk_userschool_school',
            references: {
                table: 'Schools',
                field: 'school_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addConstraint('UserSchools', {
            fields: ['user_id', 'school_id'],
            type: 'primary key',
            name: 'pk_userschool'
        });

        await queryInterface.addIndex('UserSchools', ['user_id', 'school_id'], {
            unique: true,
            name: 'idx_userschool_unique'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("UserSchools");
    },
};