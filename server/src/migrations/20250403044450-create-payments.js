'use strict';
/** @type {import('sequelize-cli').Migration} */module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', { // ← Nota: minúsculas para consistencia
      payment_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID, 
        allowNull: false,
      },
      course_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending'
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_details: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // 1. Clave foránea para user_id (referencia a users.user_id)
    await queryInterface.addConstraint('payments', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_payments_user',
      references: {
        table: 'users', // ← Nombre exacto de la tabla (minúsculas)
        field: 'user_id'
      },
      onDelete: 'RESTRICT', // o 'CASCADE' según tu necesidad
      onUpdate: 'CASCADE'
    });

    // 2. Clave foránea para course_id (referencia a courses.course_id)
    await queryInterface.addConstraint('payments', {
      fields: ['course_id'],
      type: 'foreign key',
      name: 'fk_payments_course',
      references: {
        table: 'courses', // ← Nombre exacto de la tabla
        field: 'course_id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });

    // Índices para optimización
    await queryInterface.addIndex('payments', ['user_id']);
    await queryInterface.addIndex('payments', ['course_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('payments');
  }
};