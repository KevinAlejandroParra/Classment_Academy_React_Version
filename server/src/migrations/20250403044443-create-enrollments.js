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
      plan_type: {
        type: Sequelize.ENUM('anual','mensual','semestral','trimestral'),
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
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

     // FK: user_id → users
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
  
      // FK: course_id → courses
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
      // Es buena práctica eliminar los ENUMs también al hacer rollback
      await queryInterface.dropTable('enrollments');
    }
  };