"use strict";
/** @type {import('sequelize-cli').Migration} */
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('course_teachers', {
      course_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      teacher_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
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

    await queryInterface.addConstraint('course_teachers', {
      fields: ['course_id'],
      type: 'foreign key',
      references: { table: 'courses', field: 'course_id' },
      onDelete: 'cascade'
    });

    await queryInterface.addConstraint('course_teachers', {
      fields: ['course_id'],
      type: 'foreign key',
      name: 'fk_course_teachers_course',
      references: {
        table: 'courses',
        field: 'course_id'
      },
      onDelete: 'cascade'
    });

    await queryInterface.addConstraint('course_teachers', {
        fields: ['teacher_id'],
        type: 'foreign key',
        name: 'fk_course_teachers_teacher',
        references: {
          table: 'users',
          field: 'user_id'
        },
        onDelete: 'cascade'
      });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('course_teachers');
  }
};
