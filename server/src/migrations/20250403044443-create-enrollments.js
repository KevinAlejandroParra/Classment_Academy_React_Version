'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('enrollments', {
      enrollment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      course_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      course_price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active','completed','cancelled','pending'),
        allowNull: false,
        defaultValue: 'active'
      },
      progress: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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

    // Agregar las llaves foráneas después de crear la tabla
    await queryInterface.addConstraint('enrollments', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_enrollments_user',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onDelete: 'cascade'
    });

    await queryInterface.addConstraint('enrollments', {
      fields: ['course_id'],
      type: 'foreign key',
      name: 'fk_enrollments_course',
      references: {
        table: 'courses',
        field: 'course_id'
      },
      onDelete: 'cascade'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('enrollments');
  }
};